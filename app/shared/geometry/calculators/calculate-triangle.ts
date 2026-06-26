import type { TriangleInput } from '~/shared/geometry/shapes/triangle';
import { resolveTriangle } from '~/shared/geometry/shapes/triangle';
import { calculateTriangleArea } from '~/shared/geometry/metrics/triangle-area';
import { calculatePerimeter } from '~/shared/geometry/metrics/perimeter';

export interface TriangleCalculationResult {
  area: number;
  perimeter: number;
  resolvedTriangle: ReturnType<typeof resolveTriangle>;
}

export function calculateTriangle (input: TriangleInput): TriangleCalculationResult {
  const resolvedTriangle = resolveTriangle(input);

  return {
    area: calculateTriangleArea(input),
    perimeter: calculatePerimeter([
      resolvedTriangle.sides.ab,
      resolvedTriangle.sides.bc,
      resolvedTriangle.sides.ca,
    ]),
    resolvedTriangle,
  };
}
