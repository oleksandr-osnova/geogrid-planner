import { Point, type PointCoordinates } from '~/shared/geometry/core/point';

/**
 * Small immutable 2D vector helper used for moving geometry into a local coordinate system.
 *
 * A vector is different from a point: a point is a location, while a vector is a direction and
 * length. For example, the vector from A to B tells us where the X axis should point when the
 * user selects AB as the main side.
 */
export class Vector {
  public readonly x: number;
  public readonly y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static between(start: Point | PointCoordinates, end: Point | PointCoordinates): Vector {
    const startPoint = Point.from(start);
    const endPoint = Point.from(end);

    return new Vector(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
  }

  public get length(): number {
    return Math.hypot(this.x, this.y);
  }

  /**
   * Returns the same direction with length equal to 1.
   *
   * This is useful before dot products: if the axis length is 1, the dot product directly gives
   * the coordinate of a point along that axis instead of a scaled value.
   */
  public normalize(): Vector {
    if (this.length === 0) {
      throw new Error('Zero-length vector cannot be normalized.');
    }

    return new Vector(this.x / this.length, this.y / this.length);
  }

  /**
   * Returns a vector rotated 90° counterclockwise.
   *
   * In this project the selected main side becomes the local X axis. The perpendicular vector is
   * then used as the local Y axis, so the figure can be treated like it lies above the main side.
   */
  public perpendicularLeft(): Vector {
    return new Vector(-this.y, this.x);
  }

  /**
   * Dot product projects one vector onto another one.
   *
   * When the second vector is a unit axis, the result answers: "how far did this point move along
   * that axis?". That is exactly what we need to convert global points to local X/Y coordinates.
   *
   * @see https://en.wikipedia.org/wiki/Dot_product
   */
  public dot(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y;
  }
}
