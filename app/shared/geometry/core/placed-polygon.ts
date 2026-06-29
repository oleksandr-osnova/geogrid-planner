import type { Polygon, PolygonBounds } from '~/shared/geometry/core/polygon';
import type { Segment } from '~/shared/geometry/core/segment';
import type { Point } from '~/shared/geometry/core/point';

/**
 * Polygon already aligned to a user-selected main side.
 *
 * The first side is not necessarily the main side in the original shape, so we keep the key for UI
 * and debugging. The actual points are already transformed: the main side is horizontal and starts
 * at X = 0.
 */
export class PlacedPolygon {
  public readonly polygon: Polygon;
  public readonly mainSideKey: string;
  public readonly mainSegmentIndex: number;

  public constructor(polygon: Polygon, mainSideKey: string, mainSegmentIndex: number) {
    this.polygon = polygon;
    this.mainSideKey = mainSideKey;
    this.mainSegmentIndex = mainSegmentIndex;
  }

  public get points(): readonly Point[] {
    return this.polygon.points;
  }

  public get segments(): readonly Segment[] {
    return this.polygon.segments;
  }

  public get mainSegment(): Segment {
    const segment = this.segments[this.mainSegmentIndex];

    if (!segment) {
      throw new Error('Main segment index is outside of placed polygon segments.');
    }

    return segment;
  }

  public get bounds(): PolygonBounds {
    return this.polygon.bounds;
  }

  public get area(): number {
    return this.polygon.area;
  }

  public get perimeter(): number {
    return this.polygon.perimeter;
  }
}
