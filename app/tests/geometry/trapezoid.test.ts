import { describe, expect, it } from 'vitest';
import { calculateTrapezoid } from '~/shared/geometry/calculators/calculate-trapezoid';
import { Trapezoid } from '~/shared/geometry/shapes/trapezoid';

const trapezoidInput = { ab: 30, bc: 15, cd: 18, da: 16 };

describe('trapezoid geometry', () => {
  it('validates trapezoid side lengths', () => {
    expect(Trapezoid.isValidSides(trapezoidInput)).toBe(true);
    expect(Trapezoid.isValidSides({ ab: 10, bc: 5, cd: 10, da: 5 })).toBe(false);
  });

  it('builds trapezoid from side lengths', () => {
    const trapezoid = Trapezoid.fromSides(trapezoidInput);

    expect(trapezoid.sideLengths.ab).toBeCloseTo(30);
    expect(trapezoid.sideLengths.bc).toBeCloseTo(15);
    expect(trapezoid.sideLengths.cd).toBeCloseTo(18);
    expect(trapezoid.sideLengths.da).toBeCloseTo(16);
    expect(trapezoid.area).toBeGreaterThan(0);
  });

  it('places trapezoid by selected main side', () => {
    const trapezoid = Trapezoid.fromSides(trapezoidInput);
    const placedPolygon = trapezoid.placeBySide('cd');

    expect(placedPolygon.mainSideKey).toBe('cd');
    expect(placedPolygon.bounds.minY).toBeCloseTo(0);
  });

  it('calculates trapezoid grid data with the shared grid calculator', () => {
    const result = calculateTrapezoid({
      ...trapezoidInput,
      mainSideKey: 'ab',
      gridStep: 5,
      minDistanceFromSideIntersection: 0,
    });

    expect(result.grid.parallelSegments.length).toBeGreaterThan(0);
    expect(result.grid.perpendicularSegments.length).toBeGreaterThan(0);
    expect(result.grid.totalLength).toBeGreaterThan(0);
  });
});
