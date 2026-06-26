<script setup lang="ts">
import { computed, reactive } from 'vue';
import { calculateTriangle } from '~/shared/geometry/calculators/calculate-triangle';
import TrianglePreview from "~/components/preview/TrianglePreview.vue";

const form = reactive({
  ab: 3000,
  bc: 2600,
  ca: 2200,
});

const result = computed(() => {
  try {
    return calculateTriangle({
      ab: Number(form.ab),
      bc: Number(form.bc),
      ca: Number(form.ca),
    });
  } catch {
    return null;
  }
});
</script>

<template>
  <section class="mx-auto max-w-5xl p-6">
    <h1 class="mb-6 text-3xl font-bold">
      GeoGrid Planner
    </h1>

    <div class="grid gap-4 md:grid-cols-3">
      <label class="block">
        <span class="mb-1 block text-sm font-medium">AB, mm</span>
        <input v-model.number="form.ab" type="number" class="w-full rounded border p-2">
      </label>

      <label class="block">
        <span class="mb-1 block text-sm font-medium">BC, mm</span>
        <input v-model.number="form.bc" type="number" class="w-full rounded border p-2">
      </label>

      <label class="block">
        <span class="mb-1 block text-sm font-medium">CA, mm</span>
        <input v-model.number="form.ca" type="number" class="w-full rounded border p-2">
      </label>
    </div>

    <TrianglePreview v-if="result" :points="result.resolvedTriangle.points"/>

    <div v-if="result" class="mt-6 rounded border bg-white p-4">
      <div>Area: {{ result.area.toFixed(2) }} mm²</div>
      <div>Perimeter: {{ result.perimeter.toFixed(2) }} mm</div>
    </div>

    <div v-else class="mt-6 rounded border border-red-300 bg-red-50 p-4 text-red-700">
      Invalid triangle sides.
    </div>
  </section>
</template>

<style scoped>

</style>
