import { describe, expect, it } from 'vitest';
import { PlacedPolygon } from '~/shared/geometry/core/placed-polygon';
import { Polygon } from '~/shared/geometry/core/polygon';
import { PolygonGridCalculator } from '~/shared/geometry/grid/polygon-grid-calculator';
import { Triangle } from '~/shared/geometry/shapes/triangle';

describe('polygon grid calculator', () => {
  it('skips clipped grid segments shorter than one grid step', () => {
    const triangle = Triangle.fromSides({ ab: 10, bc: 10, ca: 10 });
    const placedPolygon = triangle.placeBySide('ab');
    const grid = new PolygonGridCalculator().calculate(placedPolygon, {
      step: 8,
      minDistanceFromSideIntersection: 0,
    });

    expect(grid.parallelSegments).toHaveLength(0);
    expect(grid.perpendicularSegments).toHaveLength(0);
    expect(grid.sideIntersections).toHaveLength(0);
    expect(grid.totalLength).toBeCloseTo(0);
  });

  it('keeps one inner point and checks distances along both crossing grid segments', () => {
    const placedPolygon = new PlacedPolygon(
      new Polygon([
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ]),
      'ab',
    );
    const grid = new PolygonGridCalculator().calculate(placedPolygon, {
      step: 5,
      minDistanceFromSideIntersection: 0,
    });
    const intersection = grid.innerIntersections[0];

    expect(grid.innerIntersections).toHaveLength(1);
    expect(intersection?.point.x).toBeCloseTo(5);
    expect(intersection?.point.y).toBeCloseTo(5);
    expect(intersection?.nearestParallelSideDistance).toBeCloseTo(5);
    expect(intersection?.nearestPerpendicularSideDistance).toBeCloseTo(5);
    expect(intersection?.nearestSideDistance).toBeCloseTo(5);
  });

  it('excludes inner intersections near side intersections by grid-line distance', () => {
    const triangle = Triangle.fromSides({ ab: 10, bc: 10, ca: 10 });
    const placedPolygon = triangle.placeBySide('ab');
    const grid = new PolygonGridCalculator().calculate(placedPolygon, {
      step: 2,
      minDistanceFromSideIntersection: 3,
    });

    expect(grid.excludedInnerIntersections.length).toBeGreaterThan(0);
  });
});
