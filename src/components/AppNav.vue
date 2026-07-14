<script setup lang="ts">
const links = [
  { href: '#story', label: 'Story' },
  { href: '#work', label: 'Work' },
  { href: '#philosophy', label: 'Philosophy' },
  { href: '#contact', label: 'Contact' },
]
</script>

<template>
  <header class="nav">
    <div class="nav-inner">
      <a href="#top" class="nav-name">John Goodwin</a>
      <nav class="nav-links">
        <a v-for="link in links" :key="link.href" :href="link.href">{{ link.label }}</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: color-mix(in srgb, var(--color-bg) 88%, transparent);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--color-border);
}

.nav-inner {
  max-width: var(--wide-width);
  margin: 0 auto;
  padding: var(--space-2) var(--space-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-name {
  font-family: var(--font-display);
  font-size: var(--size-lg);
  font-weight: 500;
  text-decoration: none;
  color: var(--color-ink);
}

.nav-links {
  display: flex;
  gap: var(--space-4);
}

.nav-links a {
  text-decoration: none;
  color: var(--color-ink-soft);
  font-size: var(--size-sm);
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--color-accent);
}

@media (max-width: 640px) {
  .nav-inner {
    padding: var(--space-2);
  }
  .nav-links {
    gap: var(--space-2);
  }
  .nav-name {
    font-size: var(--size-base);
  }
}
</style>
