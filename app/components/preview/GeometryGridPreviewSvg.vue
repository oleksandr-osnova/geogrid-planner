<script setup lang="ts">
import { computed } from 'vue';
import type { Point } from '~/shared/geometry/core/point';
import type { PlacedPolygon } from '~/shared/geometry/core/placed-polygon';
import type { PolygonGridCalculationResult } from '~/shared/geometry/grid/polygon-grid-calculator';

const props = defineProps<{
  polygon: PlacedPolygon;
  grid: PolygonGridCalculationResult;
}>();

interface LabeledPoint {
  key: string;
  point: Point;
  labelX: number;
  labelY: number;
}

const points = computed(() => props.polygon.points);
const xs = computed(() => points.value.map((point) => point.x));
const ys = computed(() => points.value.map((point) => point.y));
const minX = computed(() => Math.min(...xs.value));
const maxX = computed(() => Math.max(...xs.value));
const minY = computed(() => Math.min(...ys.value));
const maxY = computed(() => Math.max(...ys.value));

const previewSize = computed(() => Math.max(maxX.value - minX.value, maxY.value - minY.value, 1));
const previewPadding = computed(() => previewSize.value * 0.1);
const pointRadius = computed(() => previewSize.value * 0.01);
const excludedPointRadius = computed(() => pointRadius.value * 0.75);
const polygonStrokeWidth = computed(() => 2.5);
const mainSideStrokeWidth = computed(() => 4);
const gridStrokeWidth = computed(() => 1.5);
const cornerLabelFontSize = computed(() => previewSize.value * 0.04);
const cornerLabelOffset = computed(() => previewSize.value * 0.05);

const viewBox = computed(() => {
  const width = maxX.value - minX.value + previewPadding.value * 2;
  const height = maxY.value - minY.value + previewPadding.value * 2;

  return `${minX.value - previewPadding.value} ${-maxY.value - previewPadding.value} ${width} ${height}`;
});

const polygonPoints = computed(() => {
  return points.value.map((point) => `${point.x},${-point.y}`).join(' ');
});

const gridSegments = computed(() => [
  ...props.grid.parallelSegments,
  ...props.grid.perpendicularSegments,
]);

const cornerPointLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

function calculateLabelPosition(point: Point, pointIndex: number): { x: number; y: number } {
  const previousPoint = points.value[(pointIndex - 1 + points.value.length) % points.value.length];
  const nextPoint = points.value[(pointIndex + 1) % points.value.length];

  if (!previousPoint || !nextPoint) {
    return {
      x: point.x + cornerLabelOffset.value,
      y: -point.y - cornerLabelOffset.value,
    };
  }

  const outwardX = point.x - previousPoint.x + (point.x - nextPoint.x);
  const outwardY = point.y - previousPoint.y + (point.y - nextPoint.y);
  const vectorLength = Math.hypot(outwardX, outwardY);

  if (vectorLength === 0) {
    return {
      x: point.x + cornerLabelOffset.value,
      y: -point.y - cornerLabelOffset.value,
    };
  }

  return {
    x: point.x + (outwardX / vectorLength) * cornerLabelOffset.value,
    y: -point.y - (outwardY / vectorLength) * cornerLabelOffset.value,
  };
}

const labeledPoints = computed<LabeledPoint[]>(() => {
  return points.value.map((point, index) => {
    const labelPosition = calculateLabelPosition(point, index);

    return {
      key: cornerPointLabels[index] ?? String.fromCharCode(65 + index),
      point,
      labelX: labelPosition.x,
      labelY: labelPosition.y,
    };
  });
});

const mainSegment = computed(() => props.polygon.mainSegment);
</script>

<template>
  <svg :viewBox="viewBox" class="block" preserveAspectRatio="xMidYMid meet">
    <polygon
      :points="polygonPoints"
      fill="rgba(59, 130, 246, 0.08)"
      stroke="rgb(37, 99, 235)"
      :stroke-width="polygonStrokeWidth"
      vector-effect="non-scaling-stroke"
    />

    <line
      v-for="(item, index) in gridSegments"
      :key="`${item.direction}-${item.lineCoordinate}-${index}`"
      :x1="item.segment.start.x"
      :y1="-item.segment.start.y"
      :x2="item.segment.end.x"
      :y2="-item.segment.end.y"
      stroke="rgb(148, 163, 184)"
      :stroke-width="gridStrokeWidth"
      vector-effect="non-scaling-stroke"
    />

    <line
      :x1="mainSegment.start.x"
      :y1="-mainSegment.start.y"
      :x2="mainSegment.end.x"
      :y2="-mainSegment.end.y"
      stroke="rgb(22, 163, 74)"
      :stroke-width="mainSideStrokeWidth"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
    />

    <circle
      v-for="(intersection, index) in props.grid.sideIntersections"
      :key="`side-${index}`"
      :cx="intersection.point.x"
      :cy="-intersection.point.y"
      :r="pointRadius"
      fill="rgb(239, 68, 68)"
    />

    <circle
      v-for="(intersection, index) in props.grid.innerIntersections"
      :key="`inner-${index}`"
      :cx="intersection.point.x"
      :cy="-intersection.point.y"
      :r="pointRadius"
      fill="rgb(249, 115, 22)"
    />

    <circle
      v-for="(intersection, index) in props.grid.excludedInnerIntersections"
      :key="`excluded-${index}`"
      :cx="intersection.point.x"
      :cy="-intersection.point.y"
      :r="excludedPointRadius"
      fill="rgb(100, 116, 139)"
      opacity="0.45"
    />

    <g v-for="label in labeledPoints" :key="`label-${label.key}`">
      <circle
        :cx="label.point.x"
        :cy="-label.point.y"
        :r="pointRadius * 1.2"
        fill="rgb(255, 255, 255)"
        stroke="rgb(37, 99, 235)"
        :stroke-width="1.5"
        vector-effect="non-scaling-stroke"
      />

      <text
        :x="label.labelX"
        :y="label.labelY"
        :font-size="cornerLabelFontSize"
        fill="rgb(15, 23, 42)"
        font-weight="700"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ label.key }}
      </text>
    </g>
  </svg>
</template>
