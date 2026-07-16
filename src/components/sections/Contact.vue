<script setup lang="ts">
import { useScrollReveal } from '../../composables/useScrollReveal'

useScrollReveal()
</script>

<template>
  <section id="contact" class="section contact-section">
    <div class="section-inner section-inner--narrow contact" ref="reveal">
      <p class="eyebrow">Get in touch</p>
      <h2 class="contact-heading">Open to Head of Engineering / Director of Engineering conversations.</h2>
      <p class="contact-location">Based in Cheshire, UK - flexible on remote or hybrid, depending on location.</p>
      <div class="contact-links">
        <a href="mailto:me@johngoodwin.info" class="btn btn-primary">Email me</a>
        <a href="https://www.linkedin.com/in/goodwinjohn" target="_blank" rel="noopener" class="btn">LinkedIn</a>
        <a href="/john-goodwin-cv.pdf" class="btn" download>Download CV</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  background: radial-gradient(ellipse 900px 550px at 50% 100%, color-mix(in srgb, var(--color-accent) 5%, transparent), transparent 70%);
}

.contact {
  text-align: center;
}

.contact-heading {
  font-size: var(--size-xl);
  margin-bottom: var(--space-2);
}

.contact-location {
  color: var(--color-ink-soft);
  margin-bottom: var(--space-4);
}

.contact-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  border: 1px solid var(--color-ink);
  text-decoration: none;
  color: var(--color-ink);
  font-size: var(--size-sm);
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.btn:hover {
  background: var(--color-ink);
  color: var(--color-bg);
  transform: translateY(-2px);
}

.btn-primary {
  background: var(--gradient-accent);
  border-color: transparent;
  color: var(--color-accent-ink);
}

.btn-primary:hover {
  background: var(--gradient-accent);
  color: var(--color-accent-ink);
  filter: brightness(0.9);
  transform: translateY(-2px);
}
</style>
