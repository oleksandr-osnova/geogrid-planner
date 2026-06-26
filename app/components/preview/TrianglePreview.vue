<script setup lang="ts">
import type { Point } from '~/shared/geometry/core/point';

const props = defineProps<{
  points: {
    a: Point;
    b: Point;
    c: Point;
  };
}>();

const xs = computed(() => [props.points.a.x, props.points.b.x, props.points.c.x]);
const ys = computed(() => [props.points.a.y, props.points.b.y, props.points.c.y]);

const minX = computed(() => Math.min(...xs.value));
const maxX = computed(() => Math.max(...xs.value));
const minY = computed(() => Math.min(...ys.value));
const maxY = computed(() => Math.max(...ys.value));

const previewPadding = computed(() => {
  const width = maxX.value - minX.value;
  const height = maxY.value - minY.value;

  return Math.max(Math.max(width, height) * 0.08, 120);
});

const viewBox = computed(() => {
  const padding = previewPadding.value;
  const width = maxX.value - minX.value + padding * 2;
  const height = maxY.value - minY.value + padding * 2;

  return `${ minX.value - padding } ${ -maxY.value - padding } ${ width } ${ height }`;
});

const polygonPoints = computed(() => {
  const { a, b, c } = props.points;

  return [
    `${ a.x },${ -a.y }`,
    `${ b.x },${ -b.y }`,
    `${ c.x },${ -c.y }`,
  ].join(' ');
});
</script>

<template>
  <svg :viewBox="viewBox" class="mt-6 h-96 w-full overflow-visible rounded border bg-white">
    <polygon
      :points="polygonPoints"
      fill="rgba(59, 130, 246, 0.08)"
      stroke="rgb(37, 99, 235)"
      stroke-width="8"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
