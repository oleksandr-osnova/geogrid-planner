import { describe, expect, it } from 'vitest';
import { Point } from '~/shared/geometry/core/point';
import { Polygon } from '~/shared/geometry/core/polygon';
import { Segment } from '~/shared/geometry/core/segment';

describe('geometry core entities', () => {
  it('calculates distance between points', () => {
    const start = new Point(0, 0);
    const end = new Point(3, 4);

    expect(start.distanceTo(end)).toBeCloseTo(5);
  });

  it('calculates segment length', () => {
    const segment = new Segment({ x: 0, y: 0 }, { x: 3, y: 4 });

    expect(segment.length).toBeCloseTo(5);
  });

  it('calculates polygon area and perimeter from ordered points', () => {
    const polygon = new Polygon([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 5 },
      { x: 0, y: 5 },
    ]);

    expect(polygon.area).toBeCloseTo(50);
    expect(polygon.perimeter).toBeCloseTo(30);
  });
});
