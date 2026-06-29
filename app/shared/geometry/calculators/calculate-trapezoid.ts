import type { PlacedPolygon } from '~/shared/geometry/core/placed-polygon';
import type { PolygonGridCalculationResult } from '~/shared/geometry/grid/polygon-grid-calculator';
import { PolygonGridCalculator } from '~/shared/geometry/grid/polygon-grid-calculator';
import {
  Trapezoid,
  type TrapezoidInput,
  type TrapezoidSideKey,
} from '~/shared/geometry/shapes/trapezoid';

export interface TrapezoidCalculationInput extends TrapezoidInput {
  mainSideKey: TrapezoidSideKey;
  gridStep: number;
  minDistanceFromSideIntersection: number;
}

export interface TrapezoidCalculationResult {
  trapezoid: Trapezoid;
  placedPolygon: PlacedPolygon;
  grid: PolygonGridCalculationResult;
  area: number;
  perimeter: number;
}

/**
 * Runs the full trapezoid calculation flow.
 *
 * Text explanation: trapezoid-specific code only knows how to build the trapezoid itself. Once the
 * main side is selected, the shape becomes a placed polygon and goes through the same grid
 * calculator as the triangle.
 */
export function calculateTrapezoid(input: TrapezoidCalculationInput): TrapezoidCalculationResult {
  const trapezoid = Trapezoid.fromSides(input);
  const placedPolygon = trapezoid.placeBySide(input.mainSideKey);
  const grid = new PolygonGridCalculator().calculate(placedPolygon, {
    step: input.gridStep,
    minDistanceFromSideIntersection: input.minDistanceFromSideIntersection,
  });

  return {
    trapezoid,
    placedPolygon,
    grid,
    area: trapezoid.area,
    perimeter: trapezoid.perimeter,
  };
}
