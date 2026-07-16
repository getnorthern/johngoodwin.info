<script setup lang="ts">
import { highlights } from '../../data/highlights'
import { useScrollReveal } from '../../composables/useScrollReveal'

useScrollReveal()
</script>

<template>
  <section class="highlights">
    <div class="section-inner" ref="reveal">
      <ul class="highlights-grid">
        <li v-for="item in highlights" :key="item.label">
          <span class="value">{{ item.value }}</span>
          <span class="label">{{ item.label }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.highlights {
  position: relative;
  padding: var(--space-5) var(--space-3);
  background: linear-gradient(180deg, var(--color-bg-alt), color-mix(in srgb, var(--color-bg-alt) 80%, var(--color-bg)));
}

.highlights::before,
.highlights::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
}

.highlights::before {
  top: 0;
}

.highlights::after {
  bottom: 0;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  text-align: center;
}

.highlights-grid li {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.value {
  font-family: var(--font-display);
  font-size: var(--size-2xl);
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.label {
  font-size: var(--size-sm);
  color: var(--color-ink-soft);
}

@media (max-width: 720px) {
  .highlights-grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: var(--space-4);
  }
}
</style>
