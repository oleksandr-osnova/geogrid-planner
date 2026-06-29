<script setup lang="ts">
import { computed } from 'vue';
import type { PlacedPolygon } from '~/shared/geometry/core/placed-polygon';
import type { PolygonGridCalculationResult } from '~/shared/geometry/grid/polygon-grid-calculator';

const props = defineProps<{
  polygon: PlacedPolygon;
  grid: PolygonGridCalculationResult;
}>();

const points = computed(() => props.polygon.points);
const xs = computed(() => points.value.map((point) => point.x));
const ys = computed(() => points.value.map((point) => point.y));
const minX = computed(() => Math.min(...xs.value));
const maxX = computed(() => Math.max(...xs.value));
const minY = computed(() => Math.min(...ys.value));
const maxY = computed(() => Math.max(...ys.value));

const previewSize = computed(() => Math.max(maxX.value - minX.value, maxY.value - minY.value, 1));
const previewPadding = computed(() => previewSize.value * 0.08);
const pointRadius = computed(() => previewSize.value * 0.012);

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
</script>

<template>
  <svg
    :viewBox="viewBox"
    class="mt-6 h-96 w-full rounded border bg-white"
    preserveAspectRatio="xMidYMid meet"
  >
    <polygon
      :points="polygonPoints"
      fill="rgba(59, 130, 246, 0.08)"
      stroke="rgb(37, 99, 235)"
      stroke-width="6"
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
      stroke-width="2"
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
      :r="pointRadius * 0.8"
      fill="rgb(100, 116, 139)"
      opacity="0.45"
    />
  </svg>
</template>
