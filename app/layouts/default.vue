<script setup lang="ts">

import LayoutAppHeader from "~/components/layout/LayoutAppHeader.vue";
import LayoutAppFooter from "~/components/layout/LayoutAppFooter.vue";
import LayoutAppMain from "~/components/layout/LayoutAppMain.vue";
</script>

<template>
  <div class="layout">
    <LayoutAppHeader />
    <LayoutAppMain>
      <slot />
    </LayoutAppMain>
    <LayoutAppFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
