<script setup lang="ts">
import { testimonials } from '../../data/testimonials'
import { useScrollReveal } from '../../composables/useScrollReveal'

useScrollReveal()
</script>

<template>
  <section id="testimonials" class="section testimonials-section">
    <div class="section-inner" ref="reveal">
      <p class="eyebrow">In their words</p>
      <div class="testimonial-grid">
        <blockquote v-for="(item, i) in testimonials" :key="i" :class="{ empty: !item.quote }">
          <template v-if="item.quote">
            <p class="quote">&ldquo;{{ item.quote }}&rdquo;</p>
            <footer>{{ item.name }}, {{ item.role }}</footer>
          </template>
          <template v-else>
            <p class="placeholder-note">
              Ask a manager, peer, or direct report for a couple of honest sentences on what it's
              like working with you - add it to
              <code>src/data/testimonials.ts</code>.
            </p>
          </template>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials-section {
  background: radial-gradient(ellipse 900px 500px at 50% 0%, color-mix(in srgb, var(--color-bg-alt) 60%, transparent), transparent 70%);
}

.testimonial-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

blockquote {
  margin: 0;
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg-alt);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

blockquote:not(.empty):hover {
  transform: translateY(-3px);
  border-color: var(--color-accent);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--color-bg) 55%, transparent);
}

blockquote.empty {
  border-style: dashed;
  background: transparent;
}

.quote {
  font-family: var(--font-display);
  font-size: var(--size-lg);
  line-height: var(--leading-snug);
  margin-bottom: var(--space-2);
}

footer {
  color: var(--color-ink-soft);
  font-size: var(--size-sm);
}

.placeholder-note {
  color: var(--color-ink-faint);
  font-size: var(--size-sm);
  line-height: var(--leading-normal);
}

.placeholder-note code {
  font-family: ui-monospace, monospace;
}

@media (max-width: 780px) {
  .testimonial-grid {
    grid-template-columns: 1fr;
  }
}
</style>
