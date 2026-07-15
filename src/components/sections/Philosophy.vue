<script setup lang="ts">
import { philosophy } from '../../data/philosophy'
import { useScrollReveal } from '../../composables/useScrollReveal'

useScrollReveal()
</script>

<template>
  <section id="philosophy" class="section philosophy">
    <div class="section-inner" ref="reveal">
      <p class="eyebrow">How I think about the job</p>
      <ul class="philosophy-list">
        <li v-for="(item, i) in philosophy" :key="i">
          <span class="marker">{{ String(i + 1).padStart(2, '0') }}</span>
          <p>{{ item.statement }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.philosophy {
  background:
    radial-gradient(ellipse 800px 500px at 100% 0%, color-mix(in srgb, var(--color-accent-invert) 10%, transparent), transparent 70%),
    var(--color-ink);
  color: var(--color-bg);
}

.philosophy :deep(.eyebrow) {
  color: var(--color-accent-invert);
}

.philosophy-list {
  display: grid;
  gap: var(--space-4);
}

.philosophy-list li {
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  gap: var(--space-3);
  align-items: start;
  border-top: 1px solid color-mix(in srgb, var(--color-bg) 20%, transparent);
  padding-top: var(--space-3);
}

.marker {
  font-family: var(--font-display);
  font-size: var(--size-lg);
  color: var(--color-accent-invert);
}

.philosophy-list p {
  font-size: var(--size-base);
  line-height: var(--leading-snug);
  max-width: 42rem;
}

@media (max-width: 640px) {
  .philosophy-list li {
    grid-template-columns: 2.5rem 1fr;
  }
}
</style>
