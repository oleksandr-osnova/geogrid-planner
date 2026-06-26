<script setup lang="ts">
const { t } = useI18n();
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-slate-200 bg-white">
    <div class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <p>
        © {{ currentYear }} {{ t('app.title') }}
      </p>

      <p class="max-w-3xl md:text-right">
        {{ t('layout.footer.disclaimer') }}
      </p>
    </div>
  </footer>
</template>
