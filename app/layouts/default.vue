<script setup lang="ts">
import LayoutAppFooter from '~/components/layout/LayoutAppFooter.vue';
import LayoutAppHeader from '~/components/layout/LayoutAppHeader.vue';
import LayoutAppMain from '~/components/layout/LayoutAppMain.vue';
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-950 antialiased">
    <LayoutAppHeader/>

    <LayoutAppMain>
      <slot/>
    </LayoutAppMain>

    <LayoutAppFooter/>
  </div>
</template>
