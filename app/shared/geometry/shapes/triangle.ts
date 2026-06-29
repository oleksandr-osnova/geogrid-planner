import { Point, type PointCoordinates } from '~/shared/geometry/core/point';
import { Polygon } from '~/shared/geometry/core/polygon';
import type { PlacedPolygon } from '~/shared/geometry/core/placed-polygon';
import { Segment } from '~/shared/geometry/core/segment';

export const TRIANGLE_SIDE_KEYS = ['ab', 'bc', 'ca'] as const;

export type TriangleSideKey = (typeof TRIANGLE_SIDE_KEYS)[number];

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

const TRIANGLE_SIDE_INDEX_MAP: Record<TriangleSideKey, number> = {
  ab: 0,
  bc: 1,
  ca: 2,
};

/**
 * Triangle entity built from three points or from three side lengths.
 *
 * The class is intentionally responsible only for the triangle itself: points, sides, area,
 * perimeter, and placement by a selected main side. Grid logic stays outside in a generic polygon
 * calculator, so the same grid code can later serve trapezoids and other shapes.
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
     * Text explanation: side AB is placed horizontally first. Point C must be at distance CA from
     * A and at distance BC from B. The law of cosines gives the X coordinate of C, and then the
     * remaining part of CA becomes the height of the triangle.
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

  public get orderedPoints(): readonly Point[] {
    return [this.a, this.b, this.c];
  }

  public get polygon(): Polygon {
    return new Polygon(this.orderedPoints);
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
    return this.polygon.perimeter;
  }

  /**
   * Calculates triangle area.
   *
   * Text explanation: the generic polygon area is used here, so triangle and trapezoid area are
   * calculated through the same ordered-points approach. For a triangle this produces the same
   * result as Heron's formula, but it avoids duplicated metric code.
   */
  public get area(): number {
    return this.polygon.area;
  }

  /**
   * Returns a polygon transformed so the selected side becomes the main horizontal side.
   *
   * This is the bridge between a domain shape and the grid calculator: after this method the grid
   * calculator can use simple X/Y lines instead of knowing anything about triangle side names.
   */
  public placeBySide(sideKey: TriangleSideKey): PlacedPolygon {
    return this.polygon.placeBySegmentIndex(TRIANGLE_SIDE_INDEX_MAP[sideKey], sideKey);
  }
}
