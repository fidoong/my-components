<script setup lang="ts">
import { RouterView } from 'vue-router'
import {VueContextCapture} from "@/components/ctx/app-ctx.ts";
</script>

<template>
  <RouterView />
  <VueContextCapture />
</template>

<style scoped>
</style>
