<script setup lang="ts">
import { ref } from 'vue';

const { t } = useI18n();
const currentYear = new Date().getFullYear();
const isDisclaimerOpen = ref(false);
</script>

<template>
  <footer class="shrink-0 border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between gap-3 md:hidden">
        <p>© {{ currentYear }} {{ t('app.title') }}</p>

        <button
          type="button"
          class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          :aria-expanded="isDisclaimerOpen"
          aria-controls="app-footer-disclaimer"
          @click="isDisclaimerOpen = !isDisclaimerOpen"
        >
          {{
            isDisclaimerOpen ? t('layout.footer.hideDisclaimer') : t('layout.footer.showDisclaimer')
          }}
        </button>
      </div>

      <div class="hidden gap-3 md:flex md:items-center md:justify-between">
        <p>© {{ currentYear }} {{ t('app.title') }}</p>

        <p class="max-w-3xl md:text-right">
          {{ t('layout.footer.disclaimer') }}
        </p>
      </div>

      <p
        id="app-footer-disclaimer"
        class="mt-3 text-xs leading-5 md:hidden"
        :class="isDisclaimerOpen ? 'block' : 'hidden'"
      >
        {{ t('layout.footer.disclaimer') }}
      </p>
    </div>
  </footer>
</template>
