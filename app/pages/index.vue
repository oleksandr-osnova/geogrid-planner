<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <p class="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
      {{ t('home.badge') }}
    </p>

    <h1 class="max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
      {{ t('home.title') }}
    </h1>

    <p class="mt-4 max-w-3xl text-base leading-7 text-slate-600">
      {{ t('home.description') }}
    </p>

    <div class="mt-8 grid gap-4 md:grid-cols-2">
      <NuxtLink to="/triangle" class="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-300 hover:bg-blue-50">
        <h2 class="text-lg font-semibold text-slate-950">
          {{ t('navigation.triangle') }}
        </h2>

        <p class="mt-2 text-sm leading-6 text-slate-600">
          {{ t('home.triangleDescription') }}
        </p>
      </NuxtLink>

      <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 opacity-70">
        <h2 class="text-lg font-semibold text-slate-950">
          {{ t('navigation.trapezoid') }}
        </h2>

        <p class="mt-2 text-sm leading-6 text-slate-600">
          {{ t('home.trapezoidDescription') }}
        </p>
      </div>
    </div>
  </section>
</template>
