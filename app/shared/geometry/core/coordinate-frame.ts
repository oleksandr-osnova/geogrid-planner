import { Point, type PointCoordinates } from '~/shared/geometry/core/point';
import type { Segment } from '~/shared/geometry/core/segment';
import { Vector } from '~/shared/geometry/core/vector';

/**
 * Local coordinate system built from a selected main side.
 *
 * The origin is the start of the main side, X goes along the main side, and Y is perpendicular to
 * it. After this transformation the grid calculator can work with simple horizontal and vertical
 * lines, no matter how the original figure was positioned.
 */
export class CoordinateFrame {
  public readonly origin: Point;
  public readonly xAxis: Vector;
  public readonly yAxis: Vector;

  public constructor(origin: Point | PointCoordinates, xAxis: Vector, yAxis: Vector) {
    this.origin = Point.from(origin);
    this.xAxis = xAxis.normalize();
    this.yAxis = yAxis.normalize();
  }

  public static fromSegment(segment: Segment): CoordinateFrame {
    const xAxis = Vector.between(segment.start, segment.end).normalize();

    return new CoordinateFrame(segment.start, xAxis, xAxis.perpendicularLeft());
  }

  /**
   * Converts a point from the original figure coordinates to this local coordinate system.
   *
   * The formula is based on vector projection: first we move the point so the frame origin becomes
   * (0, 0), then we project that vector onto the local X and Y axes.
   */
  public toLocalPoint(point: Point | PointCoordinates): Point {
    const target = Point.from(point);
    const relativeVector = Vector.between(this.origin, target);

    return new Point(relativeVector.dot(this.xAxis), relativeVector.dot(this.yAxis));
  }
}
