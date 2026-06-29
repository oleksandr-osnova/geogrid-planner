<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import GeometryGridPreviewSvg from '~/components/preview/GeometryGridPreviewSvg.vue';
import type { PlacedPolygon } from '~/shared/geometry/core/placed-polygon';
import type { PolygonGridCalculationResult } from '~/shared/geometry/grid/polygon-grid-calculator';

const props = defineProps<{
  polygon: PlacedPolygon;
  grid: PolygonGridCalculationResult;
}>();

const { t } = useI18n();
const isFullscreenPreviewOpen = ref(false);
let previousBodyOverflow: string | null = null;

function openFullscreenPreview(): void {
  isFullscreenPreviewOpen.value = true;
}

function closeFullscreenPreview(): void {
  isFullscreenPreviewOpen.value = false;
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    closeFullscreenPreview();
  }
}

watch(isFullscreenPreviewOpen, (isOpen) => {
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
  <div class="mt-6 overflow-hidden rounded border bg-white">
    <div class="flex justify-end border-b border-slate-200 bg-slate-50 px-3 py-2">
      <button
        type="button"
        class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
        @click="openFullscreenPreview"
      >
        {{ t('preview.openFullscreen') }}
      </button>
    </div>

    <GeometryGridPreviewSvg :polygon="props.polygon" :grid="props.grid" class="h-96 w-full" />
  </div>

  <Teleport to="body">
    <div
      v-if="isFullscreenPreviewOpen"
      class="fixed inset-0 z-50 flex bg-slate-950/80 p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      :aria-label="t('preview.fullscreenTitle')"
      @click.self="closeFullscreenPreview"
    >
      <div class="flex min-h-0 w-full flex-col rounded-2xl bg-white shadow-2xl">
        <div
          class="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-2 sm:px-4"
        >
          <p class="text-sm font-semibold text-slate-800 sm:text-base">
            {{ t('preview.fullscreenTitle') }}
          </p>

          <button
            type="button"
            class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
            @click="closeFullscreenPreview"
          >
            {{ t('preview.closeFullscreen') }}
          </button>
        </div>

        <div class="min-h-0 flex-1 p-2 sm:p-4">
          <GeometryGridPreviewSvg
            :polygon="props.polygon"
            :grid="props.grid"
            class="h-[calc(100dvh-6rem)] w-full rounded border bg-white sm:h-[calc(100dvh-7rem)]"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
