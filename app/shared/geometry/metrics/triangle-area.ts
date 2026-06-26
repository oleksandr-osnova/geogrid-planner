import type { TriangleInput } from '~/shared/geometry/shapes/triangle';

/**
 * @see https://en.wikipedia.org/wiki/Heron%27s_formula
 */
export function calculateTriangleArea (input: TriangleInput): number {
  const { ab, bc, ca } = input;
  const semiPerimeter = (ab + bc + ca) / 2;

  return Math.sqrt(
    semiPerimeter *
    (semiPerimeter - ab) *
    (semiPerimeter - bc) *
    (semiPerimeter - ca),
  );
}
