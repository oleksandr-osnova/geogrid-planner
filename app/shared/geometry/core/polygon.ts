import { Point, type PointCoordinates } from '~/shared/geometry/core/point';
import { Segment } from '~/shared/geometry/core/segment';
import { CoordinateFrame } from '~/shared/geometry/core/coordinate-frame';
import { PlacedPolygon } from '~/shared/geometry/core/placed-polygon';

export interface PolygonBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
}

/**
 * Generic immutable polygon entity.
 *
 * Triangle and trapezoid both become a polygon when we only need common geometry operations:
 * ordered points, side segments, area, perimeter, bounds, and placement by a selected side.
 */
export class Polygon {
  public readonly points: readonly Point[];

  public constructor(points: readonly (Point | PointCoordinates)[]) {
    if (points.length < 3) {
      throw new Error('Polygon must contain at least three points.');
    }

    this.points = points.map((point) => Point.from(point));
  }

  public get segments(): readonly Segment[] {
    return this.points.map((point, index) => {
      const nextPoint = this.points[(index + 1) % this.points.length];

      return new Segment(point, nextPoint);
    });
  }

  public get perimeter(): number {
    return this.segments.reduce((sum, segment) => sum + segment.length, 0);
  }

  /**
   * Calculates polygon area with the shoelace formula.
   *
   * Text explanation: we walk around the polygon point by point and sum small cross-products of
   * neighbouring coordinates. The absolute half of that sum is the area. This works for any simple
   * ordered polygon, so the same method covers both triangle and trapezoid.
   *
   * @see https://en.wikipedia.org/wiki/Shoelace_formula
   */
  public get area(): number {
    return Math.abs(this.signedArea);
  }

  public get bounds(): PolygonBounds {
    const xs = this.points.map((point) => point.x);
    const ys = this.points.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      minX,
      maxX,
      minY,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Places the polygon into a local 2D coordinate system based on one selected side.
   *
   * The selected side becomes the local X axis and starts at (0, 0). The rest of the polygon is
   * mirrored to positive Y when needed. This means the grid calculator does not care which side was
   * selected: it always receives a polygon where "parallel" lines are horizontal and
   * "perpendicular" lines are vertical.
   */
  public placeBySegmentIndex(segmentIndex: number, mainSideKey: string): PlacedPolygon {
    const mainSide = this.segments[segmentIndex];

    if (!mainSide) {
      throw new Error('Main side index is outside of polygon segments.');
    }

    const frame = CoordinateFrame.fromSegment(mainSide);
    let placedPoints = this.points.map((point) => frame.toLocalPoint(point));

    const averageY = placedPoints.reduce((sum, point) => sum + point.y, 0) / placedPoints.length;

    if (averageY < 0) {
      placedPoints = placedPoints.map((point) => new Point(point.x, -point.y));
    }

    return new PlacedPolygon(new Polygon(placedPoints), mainSideKey);
  }

  /**
   * Signed area keeps point ordering information.
   *
   * Positive value usually means counterclockwise order, negative value means clockwise order. The
   * public area getter uses the absolute value because users need the physical area, not the point
   * order direction.
   */
  private get signedArea(): number {
    const crossSum = this.points.reduce((sum, point, index) => {
      const nextPoint = this.points[(index + 1) % this.points.length];

      return sum + point.x * nextPoint.y - nextPoint.x * point.y;
    }, 0);

    return crossSum / 2;
  }
}
