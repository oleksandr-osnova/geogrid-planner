import type { Segment } from '~/shared/geometry/core/segment';

export type GridLineDirection = 'parallel' | 'perpendicular';

/**
 * Visible part of a grid line after it was clipped by the polygon.
 *
 * A real grid line is mathematically infinite, but only the part inside the figure is useful for
 * length totals and visualisation. That inside part is stored as a regular segment.
 */
export interface GridSegment {
  direction: GridLineDirection;
  lineCoordinate: number;
  segment: Segment;
}
