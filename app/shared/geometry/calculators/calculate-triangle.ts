import { Triangle, type TriangleInput } from '~/shared/geometry/shapes/triangle';

export interface TriangleCalculationResult {
  triangle: Triangle;
  area: number;
  perimeter: number;
}

export function calculateTriangle(input: TriangleInput): TriangleCalculationResult {
  const triangle = Triangle.fromSides(input);

  return {
    triangle,
    area: triangle.area,
    perimeter: triangle.perimeter,
  };
}
