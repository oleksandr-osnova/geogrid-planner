<script setup lang="ts">
import { computed } from 'vue';
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

  return Math.max(width, height) * 0.08;
});

const viewBox = computed(() => {
  const width = maxX.value - minX.value + previewPadding.value * 2;
  const height = maxY.value - minY.value + previewPadding.value * 2;

  return `${ minX.value - previewPadding.value } ${ -maxY.value - previewPadding.value } ${ width } ${ height }`;
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
  <svg :viewBox="viewBox" class="mt-6 h-96 w-full rounded border bg-white" preserveAspectRatio="xMidYMid meet">
    <polygon
      :points="polygonPoints"
      fill="rgba(59, 130, 246, 0.08)"
      stroke="rgb(37, 99, 235)"
      stroke-width="6"
      vector-effect="non-scaling-stroke"
    />
  </svg>
</template>
