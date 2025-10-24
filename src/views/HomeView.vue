<template>
  <div class="home-page">
    <h1>Calendar</h1>
    <CalendarContent />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const CalendarContent = defineAsyncComponent(
  () => import("../components/CalendarContent.vue")
);
</script>

<style scoped>
.home-page {
  text-align: center;
}

h1 {
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
</style>
