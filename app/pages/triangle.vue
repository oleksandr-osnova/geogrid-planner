<script setup lang="ts">
import { computed, reactive } from 'vue';
import TrianglePreview from '~/components/preview/TrianglePreview.vue';
import { calculateTriangle } from '~/shared/geometry/calculators/calculate-triangle';
import { useAppSettingsStore } from '~/stores/app-settings';

const { t } = useI18n();
const appSettings = useAppSettingsStore();

const form = reactive({
  ab: 30,
  bc: 26,
  ca: 22,
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
  <section class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-6">
        <p class="text-sm font-semibold uppercase tracking-wide text-blue-600">
          {{ t('navigation.triangle') }}
        </p>

        <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          {{ t('triangle.title') }}
        </h1>

        <p class="mt-2 text-sm leading-6 text-slate-600">
          {{ t('triangle.description') }}
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700"
            >AB, {{ lengthUnitSymbol }}</span
          >
          <input
            v-model.number="form.ab"
            type="number"
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
            class="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700"
            >CA, {{ lengthUnitSymbol }}</span
          >
          <input
            v-model.number="form.ca"
            type="number"
            class="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <TrianglePreview v-if="result" :triangle="result.triangle" />

      <div v-else class="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
        {{ t('triangle.invalid') }}
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
      </dl>

      <p v-else class="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ t('triangle.invalid') }}
      </p>
    </aside>
  </section>
</template>
