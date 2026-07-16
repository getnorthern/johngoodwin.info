<script setup lang="ts">
import { personalParagraphs } from '../../data/personal'
import { useScrollReveal } from '../../composables/useScrollReveal'

useScrollReveal()
</script>

<template>
  <section id="personal" class="section personal-section">
    <svg class="personal-mountains" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true">
      <path
        class="range range-back"
        d="M0,300 L0,190 L140,100 L260,165 L400,70 L560,155 L700,90 L850,170 L1000,80 L1200,165 L1200,300 Z"
      />
      <path
        class="range range-front"
        d="M0,300 L0,230 L110,165 L230,215 L360,135 L510,205 L660,145 L810,210 L960,150 L1110,205 L1200,170 L1200,300 Z"
      />
    </svg>
    <div class="section-inner" ref="reveal">
      <p class="eyebrow">Off the clock</p>
      <div class="personal-intro">
        <figure class="personal-photo">
          <picture>
            <source
              type="image/webp"
              srcset="/austria-96.webp 96w, /austria-192.webp 192w, /austria-200.webp 200w, /austria.webp 400w"
              sizes="(max-width: 780px) 96px, 200px"
            />
            <img
              src="/austria.jpg"
              srcset="/austria-96.jpg 96w, /austria-192.jpg 192w, /austria-200.jpg 200w, /austria.jpg 400w"
              sizes="(max-width: 780px) 96px, 200px"
              alt="John skiing with his family in Austria"
              width="200"
              height="200"
            />
          </picture>
        </figure>
        <div class="personal-copy">
          <p v-for="(para, i) in personalParagraphs" :key="i" class="personal-para">{{ para }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.personal-section {
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse 700px 500px at 100% 40%, color-mix(in srgb, var(--color-bg-alt) 70%, transparent), transparent 65%);
}

.personal-mountains {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 296px;
  pointer-events: none;
}

.personal-mountains .range {
  fill: var(--color-border);
}

.personal-mountains .range-back {
  opacity: 0.35;
}

.personal-mountains .range-front {
  opacity: 0.55;
}

.personal-section > .section-inner {
  position: relative;
  z-index: 1;
}

.personal-intro {
  display: flex;
  align-items: flex-start;
  gap: var(--space-6);
}

.personal-copy {
  flex: 1;
  order: 1;
}

.personal-para {
  font-size: var(--size-base);
  line-height: var(--leading-snug);
  margin-bottom: var(--space-3);
}

.personal-para:last-child {
  margin-bottom: 0;
}

.personal-photo {
  margin: 0;
  flex-shrink: 0;
  order: 2;
}

.personal-photo img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 1px solid var(--color-border);
}

@media (max-width: 780px) {
  .personal-intro {
    display: block;
  }

  .personal-photo {
    float: left;
    margin: 0 var(--space-3) var(--space-2) 0;
    shape-outside: circle(50%);
  }

  .personal-photo img {
    width: 96px;
    height: 96px;
  }

  .personal-mountains {
    height: 90px;
  }
}
</style>
