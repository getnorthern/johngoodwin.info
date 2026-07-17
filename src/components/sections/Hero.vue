<script setup lang="ts">
import { getYearsInSoftware } from '../../data/profile'

const yearsInSoftware = getYearsInSoftware()
</script>

<template>
  <section id="top" class="hero">
    <div class="hero-inner section-inner section-inner--narrow">
      <p class="eyebrow">Engineering leadership</p>
      <h1 class="hero-title">John <span class="text-gradient">Goodwin</span></h1>
      <p class="hero-role">Head of Engineering, CAVU (Manchester Airports Group)</p>
      <div class="hero-intro">
        <picture class="hero-photo-wrap">
          <source
            type="image/webp"
            srcset="/john-goodwin-96.webp 96w, /john-goodwin-192.webp 192w, /john-goodwin-200.webp 200w, /john-goodwin.webp 400w"
            sizes="(max-width: 640px) 96px, 200px"
          />
          <img
            src="/john-goodwin.jpg"
            srcset="/john-goodwin-96.jpg 96w, /john-goodwin-192.jpg 192w, /john-goodwin-200.jpg 200w, /john-goodwin.jpg 400w"
            sizes="(max-width: 640px) 96px, 200px"
            alt="John Goodwin"
            class="hero-photo"
            width="200"
            height="200"
            fetchpriority="high"
          />
        </picture>
        <p class="hero-tagline">
          {{ yearsInSoftware }} years in software, the last three spent turning a small engineering
          team into one that can carry real weight - 120 people, sixteen squads, systems that can't
          afford to go down. I lead with trust over process, and I care as much about the leaders I
          grow as the platforms we ship.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: var(--space-8) var(--space-3) var(--space-7);
  background:
    radial-gradient(ellipse 900px 520px at 50% -8%, color-mix(in srgb, var(--color-accent) 5%, transparent), transparent 70%),
    var(--color-bg);
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -50%;
  transform: translateX(-50%);
  width: 100%;
  height: 200%;
  background-image: url('/constellation.svg');
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: 100% auto;
  opacity: 0.4;
  pointer-events: none;
  z-index: 0;
}

.hero-inner {
  position: relative;
  z-index: 1;
}

.hero-inner {
  animation: hero-in 0.7s ease both;
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(64px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-inner {
    animation: none;
  }
}

.hero-title {
  font-size: var(--size-3xl);
  margin-bottom: var(--space-2);
}

.hero-role {
  font-size: var(--size-lg);
  color: var(--color-ink-soft);
  margin-bottom: var(--space-4);
}

.hero-intro {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}

.hero-tagline {
  font-size: var(--size-lg);
  max-width: 34rem;
  line-height: var(--leading-snug);
  flex: 1;
  order: 1;
}

.hero-photo-wrap {
  flex-shrink: 0;
  order: 2;
}

.hero-photo {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .hero {
    padding-top: var(--space-6);
  }

  .hero::before {
    display: none;
  }

  .hero-intro {
    display: block;
  }

  .hero-photo-wrap {
    float: left;
    margin: 0 var(--space-3) var(--space-2) 0;
    shape-outside: circle(50%);
  }

  .hero-photo {
    width: 96px;
    height: 96px;
  }
}
</style>
