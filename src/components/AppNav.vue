<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useNavVisibility } from '../composables/useNavVisibility'
import ScrollProgress from './ScrollProgress.vue'

const { hidden } = useNavVisibility()

const drawerOpen = ref(false)
const burgerRef = ref<HTMLButtonElement | null>(null)
const drawerCloseRef = ref<HTMLButtonElement | null>(null)

watch(drawerOpen, (open) => {
  if (open) nextTick(() => drawerCloseRef.value?.focus())
  else burgerRef.value?.focus()
})

function trapFocus(e: KeyboardEvent) {
  const drawer = document.getElementById('nav-drawer')
  if (!drawer) return
  const focusable = Array.from(
    drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

const links = [
  { href: '#story', label: 'Story' },
  { href: '#work', label: 'Work' },
  { href: '#philosophy', label: 'Philosophy' },
  { href: '#testimonials', label: 'Recommendations' },
  { href: '#contact', label: 'Contact' },
]

function handleNavClick(e: Event, anchor: string) {
  e.preventDefault()
  drawerOpen.value = false
  document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handleLogoClick(e: MouseEvent) {
  e.preventDefault()
  drawerOpen.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="nav-top-mask" aria-hidden="true"></div>
  <header class="nav" :class="{ 'nav--hidden': hidden }" role="banner">
    <div class="nav-inner">
      <button
        ref="burgerRef"
        class="nav-burger"
        :aria-expanded="drawerOpen"
        aria-controls="nav-drawer"
        aria-label="Open navigation menu"
        @click="drawerOpen = true"
      >
        <span class="burger-bar" />
        <span class="burger-bar" />
        <span class="burger-bar" />
      </button>
      <a href="#top" class="nav-name" aria-label="John Goodwin - back to top" @click="handleLogoClick">
        <img src="/favicon.svg" alt="" class="nav-name-icon" width="32" height="32" />
        <span class="nav-name-text">John <span class="text-gradient">Goodwin</span></span>
      </a>
    </div>
    <ScrollProgress />
  </header>

  <Transition name="backdrop">
    <div
      v-show="drawerOpen"
      class="nav-drawer__backdrop"
      aria-hidden="true"
      @click="drawerOpen = false"
    />
  </Transition>

  <Transition name="drawer">
    <div
      v-show="drawerOpen"
      id="nav-drawer"
      class="nav-drawer"
      role="dialog"
      aria-label="Navigation menu"
      aria-modal="true"
      @keydown.esc="drawerOpen = false"
      @keydown.tab="trapFocus"
    >
      <div class="nav-drawer__header">
        <span class="nav-drawer__title">Menu</span>
        <button
          ref="drawerCloseRef"
          class="nav-drawer__close"
          aria-label="Close menu"
          @click="drawerOpen = false"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <hr class="nav-drawer__divider" />
      <nav class="nav-drawer__nav" aria-label="Site navigation">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="nav-drawer__link"
          @click="handleNavClick($event, link.href)"
        >
          <span class="nav-drawer__link-text">{{ link.label }}</span>
        </a>
      </nav>
    </div>
  </Transition>
</template>

<style scoped>
/* Ensure consistent box model regardless of ancestor resets. */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/*
 * iOS Safari can report a fixed element's box as sitting at top:0 while the
 * browser's own chrome (address bar / tab bar) is still occupying part of
 * that space, painting a band of ordinary page content above where the nav
 * visually starts - confirmed via debug telemetry (innerHeight vs.
 * document.documentElement.clientHeight differed by ~120px on the affected
 * device). This mask is a permanent, never-hidden fill behind the nav that
 * keeps that gap the same colour at all times, including while the nav
 * itself is slid away. It only ever covers the overshoot zone above the
 * true top of the screen (top:-200 to bottom:0) - it must never reach down
 * into real content, in either the shown or hidden state, or it clips
 * whatever's rendered just below it. Mobile-only: desktop doesn't have this
 * problem.
 */
.nav-top-mask {
  display: none;
}

@media (max-width: 640px) {
  .nav-top-mask {
    display: block;
    position: fixed;
    top: calc(-1 * var(--nav-overshoot));
    left: 0;
    right: 0;
    height: var(--nav-overshoot);
    z-index: 150;
    background: var(--color-bg);
    pointer-events: none;
  }
}

.nav {
  position: fixed;
  top: calc(-1 * var(--nav-overshoot));
  left: 0;
  right: 0;
  height: calc(var(--nav-overshoot) + var(--nav-height));
  z-index: 200;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  transform: translateY(0);
  transition: transform var(--nav-transition-duration) cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: visible;
}

.nav--hidden {
  transform: translateY(calc(-1 * var(--nav-height)));
}

.nav-inner {
  max-width: var(--wide-width);
  margin: 0 auto;
  padding: 0 var(--space-3);
  height: var(--nav-height);
  flex-shrink: 0;
  width: 100%;
  display: flex;
  align-items: center;
}

.nav-burger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius);
  transition: background 0.2s ease;
}

.nav-burger:hover {
  background: color-mix(in srgb, var(--color-ink) 10%, transparent);
}

.burger-bar {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-ink);
  border-radius: 2px;
}

.nav-name {
  display: flex;
  align-items: center;
  margin-left: auto;
  text-decoration: none;
  color: var(--color-ink);
}

.nav-name-icon {
  display: none;
}

.nav-name-text {
  font-family: var(--font-display);
  font-size: var(--size-lg);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  transform: translateY(3px);
}

@media (max-width: 640px) {
  .nav-name-icon {
    display: block;
    width: 50px;
    height: 50px;
    margin-left: auto;
  }

  .nav-name-text {
    display: none;
  }

  /*
   * The hide transform only travels -100dvh worth of nav-height, which
   * isn't always enough to fully clear iOS Safari's dynamic toolbar
   * overshoot (see the .nav-top-mask comment above). Fading the content
   * out guarantees it's invisible regardless of where the transform
   * actually lands, without touching the transform distance the
   * progress bar relies on to land at top:0.
   */
  .nav-inner {
    transition: opacity var(--nav-transition-duration) ease;
  }

  .nav--hidden .nav-inner {
    opacity: 0;
  }
}

/* ─── Drawer ─────────────────────────────────────────────────────────────── */
/* Same top overshoot as .nav - see comment above it. */
.nav-drawer__backdrop {
  position: fixed;
  top: calc(-1 * var(--nav-overshoot));
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 300;
  background: color-mix(in srgb, black 55%, transparent);
}

.nav-drawer {
  position: fixed;
  top: calc(-1 * var(--nav-overshoot));
  left: 0;
  bottom: 0;
  z-index: 400;
  width: 280px;
  max-width: 80vw;
  padding-top: var(--nav-overshoot);
  background: var(--color-bg-alt);
  border-right: 1px solid var(--color-border);
  opacity: 0.95;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.nav-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-3);
  height: var(--nav-height);
  flex-shrink: 0;
}

