import type { Point } from '~/shared/geometry/core/point';
import type { GridLineDirection } from '~/shared/geometry/grid/grid-segment';

export interface SideGridIntersection {
  point: Point;
  direction: GridLineDirection;
  lineCoordinate: number;
}

export interface InnerGridIntersection {
  point: Point;
  nearestSideDistance: number | null;
}
