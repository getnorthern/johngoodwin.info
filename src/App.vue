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
  <AppNav />
  <main>
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
    <p>John Goodwin - Congleton, Cheshire</p>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: var(--space-4) var(--space-3);
  text-align: center;
  color: var(--color-ink-faint);
  font-size: var(--size-sm);
  border-top: 1px solid var(--color-border);
}
</style>
