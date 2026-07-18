<script setup lang="ts">
import AppNav from './components/AppNav.vue'
import Hero from './components/sections/Hero.vue'
import Highlights from './components/sections/Highlights.vue'
import CareerStory from './components/sections/CareerStory.vue'
import SelectedWork from './components/sections/SelectedWork.vue'
import Philosophy from './components/sections/Philosophy.vue'
import Personal from './components/sections/Personal.vue'
import Testimonials from './components/sections/Testimonials.vue'
import Contact from './components/sections/Contact.vue'
</script>

<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <AppNav />
  <main id="main">
    <Hero />
    <Highlights />
    <CareerStory />
    <SelectedWork />
    <Philosophy />
    <Personal />
    <Testimonials />
    <Contact />
  </main>
  <footer class="site-footer">
    <p>John <span class="text-gradient">Goodwin</span> - Cheshire, North West, UK</p>
  </footer>
</template>

<style scoped>
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 500;
  padding: var(--space-1) var(--space-2);
  background: var(--color-bg-alt);
  color: var(--color-ink);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  text-decoration: none;
}

.skip-link:focus {
  left: var(--space-1);
  top: var(--space-1);
}

main {
  padding-top: var(--nav-height);
}

.site-footer {
  padding: var(--space-4) var(--space-3);
  text-align: center;
  color: var(--color-ink-faint);
  font-size: var(--size-sm);
  border-top: 1px solid var(--color-border);
}
</style>
