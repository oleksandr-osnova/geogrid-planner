export interface PointCoordinates {
  x: number;
  y: number;
}

/**
 * Immutable 2D point used by geometry entities.
 */
export class Point implements PointCoordinates {
  public readonly x: number;
  public readonly y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static from(point: Point | PointCoordinates): Point {
    if (point instanceof Point) {
      return point;
    }

    return new Point(point.x, point.y);
  }

  /**
   * Calculates Euclidean distance between two points.
   *
   * @see https://en.wikipedia.org/wiki/Euclidean_distance
   */
  public distanceTo(point: Point | PointCoordinates): number {
    const target = Point.from(point);

    return Math.hypot(target.x - this.x, target.y - this.y);
  }

  public toCoordinates(): PointCoordinates {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
