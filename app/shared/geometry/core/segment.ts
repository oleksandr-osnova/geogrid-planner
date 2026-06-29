import { Point, type PointCoordinates } from '~/shared/geometry/core/point';

export interface SegmentPoints {
  start: PointCoordinates;
  end: PointCoordinates;
}

/**
 * Immutable segment between two geometry points.
 */
export class Segment {
  public readonly start: Point;
  public readonly end: Point;

  public constructor(start: Point | PointCoordinates, end: Point | PointCoordinates) {
    this.start = Point.from(start);
    this.end = Point.from(end);
  }

  public static from(segment: Segment | SegmentPoints): Segment {
    if (segment instanceof Segment) {
      return segment;
    }

    return new Segment(segment.start, segment.end);
  }

  public get length(): number {
    return this.start.distanceTo(this.end);
  }

  public toPoints(): SegmentPoints {
    return {
      start: this.start.toCoordinates(),
      end: this.end.toCoordinates(),
    };
  }
}