.nav-drawer__title {
  font-family: var(--font-display);
  font-size: var(--size-base);
  font-weight: 500;
  color: var(--color-ink);
}

.nav-drawer__close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-ink-soft);
  font-size: 1.4rem;
  line-height: 1;
  padding: 6px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.nav-drawer__close:hover {
  color: var(--color-ink);
  background: color-mix(in srgb, var(--color-ink) 10%, transparent);
}

.nav-drawer__divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 0;
}

.nav-drawer__nav {
  display: flex;
  flex-direction: column;
  padding: var(--space-2);
}

.nav-drawer__link {
  position: relative;
  text-decoration: none;
  color: var(--color-ink-soft);
  font-size: var(--size-base);
  font-weight: 500;
  padding: var(--space-2);
  border-radius: var(--radius);
  transition: background 0.18s ease;
}

.nav-drawer__link:hover {
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.nav-drawer__link::after {
  content: '→';
  position: absolute;
  top: 50%;
  right: 100px;
  transform: translateY(-50%);
  opacity: 0;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  pointer-events: none;
  transition: right 0.3s ease, opacity 0.3s ease;
}

.nav-drawer__link:hover::after {
  right: 10px;
  opacity: 1;
}

/*
 * The gradient lives on an inner span so it can coexist with the pill tint
 * above (background-clip: text clips every background layer on its own
 * element). Deliberately not transitioned: animating colour to transparent
 * while the gradient background snaps off makes the text flash on mouse-out.
 */
.nav-drawer__link:hover .nav-drawer__link-text {
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ─── Transitions ────────────────────────────────────────────────────────── */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.25s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}

@media (prefers-reduced-motion: reduce) {
  .nav,
  .nav-inner,
  .backdrop-enter-active,
  .backdrop-leave-active,
  .drawer-enter-active,
  .drawer-leave-active,
  .nav-drawer__link::after {
    transition: none;
  }
}
</style>
