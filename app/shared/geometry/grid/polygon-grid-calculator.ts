import { Point } from '~/shared/geometry/core/point';
import { Segment } from '~/shared/geometry/core/segment';
import type { PlacedPolygon } from '~/shared/geometry/core/placed-polygon';
import { assertValidGridSettings, type GridSettings } from '~/shared/geometry/grid/grid-settings';
import type { GridLineDirection, GridSegment } from '~/shared/geometry/grid/grid-segment';
import type {
  InnerGridIntersection,
  SideGridIntersection,
} from '~/shared/geometry/grid/grid-intersection';

const EPSILON = 1e-7;

interface LineClipResult {
  gridSegments: GridSegment[];
  sideIntersections: SideGridIntersection[];
}

export interface PolygonGridCalculationResult {
  parallelSegments: GridSegment[];
  perpendicularSegments: GridSegment[];
  sideIntersections: SideGridIntersection[];
  innerIntersections: InnerGridIntersection[];
  excludedInnerIntersections: InnerGridIntersection[];
  parallelLength: number;
  perpendicularLength: number;
  totalLength: number;
}

/**
 * Calculates a rectangular grid for any already placed polygon.
 *
 * The important assumption is that the polygon has already been aligned by the selected main side:
 * parallel grid lines are horizontal, perpendicular grid lines are vertical. Because of that this
 * class does not need separate triangle/trapezoid logic.
 */
export class PolygonGridCalculator {
  public calculate(polygon: PlacedPolygon, settings: GridSettings): PolygonGridCalculationResult {
    assertValidGridSettings(settings);

    const parallelResult = this.buildParallelSegments(polygon, settings.step);
    const perpendicularResult = this.buildPerpendicularSegments(polygon, settings.step);
    const sideIntersections = this.uniqueSideIntersections([
      ...parallelResult.sideIntersections,
      ...perpendicularResult.sideIntersections,
    ]);
    const { innerIntersections, excludedInnerIntersections } = this.buildInnerIntersections(
      parallelResult.gridSegments,
      perpendicularResult.gridSegments,
      sideIntersections,
      settings.minDistanceFromSideIntersection,
    );
    const parallelLength = this.sumSegments(parallelResult.gridSegments);
    const perpendicularLength = this.sumSegments(perpendicularResult.gridSegments);

    return {
      parallelSegments: parallelResult.gridSegments,
      perpendicularSegments: perpendicularResult.gridSegments,
      sideIntersections,
      innerIntersections,
      excludedInnerIntersections,
      parallelLength,
      perpendicularLength,
      totalLength: parallelLength + perpendicularLength,
    };
  }

  /**
   * Builds lines parallel to the selected main side.
   *
   * After placement the main side lies on Y = 0, so parallel grid lines are simply Y = step,
   * Y = 2 * step, and so on. Each line is clipped by polygon sides; the remaining inside part is
   * stored as a grid segment.
   */
  private buildParallelSegments(polygon: PlacedPolygon, step: number): LineClipResult {
    const result: LineClipResult = { gridSegments: [], sideIntersections: [] };
    const { maxY } = polygon.bounds;

    for (let y = step; y < maxY - EPSILON; y += step) {
      this.addClippedLineResult(result, 'parallel', y, this.clipHorizontalLine(polygon, y));
    }

    return result;
  }

  /**
   * Builds lines perpendicular to the selected main side.
   *
   * In placed coordinates perpendicular lines are X = constant. We start from grid multiples inside
   * the polygon bounds and skip exact bounds, because lines lying exactly on the outer edge should
   * not be counted as internal grid lines.
   */
  private buildPerpendicularSegments(polygon: PlacedPolygon, step: number): LineClipResult {
    const result: LineClipResult = { gridSegments: [], sideIntersections: [] };
    const { minX, maxX } = polygon.bounds;
    const startX = Math.ceil((minX + EPSILON) / step) * step;

    for (let x = startX; x < maxX - EPSILON; x += step) {
      this.addClippedLineResult(result, 'perpendicular', x, this.clipVerticalLine(polygon, x));
    }

    return result;
  }

  private addClippedLineResult(
    result: LineClipResult,
    direction: GridLineDirection,
    lineCoordinate: number,
    clippedSegments: Segment[],
  ): void {
    clippedSegments.forEach((segment) => {
      result.gridSegments.push({
        direction,
        lineCoordinate,
        segment,
      });
      result.sideIntersections.push({ point: segment.start, direction, lineCoordinate });
      result.sideIntersections.push({ point: segment.end, direction, lineCoordinate });
    });
  }

  /**
   * Clips a horizontal line by the polygon.
   *
   * Text explanation: the horizontal line crosses the polygon boundary in several points. For a
   * convex triangle/trapezoid this is usually two points. The part between every pair of boundary
   * points lies inside the polygon, so it becomes a visible grid segment.
   */
  private clipHorizontalLine(polygon: PlacedPolygon, y: number): Segment[] {
    const intersections = polygon.segments
      .map((segment) => this.getHorizontalIntersection(segment, y))
      .filter((point): point is Point => point !== null)
      .sort((a, b) => a.x - b.x);

    return this.buildSegmentsFromLineIntersections(this.uniquePoints(intersections));
  }

  /**
   * Clips a vertical line by the polygon using the same idea as horizontal clipping.
   */
  private clipVerticalLine(polygon: PlacedPolygon, x: number): Segment[] {
    const intersections = polygon.segments
      .map((segment) => this.getVerticalIntersection(segment, x))
      .filter((point): point is Point => point !== null)
      .sort((a, b) => a.y - b.y);

    return this.buildSegmentsFromLineIntersections(this.uniquePoints(intersections));
  }

