import { Point, type PointCoordinates } from '~/shared/geometry/core/point';
import { Segment } from '~/shared/geometry/core/segment';

export interface TriangleInput {
  ab: number;
  bc: number;
  ca: number;
}

export interface TrianglePoints {
  a: PointCoordinates;
  b: PointCoordinates;
  c: PointCoordinates;
}

export interface TriangleSegments {
  ab: Segment;
  bc: Segment;
  ca: Segment;
}

/**
 * Triangle entity built from three points or from three side lengths.
 */
export class Triangle {
  public readonly a: Point;
  public readonly b: Point;
  public readonly c: Point;

  public constructor(
    a: Point | PointCoordinates,
    b: Point | PointCoordinates,
    c: Point | PointCoordinates,
  ) {
    this.a = Point.from(a);
    this.b = Point.from(b);
    this.c = Point.from(c);
  }

  public static fromSides(input: TriangleInput): Triangle {
    if (!Triangle.isValidSides(input)) {
      throw new Error('Invalid triangle sides.');
    }

    const { ab, bc, ca } = input;

    const a = new Point(0, 0);
    const b = new Point(ab, 0);

    /**
     * Finds point C by the law of cosines for a triangle placed on the AB axis.
     *
     * @see https://en.wikipedia.org/wiki/Law_of_cosines
     */
    const x = (ca ** 2 + ab ** 2 - bc ** 2) / (2 * ab);
    const y = Math.sqrt(Math.max(ca ** 2 - x ** 2, 0));

    return new Triangle(a, b, new Point(x, y));
  }

  public static isValidSides(input: TriangleInput): boolean {
    const { ab, bc, ca } = input;

    return ab > 0 && bc > 0 && ca > 0 && ab + bc > ca && ab + ca > bc && bc + ca > ab;
  }

  public get points(): TrianglePoints {
    return {
      a: this.a.toCoordinates(),
      b: this.b.toCoordinates(),
      c: this.c.toCoordinates(),
    };
  }

  public get sides(): TriangleSegments {
    return {
      ab: new Segment(this.a, this.b),
      bc: new Segment(this.b, this.c),
      ca: new Segment(this.c, this.a),
    };
  }

  public get sideLengths(): TriangleInput {
    const { ab, bc, ca } = this.sides;

    return {
      ab: ab.length,
      bc: bc.length,
      ca: ca.length,
    };
  }

  public get perimeter(): number {
    const { ab, bc, ca } = this.sideLengths;

    return ab + bc + ca;
  }

  /**
   * Calculates triangle area using Heron's formula.
   *
   * @see https://en.wikipedia.org/wiki/Heron%27s_formula
   */
  public get area(): number {
    const { ab, bc, ca } = this.sideLengths;
    const semiPerimeter = this.perimeter / 2;

    return Math.sqrt(
      semiPerimeter * (semiPerimeter - ab) * (semiPerimeter - bc) * (semiPerimeter - ca),
    );
  }
}
