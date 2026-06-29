import { Point, type PointCoordinates } from '~/shared/geometry/core/point';
import { Polygon } from '~/shared/geometry/core/polygon';
import type { PlacedPolygon } from '~/shared/geometry/core/placed-polygon';
import { Segment } from '~/shared/geometry/core/segment';

export const TRAPEZOID_SIDE_KEYS = ['ab', 'bc', 'cd', 'da'] as const;

export type TrapezoidSideKey = (typeof TRAPEZOID_SIDE_KEYS)[number];

export interface TrapezoidInput {
  ab: number;
  bc: number;
  cd: number;
  da: number;
}

export interface TrapezoidPoints {
  a: PointCoordinates;
  b: PointCoordinates;
  c: PointCoordinates;
  d: PointCoordinates;
}

export interface TrapezoidSegments {
  ab: Segment;
  bc: Segment;
  cd: Segment;
  da: Segment;
}

const TRAPEZOID_SIDE_INDEX_MAP: Record<TrapezoidSideKey, number> = {
  ab: 0,
  bc: 1,
  cd: 2,
  da: 3,
};

/**
 * Trapezoid entity built from four side lengths.
 *
 * Current convention: AB and CD are parallel bases, BC and DA are side legs. Points are ordered
 * around the shape as A -> B -> C -> D, so the generic polygon logic can calculate area,
 * perimeter, side segments, and grid clipping.
 */
export class Trapezoid {
  public readonly a: Point;
  public readonly b: Point;
  public readonly c: Point;
  public readonly d: Point;

  public constructor(
    a: Point | PointCoordinates,
    b: Point | PointCoordinates,
    c: Point | PointCoordinates,
    d: Point | PointCoordinates,
  ) {
    this.a = Point.from(a);
    this.b = Point.from(b);
    this.c = Point.from(c);
    this.d = Point.from(d);
  }

  public static fromSides(input: TrapezoidInput): Trapezoid {
    if (!Trapezoid.isValidSides(input)) {
      throw new Error('Invalid trapezoid sides.');
    }

    const { ab, bc, cd, da } = input;
    const baseDiff = ab - cd;

    /**
     * Builds a trapezoid from side lengths by splitting it into a rectangle-like middle and two
     * right triangles near the legs.
     *
     * Text explanation: AB is placed on the X axis. CD is parallel to AB and shifted by X and
     * height H. The horizontal shift X is found from the two leg lengths using the Pythagorean
     * theorem. After X is known, the height is the remaining vertical part of the DA leg.
     *
     * This first implementation intentionally rejects equal bases because four equal/parallel side
     * lengths do not uniquely define the horizontal shift without an extra angle or height.
     *
     * @see https://en.wikipedia.org/wiki/Trapezoid
     * @see https://en.wikipedia.org/wiki/Pythagorean_theorem
     */
    const topBaseStartX = (da ** 2 - bc ** 2 + baseDiff ** 2) / (2 * baseDiff);
    const height = Math.sqrt(Math.max(da ** 2 - topBaseStartX ** 2, 0));

    return new Trapezoid(
      new Point(0, 0),
      new Point(ab, 0),
      new Point(topBaseStartX + cd, height),
      new Point(topBaseStartX, height),
    );
  }

  public static isValidSides(input: TrapezoidInput): boolean {
    const { ab, bc, cd, da } = input;

    if (ab <= 0 || bc <= 0 || cd <= 0 || da <= 0) {
      return false;
    }

    if (ab === cd) {
      return false;
    }

    const baseDiff = Math.abs(ab - cd);

    return da + bc > baseDiff && baseDiff + bc > da && baseDiff + da > bc;
  }

  public get points(): TrapezoidPoints {
    return {
      a: this.a.toCoordinates(),
      b: this.b.toCoordinates(),
      c: this.c.toCoordinates(),
      d: this.d.toCoordinates(),
    };
  }

  public get orderedPoints(): readonly Point[] {
    return [this.a, this.b, this.c, this.d];
  }

  public get polygon(): Polygon {
    return new Polygon(this.orderedPoints);
  }

  public get sides(): TrapezoidSegments {
    return {
      ab: new Segment(this.a, this.b),
      bc: new Segment(this.b, this.c),
      cd: new Segment(this.c, this.d),
      da: new Segment(this.d, this.a),
    };
  }

  public get sideLengths(): TrapezoidInput {
    const { ab, bc, cd, da } = this.sides;

    return {
      ab: ab.length,
      bc: bc.length,
      cd: cd.length,
      da: da.length,
    };
  }

  public get perimeter(): number {
    return this.polygon.perimeter;
  }

  /**
   * Calculates trapezoid area through the generic polygon area formula.
   *
   * Text explanation: because the class already knows all four points in the correct order, the
   * polygon area is safer than duplicating another trapezoid-specific formula in this getter.
   */
  public get area(): number {
    return this.polygon.area;
  }

  public placeBySide(sideKey: TrapezoidSideKey): PlacedPolygon {
    return this.polygon.placeBySegmentIndex(TRAPEZOID_SIDE_INDEX_MAP[sideKey], sideKey);
  }
}
