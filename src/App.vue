<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { provide } from "vue";
import { useEventContext } from "./context/eventContext";
import { EventContext } from "./data/interfaces";

const eventContext = useEventContext();
provide("eventsContext", eventContext as EventContext);
</script>
