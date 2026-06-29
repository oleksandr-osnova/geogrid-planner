import { describe, expect, it } from 'vitest';
import { Point } from '~/shared/geometry/core/point';
import { Segment } from '~/shared/geometry/core/segment';
import { Triangle } from '~/shared/geometry/shapes/triangle';

const triangleInput = { ab: 3, bc: 4, ca: 5 };

describe('geometry entities', () => {
  it('calculates distance between points', () => {
    const start = new Point(0, 0);
    const end = new Point(3, 4);

    expect(start.distanceTo(end)).toBeCloseTo(5);
  });

  it('calculates segment length', () => {
    const segment = new Segment({ x: 0, y: 0 }, { x: 3, y: 4 });

    expect(segment.length).toBeCloseTo(5);
  });

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
});
