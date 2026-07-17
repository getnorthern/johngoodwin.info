<script setup lang="ts">
import { useScrollProgress } from '../composables/useScrollProgress'

const { progress } = useScrollProgress()
</script>

<template>
  <div class="scroll-progress" aria-hidden="true">
    <div class="scroll-progress__fill" :style="{ width: `${progress * 100}%` }" />
  </div>
</template>

<style scoped>
.scroll-progress {
  position: absolute;
  /* -2px, not -1px: absolute positioning is relative to .nav's padding
     box, which sits 1px above its border box because of border-bottom. */
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-bg);
}

.scroll-progress__fill {
  height: 100%;
  background: var(--color-accent);
}
</style>
