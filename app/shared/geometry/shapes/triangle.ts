import type { Point } from '~/shared/geometry/core/point';
import { distance } from '~/shared/geometry/core/point';

export interface TriangleInput {
  ab: number;
  bc: number;
  ca: number;
}

export interface ResolvedTriangle {
  points: {
    a: Point;
    b: Point;
    c: Point;
  };
  sides: {
    ab: number;
    bc: number;
    ca: number;
  };
}

export function isValidTriangle (input: TriangleInput): boolean {
  const { ab, bc, ca } = input;

  return (
    ab > 0 &&
    bc > 0 &&
    ca > 0 &&
    ab + bc > ca &&
    ab + ca > bc &&
    bc + ca > ab
  );
}

export function resolveTriangle (input: TriangleInput): ResolvedTriangle {
  if (!isValidTriangle(input)) {
    throw new Error('Invalid triangle sides.');
  }

  const { ab, bc, ca } = input;

  const a: Point = { x: 0, y: 0 };
  const b: Point = { x: ab, y: 0 };

  const x = (ca ** 2 + ab ** 2 - bc ** 2) / (2 * ab);
  const y = Math.sqrt(Math.max(ca ** 2 - x ** 2, 0));

  const c: Point = { x, y };

  return {
    points: { a, b, c },
    sides: {
      ab: distance(a, b),
      bc: distance(b, c),
      ca: distance(c, a),
    },
  };
}
