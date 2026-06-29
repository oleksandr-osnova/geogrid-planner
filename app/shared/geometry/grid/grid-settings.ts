export interface GridSettings {
  /** Distance between neighbouring grid lines in current global length units. */
  step: number;

  /**
   * Minimal allowed distance from an inner grid intersection to the nearest side intersection on
   * the same grid line.
   *
   * Example: if the value is 500 mm and the orange point is only 300 mm from the red side point on
   * the same horizontal or vertical grid line, this orange point is excluded from the final count.
   */
  minDistanceFromSideIntersection: number;
}

export function assertValidGridSettings(settings: GridSettings): void {
  if (settings.step <= 0) {
    throw new Error('Grid step must be greater than zero.');
  }

  if (settings.minDistanceFromSideIntersection < 0) {
    throw new Error('Minimal distance from side intersection cannot be negative.');
  }
}
