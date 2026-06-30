<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import {
  DECIMAL_PRECISION_OPTIONS,
  LENGTH_UNIT_OPTIONS,
  type AppLocale,
  type LengthUnit,
  useAppSettingsStore,
} from '~/stores/app-settings';

const { t, setLocale } = useI18n();
const appSettings = useAppSettingsStore();
const isSettingsOpen = ref(false);
let previousBodyOverflow: string | null = null;

const lengthUnitModel = computed({
  get: () => appSettings.lengthUnit,
  set: (value: LengthUnit) => appSettings.setLengthUnit(value),
});

const decimalPrecisionModel = computed({
  get: () => appSettings.decimalPrecision,
  set: (value: number) => appSettings.setDecimalPrecision(Number(value)),
});

function openSettings(): void {
  isSettingsOpen.value = true;
}

function closeSettings(): void {
  isSettingsOpen.value = false;
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    closeSettings();
  }
}

async function changeLocale(value: AppLocale): Promise<void> {
  appSettings.setLocale(value);
  await setLocale(value);

  if (import.meta.client) {
    document.documentElement.lang = value;
  }
}

watch(isSettingsOpen, (isOpen) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeydown);

    return;
  }

  document.body.style.overflow = previousBodyOverflow ?? '';
  previousBodyOverflow = null;
  window.removeEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  if (typeof window === 'undefined') {
    return;
  }

  window.removeEventListener('keydown', handleKeydown);

  if (previousBodyOverflow !== null) {
    document.body.style.overflow = previousBodyOverflow;
  }
});
</script>

<template>
  <header class="z-40 shrink-0 border-b border-slate-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex min-w-0 flex-col gap-1">
          <NuxtLink to="/" class="truncate text-xl font-bold tracking-tight text-slate-950">
            {{ t('app.title') }}
          </NuxtLink>

          <p class="line-clamp-1 text-sm text-slate-500 sm:line-clamp-none">
            {{ t('app.subtitle') }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2 lg:justify-end">
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

          <button
            type="button"
            class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
            :aria-expanded="isSettingsOpen"
            @click="openSettings"
          >
            {{ t('settings.open') }}
          </button>
        </div>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <div
      v-if="isSettingsOpen"
      class="fixed inset-0 z-50 flex justify-end bg-slate-950/40"
      role="dialog"
      aria-modal="true"
      :aria-label="t('settings.title')"
      @click.self="closeSettings"
    >
      <aside class="flex h-[100dvh] w-full max-w-md flex-col bg-white shadow-2xl">
        <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 class="text-lg font-semibold text-slate-950">
              {{ t('settings.title') }}
            </h2>

            <p class="mt-1 text-sm leading-6 text-slate-500">
              {{ t('settings.description') }}
            </p>
          </div>

          <button
            type="button"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
            @click="closeSettings"
          >
            {{ t('settings.close') }}
          </button>
        </div>

        <div class="grid gap-4 overflow-y-auto p-5">
          <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
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

          <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
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

          <label class="flex flex-col gap-1 text-sm font-medium text-slate-700">
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
      </aside>
    </div>
  </Teleport>
</template>
