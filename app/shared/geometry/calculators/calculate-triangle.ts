import type { PlacedPolygon } from '~/shared/geometry/core/placed-polygon';
import type { PolygonGridCalculationResult } from '~/shared/geometry/grid/polygon-grid-calculator';
import { PolygonGridCalculator } from '~/shared/geometry/grid/polygon-grid-calculator';
import {
  Triangle,
  type TriangleInput,
  type TriangleSideKey,
} from '~/shared/geometry/shapes/triangle';

export interface TriangleCalculationInput extends TriangleInput {
  mainSideKey: TriangleSideKey;
  gridStep: number;
  minDistanceFromSideIntersection: number;
}

export interface TriangleCalculationResult {
  triangle: Triangle;
  placedPolygon: PlacedPolygon;
  grid: PolygonGridCalculationResult;
  area: number;
  perimeter: number;
}

/**
 * Runs the full triangle calculation flow.
 *
 * Text explanation: the triangle is first built from side lengths, then rotated into the coordinate
 * system of the selected main side, and only then passed to the universal grid calculator. This
 * keeps shape construction and grid calculations separated.
 */
export function calculateTriangle(input: TriangleCalculationInput): TriangleCalculationResult {
  const triangle = Triangle.fromSides(input);
  const placedPolygon = triangle.placeBySide(input.mainSideKey);
  const grid = new PolygonGridCalculator().calculate(placedPolygon, {
    step: input.gridStep,
    minDistanceFromSideIntersection: input.minDistanceFromSideIntersection,
  });

  return {
    triangle,
    placedPolygon,
    grid,
    area: triangle.area,
    perimeter: triangle.perimeter,
  };
}
