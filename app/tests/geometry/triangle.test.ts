import { describe, expect, it } from 'vitest';
import { calculateTriangle } from '~/shared/geometry/calculators/calculate-triangle';
import { Triangle } from '~/shared/geometry/shapes/triangle';

const triangleInput = { ab: 3, bc: 4, ca: 5 };

describe('triangle geometry', () => {
  it('validates triangle side lengths', () => {
    expect(Triangle.isValidSides(triangleInput)).toBe(true);
    expect(Triangle.isValidSides({ ab: 1, bc: 2, ca: 10 })).toBe(false);
  });

  it('builds triangle from side lengths', () => {
    const triangle = Triangle.fromSides(triangleInput);

    expect(triangle.points.a).toEqual({ x: 0, y: 0 });
    expect(triangle.points.b).toEqual({ x: 3, y: 0 });
    expect(triangle.sideLengths.ab).toBeCloseTo(3);
    expect(triangle.sideLengths.bc).toBeCloseTo(4);
    expect(triangle.sideLengths.ca).toBeCloseTo(5);
  });

  it('calculates triangle metrics', () => {
    const triangle = Triangle.fromSides(triangleInput);

    expect(triangle.area).toBeCloseTo(6);
    expect(triangle.perimeter).toBeCloseTo(12);
  });

  it('places triangle by selected main side', () => {
    const triangle = Triangle.fromSides(triangleInput);
    const placedPolygon = triangle.placeBySide('bc');

    expect(placedPolygon.mainSideKey).toBe('bc');
    expect(placedPolygon.bounds.minY).toBeCloseTo(0);
  });

  it('calculates triangle grid data', () => {
    const result = calculateTriangle({
      ...triangleInput,
      mainSideKey: 'ab',
      gridStep: 1,
      minDistanceFromSideIntersection: 0,
    });

    expect(result.grid.parallelSegments.length).toBeGreaterThan(0);
    expect(result.grid.perpendicularSegments.length).toBeGreaterThan(0);
    expect(result.grid.totalLength).toBeGreaterThan(0);
  });
});
