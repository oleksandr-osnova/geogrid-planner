<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  DECIMAL_PRECISION_OPTIONS,
  LENGTH_UNIT_OPTIONS,
  type AppLocale,
  type LengthUnit,
  useAppSettingsStore,
} from '~/stores/app-settings';

const { t, setLocale } = useI18n();
const appSettings = useAppSettingsStore();
const isControlsOpen = ref(false);

const lengthUnitModel = computed({
  get: () => appSettings.lengthUnit,
  set: (value: LengthUnit) => appSettings.setLengthUnit(value),
});

const decimalPrecisionModel = computed({
  get: () => appSettings.decimalPrecision,
  set: (value: number) => appSettings.setDecimalPrecision(Number(value)),
});

async function changeLocale(value: AppLocale): Promise<void> {
  appSettings.setLocale(value);
  await setLocale(value);

  if (import.meta.client) {
    document.documentElement.lang = value;
  }
}
</script>

<template>
  <header class="z-40 shrink-0 border-b border-slate-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
      <div class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 flex-col gap-1">
          <NuxtLink to="/" class="truncate text-xl font-bold tracking-tight text-slate-950">
            {{ t('app.title') }}
          </NuxtLink>

          <p class="line-clamp-2 text-sm text-slate-500 sm:line-clamp-none">
            {{ t('app.subtitle') }}
          </p>
        </div>

        <button
          type="button"
          class="inline-flex shrink-0 items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 lg:hidden"
          :aria-expanded="isControlsOpen"
          aria-controls="app-header-controls"
          @click="isControlsOpen = !isControlsOpen"
        >
          {{ isControlsOpen ? t('layout.header.hideControls') : t('layout.header.showControls') }}
        </button>
      </div>

      <div
        id="app-header-controls"
        class="mt-4 gap-3 lg:grid lg:grid-cols-[auto_minmax(0,30rem)] lg:items-center lg:justify-end"
        :class="isControlsOpen ? 'grid' : 'hidden'"
      >
        <nav class="flex flex-wrap gap-2" :aria-label="t('layout.header.navigation')">
          <NuxtLink
            to="/triangle"
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            active-class="border-blue-500 bg-blue-50 text-blue-700"
          >
            {{ t('navigation.triangle') }}
          </NuxtLink>

          <NuxtLink
            to="/trapezoid"
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            active-class="border-blue-500 bg-blue-50 text-blue-700"
          >
            {{ t('navigation.trapezoid') }}
          </NuxtLink>
        </nav>

        <div class="grid gap-2 sm:grid-cols-3">
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
            <select
              v-model="lengthUnitModel"
              class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option
                v-for="option in LENGTH_UNIT_OPTIONS"
                :key="option.value"
                :value="option.value"
              >
                {{ t(option.labelKey) }}
              </option>
            </select>
          </label>

          <label class="flex flex-col gap-1 text-xs font-medium text-slate-500">
            {{ t('settings.precision') }}
            <select
              v-model.number="decimalPrecisionModel"
              class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
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