  private getHorizontalIntersection(segment: Segment, y: number): Point | null {
    const { start, end } = segment;

    if (this.areClose(start.y, end.y)) {
      return null;
    }

    if (!this.isBetween(y, start.y, end.y)) {
      return null;
    }

    const ratio = (y - start.y) / (end.y - start.y);
    const x = start.x + (end.x - start.x) * ratio;

    return new Point(x, y);
  }

  private getVerticalIntersection(segment: Segment, x: number): Point | null {
    const { start, end } = segment;

    if (this.areClose(start.x, end.x)) {
      return null;
    }

    if (!this.isBetween(x, start.x, end.x)) {
      return null;
    }

    const ratio = (x - start.x) / (end.x - start.x);
    const y = start.y + (end.y - start.y) * ratio;

    return new Point(x, y);
  }

  private buildSegmentsFromLineIntersections(points: readonly Point[]): Segment[] {
    const segments: Segment[] = [];

    for (let index = 0; index + 1 < points.length; index += 2) {
      const segment = new Segment(points[index], points[index + 1]);

      if (segment.length > EPSILON) {
        segments.push(segment);
      }
    }

    return segments;
  }

  /**
   * Builds orange inner intersections from already clipped horizontal and vertical segments.
   *
   * Text explanation: after clipping we know exactly where every grid line exists inside the
   * polygon. An inner intersection exists only when a vertical segment crosses a horizontal segment
   * strictly inside both of them, not on their red side endpoints.
   */
  private buildInnerIntersections(
    parallelSegments: readonly GridSegment[],
    perpendicularSegments: readonly GridSegment[],
    sideIntersections: readonly SideGridIntersection[],
    minDistanceFromSideIntersection: number,
  ): Pick<PolygonGridCalculationResult, 'innerIntersections' | 'excludedInnerIntersections'> {
    const innerIntersections: InnerGridIntersection[] = [];
    const excludedInnerIntersections: InnerGridIntersection[] = [];

    parallelSegments.forEach((parallelSegment) => {
      perpendicularSegments.forEach((perpendicularSegment) => {
        const point = this.getGridSegmentsIntersection(parallelSegment, perpendicularSegment);

        if (!point) {
          return;
        }

        const nearestSideDistance = this.findNearestSideDistanceOnSameGridLine(
          point,
          sideIntersections,
        );
        const intersection = { point, nearestSideDistance };

        if (
          nearestSideDistance !== null &&
          nearestSideDistance < minDistanceFromSideIntersection - EPSILON
        ) {
          excludedInnerIntersections.push(intersection);

          return;
        }

        innerIntersections.push(intersection);
      });
    });

    return {
      innerIntersections: this.uniqueInnerIntersections(innerIntersections),
      excludedInnerIntersections: this.uniqueInnerIntersections(excludedInnerIntersections),
    };
  }

  private getGridSegmentsIntersection(
    parallelSegment: GridSegment,
    perpendicularSegment: GridSegment,
  ): Point | null {
    const x = perpendicularSegment.lineCoordinate;
    const y = parallelSegment.lineCoordinate;
    const horizontal = parallelSegment.segment;
    const vertical = perpendicularSegment.segment;

    if (!this.isStrictlyBetween(x, horizontal.start.x, horizontal.end.x)) {
      return null;
    }

    if (!this.isStrictlyBetween(y, vertical.start.y, vertical.end.y)) {
      return null;
    }

    return new Point(x, y);
  }

  /**
   * Finds the nearest red side point on the same horizontal or vertical grid line.
   *
   * This intentionally does not use a diagonal 2D distance to any red point. The engineering rule is
   * about excluding an orange point that is too close to a side along its own grid line, so only red
   * points with the same X or the same Y are considered.
   */
  private findNearestSideDistanceOnSameGridLine(
    point: Point,
    sideIntersections: readonly SideGridIntersection[],
  ): number | null {
    const distances = sideIntersections
      .filter((intersection) => {
        return (
          this.areClose(intersection.point.x, point.x) ||
          this.areClose(intersection.point.y, point.y)
        );
      })
      .map((intersection) => point.distanceTo(intersection.point))
      .filter((distance) => distance > EPSILON);

    if (distances.length === 0) {
      return null;
    }

    return Math.min(...distances);
  }

  private uniqueSideIntersections(
    intersections: readonly SideGridIntersection[],
  ): SideGridIntersection[] {
    return intersections.filter((intersection, index, list) => {
      return list.findIndex((item) => this.areSamePoints(item.point, intersection.point)) === index;
    });
  }

  private uniqueInnerIntersections(
    intersections: readonly InnerGridIntersection[],
  ): InnerGridIntersection[] {
    return intersections.filter((intersection, index, list) => {
      return list.findIndex((item) => this.areSamePoints(item.point, intersection.point)) === index;
    });
  }

  private uniquePoints(points: readonly Point[]): Point[] {
    return points.filter((point, index, list) => {
      return list.findIndex((item) => this.areSamePoints(item, point)) === index;
    });
  }

  private sumSegments(gridSegments: readonly GridSegment[]): number {
    return gridSegments.reduce((sum, item) => sum + item.segment.length, 0);
  }

  private isBetween(value: number, start: number, end: number): boolean {
    return value >= Math.min(start, end) - EPSILON && value <= Math.max(start, end) + EPSILON;
  }

  private isStrictlyBetween(value: number, start: number, end: number): boolean {
    return value > Math.min(start, end) + EPSILON && value < Math.max(start, end) - EPSILON;
  }

  private areClose(left: number, right: number): boolean {
    return Math.abs(left - right) <= EPSILON;
  }

  private areSamePoints(left: Point, right: Point): boolean {
    return left.distanceTo(right) <= EPSILON;
  }
}
