<script setup lang="ts">
import { careerStoryParagraphs, timeline } from '../../data/experience'
import { useScrollReveal } from '../../composables/useScrollReveal'

useScrollReveal()
</script>

<template>
  <section id="story" class="section story-section">
    <div class="section-inner story-grid" ref="reveal">
      <div class="story-copy">
        <p class="eyebrow">How I got here</p>
        <h2 class="story-heading">Not the usual route in</h2>
        <p v-for="(para, i) in careerStoryParagraphs" :key="i" class="story-para">{{ para }}</p>
      </div>
      <ol class="timeline">
        <li v-for="entry in timeline" :key="entry.period">
          <span class="period">{{ entry.period }}</span>
          <span class="role">{{ entry.role }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.story-section {
  background: radial-gradient(ellipse 700px 500px at 0% 30%, color-mix(in srgb, var(--color-bg-alt) 70%, transparent), transparent 65%);
}

.story-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--space-6);
  align-items: start;
}

.story-heading {
  font-size: var(--size-xl);
  margin-bottom: var(--space-3);
}

.story-para {
  color: var(--color-ink-soft);
  margin-bottom: var(--space-2);
  line-height: var(--leading-normal);
}

.timeline {
  border-left: 2px solid var(--color-border);
  padding-left: var(--space-3);
}

.timeline li {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: var(--space-3);
}

.timeline li::before {
  content: '';
  position: absolute;
  left: calc(-1 * var(--space-3) - 4px);
  top: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 8px 1px color-mix(in srgb, var(--color-accent) 60%, transparent);
}

.timeline li:last-child {
  padding-bottom: 0;
}

.period {
  font-size: var(--size-sm);
  font-weight: 600;
  color: var(--color-accent);
}

.role {
  color: var(--color-ink-soft);
  font-size: var(--size-sm);
}

@media (max-width: 780px) {
  .story-grid {
    grid-template-columns: 1fr;
  }
}
</style>
