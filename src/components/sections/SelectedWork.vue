<script setup lang="ts">
import { selectedWork } from '../../data/selectedWork'
import { useScrollReveal } from '../../composables/useScrollReveal'

useScrollReveal()
</script>

<template>
  <section id="work" class="section work-section">
    <div class="section-inner" ref="reveal">
      <p class="eyebrow">Selected work</p>
      <h2 class="work-heading">The work behind the numbers</h2>
      <div class="work-grid">
        <article v-for="item in selectedWork" :key="item.title" class="work-item">
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.work-section {
  background: radial-gradient(ellipse 800px 500px at 100% 20%, color-mix(in srgb, var(--color-bg-alt) 65%, transparent), transparent 65%);
}

.work-heading {
  font-size: var(--size-xl);
  max-width: 34rem;
  margin-bottom: var(--space-5);
}

.work-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
}

.work-item {
  padding: var(--space-3);
  margin: calc(var(--space-3) * -1);
  border-radius: var(--radius);
  border-left: 2px solid transparent;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.work-item:hover {
  background-color: color-mix(in srgb, var(--color-bg-alt) 55%, transparent);
  border-left-color: var(--color-accent);
}

.work-item h3 {
  font-size: var(--size-lg);
  margin-bottom: var(--space-2);
}

.work-item p {
  color: var(--color-ink-soft);
  line-height: var(--leading-normal);
}

@media (max-width: 780px) {
  .work-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
}
</style>
