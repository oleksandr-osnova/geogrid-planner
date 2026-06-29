<script setup lang="ts">
import { computed, reactive } from 'vue';
import GeometryGridPreview from '~/components/preview/GeometryGridPreview.vue';
import { calculateTrapezoid } from '~/shared/geometry/calculators/calculate-trapezoid';
import { TRAPEZOID_SIDE_KEYS, type TrapezoidSideKey } from '~/shared/geometry/shapes/trapezoid';
import { useAppSettingsStore } from '~/stores/app-settings';

const { t } = useI18n();
const appSettings = useAppSettingsStore();

const form = reactive({
  ab: 30,
  bc: 15,
  cd: 18,
  da: 16,
  mainSideKey: 'ab' as TrapezoidSideKey,
  gridStep: 5,
  minDistanceFromSideIntersection: 0.5,
});

const lengthUnitSymbol = computed(() => t(appSettings.lengthUnitOption.symbolKey));

/**
 * Formats a length in the active global unit without converting the value.
 */
function formatLength(value: number): string {
  return `${appSettings.formatNumber(value)} ${lengthUnitSymbol.value}`;
}

/**
 * Formats an area in the squared active global unit without converting the value.
 */
function formatArea(value: number): string {
  return `${appSettings.formatNumber(value)} ${lengthUnitSymbol.value}²`;
}

const result = computed(() => {
  try {
    return calculateTrapezoid({
      ab: Number(form.ab),
      bc: Number(form.bc),
      cd: Number(form.cd),
      da: Number(form.da),
      mainSideKey: form.mainSideKey,
      gridStep: Number(form.gridStep),
      minDistanceFromSideIntersection: Number(form.minDistanceFromSideIntersection),
    });
  } catch {
    return null;
  }
});
</script>

<template>
  <section class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-6">
        <p class="text-sm font-semibold uppercase tracking-wide text-blue-600">
          {{ t('navigation.trapezoid') }}
        </p>

        <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          {{ t('trapezoid.title') }}
        </h1>

        <p class="mt-2 text-sm leading-6 text-slate-600">
          {{ t('trapezoid.description') }}
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-4">
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700"
            >AB, {{ lengthUnitSymbol }}</span
          >
          <input
            v-model.number="form.ab"
            type="number"
            min="0"
            class="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700"
            >BC, {{ lengthUnitSymbol }}</span
          >
          <input
            v-model.number="form.bc"
            type="number"
            min="0"
            class="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700"
            >CD, {{ lengthUnitSymbol }}</span
          >
          <input
            v-model.number="form.cd"
            type="number"
            min="0"
            class="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700"
            >DA, {{ lengthUnitSymbol }}</span
          >
          <input
            v-model.number="form.da"
            type="number"
            min="0"
            class="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <div class="mt-4 grid gap-4 md:grid-cols-3">
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">
            {{ t('geometry.mainSide') }}
          </span>
          <select
            v-model="form.mainSideKey"
            class="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          >
            <option v-for="sideKey in TRAPEZOID_SIDE_KEYS" :key="sideKey" :value="sideKey">
              {{ t(`trapezoid.sides.${sideKey}`) }}
            </option>
          </select>
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">
            {{ t('geometry.gridStep') }}, {{ lengthUnitSymbol }}
          </span>
          <input
            v-model.number="form.gridStep"
            type="number"
            min="0"
            step="0.1"
            class="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">
            {{ t('geometry.minDistance') }}, {{ lengthUnitSymbol }}
          </span>
          <input
            v-model.number="form.minDistanceFromSideIntersection"
            type="number"
            min="0"
            step="0.1"
            class="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <GeometryGridPreview v-if="result" :polygon="result.placedPolygon" :grid="result.grid" />

      <div v-else class="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
        {{ t('trapezoid.invalid') }}
      </div>
    </div>

    <aside class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-slate-950">
        {{ t('results.title') }}
      </h2>

      <dl v-if="result" class="mt-4 grid gap-3">
        <div class="rounded-2xl bg-slate-50 p-4">
          <dt class="text-sm text-slate-500">
            {{ t('results.area') }}
          </dt>
          <dd class="mt-1 text-xl font-semibold text-slate-950">
            {{ formatArea(result.area) }}
          </dd>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
          <dt class="text-sm text-slate-500">
            {{ t('results.perimeter') }}
          </dt>
          <dd class="mt-1 text-xl font-semibold text-slate-950">
            {{ formatLength(result.perimeter) }}
          </dd>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
          <dt class="text-sm text-slate-500">
            {{ t('results.gridLines') }}
          </dt>
          <dd class="mt-1 text-xl font-semibold text-slate-950">
            {{ result.grid.parallelSegments.length + result.grid.perpendicularSegments.length }}
          </dd>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
          <dt class="text-sm text-slate-500">
            {{ t('results.gridLength') }}
          </dt>
          <dd class="mt-1 text-xl font-semibold text-slate-950">
            {{ formatLength(result.grid.totalLength) }}
          </dd>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
          <dt class="text-sm text-slate-500">
            {{ t('results.sideIntersections') }}
          </dt>
          <dd class="mt-1 text-xl font-semibold text-slate-950">
            {{ result.grid.sideIntersections.length }}
          </dd>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
          <dt class="text-sm text-slate-500">
            {{ t('results.innerIntersections') }}
          </dt>
          <dd class="mt-1 text-xl font-semibold text-slate-950">
            {{ result.grid.innerIntersections.length }}
          </dd>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
          <dt class="text-sm text-slate-500">
            {{ t('results.excludedInnerIntersections') }}
          </dt>
          <dd class="mt-1 text-xl font-semibold text-slate-950">
            {{ result.grid.excludedInnerIntersections.length }}
          </dd>
        </div>
      </dl>

      <p v-else class="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ t('trapezoid.invalid') }}
      </p>
    </aside>
  </section>
</template>
