<script setup lang="ts">
import { computed } from 'vue';
import {
  DECIMAL_PRECISION_OPTIONS,
  LENGTH_UNIT_OPTIONS,
  type AppLocale,
  type LengthUnit,
  useAppSettingsStore,
} from '~/stores/app-settings';

const { t, setLocale } = useI18n();
const appSettings = useAppSettingsStore();

const lengthUnitModel = computed({
  get: () => appSettings.lengthUnit,
  set: (value: LengthUnit) => appSettings.setLengthUnit(value),
});

const decimalPrecisionModel = computed({
  get: () => appSettings.decimalPrecision,
  set: (value: number) => appSettings.setDecimalPrecision(Number(value)),
});

async function changeLocale (value: AppLocale): Promise<void> {
  appSettings.setLocale(value);
  await setLocale(value);

  if (import.meta.client) {
    document.documentElement.lang = value;
  }
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div class="flex flex-col gap-1">
        <NuxtLink to="/" class="text-xl font-bold tracking-tight text-slate-950">
          {{ t('app.title') }}
        </NuxtLink>

        <p class="text-sm text-slate-500">
          {{ t('app.subtitle') }}
        </p>
      </div>

      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <nav class="flex flex-wrap gap-2" :aria-label="t('layout.header.navigation')">
          <NuxtLink
            to="/triangle"
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            active-class="border-blue-500 bg-blue-50 text-blue-700"
          >
            {{ t('navigation.triangle') }}
          </NuxtLink>

          <span
            class="cursor-not-allowed rounded-full border border-dashed border-slate-200 px-4 py-2 text-sm font-medium text-slate-400">
            {{ t('navigation.trapezoid') }} · {{ t('common.soon') }}
          </span>
        </nav>

        <div class="grid gap-2 sm:grid-cols-3 lg:w-[30rem]">
          <label class="flex flex-col gap-1 text-xs font-medium text-slate-500">
            {{ t('settings.language') }}
            <select
              :value="appSettings.locale"
              class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              @change="changeLocale(($event.target as HTMLSelectElement).value as AppLocale)"
            >
              <option value="uk">Українська</option>
              <option value="en">English</option>
            </select>
          </label>

          <label class="flex flex-col gap-1 text-xs font-medium text-slate-500">
            {{ t('settings.unit') }}
            <select v-model="lengthUnitModel"
                    class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
              <option v-for="option in LENGTH_UNIT_OPTIONS" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <label class="flex flex-col gap-1 text-xs font-medium text-slate-500">
            {{ t('settings.precision') }}
            <select v-model.number="decimalPrecisionModel"
                    class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
              <option v-for="option in DECIMAL_PRECISION_OPTIONS" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </label>
        </div>
      </div>
    </div>
  </header>
</template>
