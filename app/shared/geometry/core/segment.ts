import type { Point } from '~/shared/geometry/core/point';
import { distance } from '~/shared/geometry/core/point';

export interface Segment {
  start: Point;
  end: Point;
}

export function segmentLength (segment: Segment): number {
  return distance(segment.start, segment.end);
}
