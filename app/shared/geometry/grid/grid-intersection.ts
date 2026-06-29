import type { Point } from '~/shared/geometry/core/point';
import type { GridLineDirection } from '~/shared/geometry/grid/grid-segment';

export interface SideGridIntersection {
  point: Point;
  direction: GridLineDirection;
  lineCoordinate: number;
}

export interface InnerGridIntersection {
  point: Point;

  /**
   * Minimal distance to the side intersection along either crossing grid segment.
   *
   * Text explanation: an orange point belongs to one horizontal and one vertical grid segment at
   * the same time. We measure how far it is from the red endpoints of both those real segments and
   * keep the smallest distance here.
   */
  nearestSideDistance: number | null;

  /** Distance to the closest red endpoint of the horizontal/parallel grid segment. */
  nearestParallelSideDistance: number | null;

  /** Distance to the closest red endpoint of the vertical/perpendicular grid segment. */
  nearestPerpendicularSideDistance: number | null;
}
