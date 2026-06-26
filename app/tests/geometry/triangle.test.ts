import { describe, expect, it } from 'vitest';
import { isValidTriangle, resolveTriangle } from '~/shared/geometry/shapes/triangle';
import { calculateTriangleArea } from '~/shared/geometry/metrics/triangle-area';

describe('triangle geometry', () => {
  it('validates triangle sides', () => {
    expect(isValidTriangle({ ab: 3, bc: 4, ca: 5 })).toBe(true);
    expect(isValidTriangle({ ab: 1, bc: 2, ca: 10 })).toBe(false);
  });

  it('calculates triangle area', () => {
    expect(calculateTriangleArea({ ab: 3, bc: 4, ca: 5 })).toBeCloseTo(6);
  });

  it('resolves triangle points', () => {
    const triangle = resolveTriangle({ ab: 3, bc: 4, ca: 5 });

    expect(triangle.points.a).toEqual({ x: 0, y: 0 });
    expect(triangle.points.b).toEqual({ x: 3, y: 0 });
    expect(triangle.sides.ab).toBeCloseTo(3);
    expect(triangle.sides.bc).toBeCloseTo(4);
    expect(triangle.sides.ca).toBeCloseTo(5);
  });
});
