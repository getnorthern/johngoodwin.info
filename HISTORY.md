# HISTORY.md

A working log of what's been built, fixed, tried-and-reverted, and deliberately left alone on johngoodwin.info — so a new session (or a future me) doesn't have to re-derive it from scratch. For conventions and how to work in this repo, see [CLAUDE.md](./CLAUDE.md); this file is the narrative/decision record behind it.

## Build & launch

Scaffolded as Vue 3 + Vite + TypeScript per the plan in the project's original planning session: single scrolling page, anchor nav, no router/state library/UI kit, plain CSS with design tokens. Content data (`profile.ts`, `highlights.ts`, `experience.ts`, `selectedWork.ts`, `philosophy.ts`, `personal.ts`, `testimonials.ts`) built out in `src/data/`, section components in `src/components/sections/`, and the site deployed to a fresh S3 bucket (`johngoodwin.info`) + CloudFront distribution (`EHJNEU66NWWC9`).

## Nav

- **Mobile "content visible above navbar" bug** — a real, hard-to-reproduce bug where page content flashed above the fixed nav while scrolling on mobile. Root cause: iOS Safari can report a fixed element's box as sitting at `top:0` while the browser's own chrome (address bar/tab bar) still occupies part of that space — confirmed via debug telemetry showing `innerHeight` vs `document.documentElement.clientHeight` differing by ~120px on the affected device. Fixed with `.nav-top-mask` in `AppNav.vue`: a permanent, never-hidden fill behind the nav (mobile-only) that keeps that overshoot region the same background colour at all times, including while the nav is slid away.
- **Burger + drawer nav** built with a focus trap (`trapFocus`), Escape-to-close, and focus returning to the burger button on close.
- **Drawer used `v-if`** originally, which caused a visible open-delay; switched to `v-show` so the drawer element always exists and just toggles visibility.
- Nav branding (`John Goodwin` wordmark / `JG` icon on mobile) alignment tuned; drawer opacity set to `0.9`.
- `#testimonials` added to the nav link list as **"Recommendations"**; the Testimonials section itself was retitled **"Colleague recommendations"** to match.
- **Nav hide-on-scroll**: `useNavVisibility` hides the header on scroll-down past the hero, shows it on scroll-up. See "Scroll progress bar" below for how this interacts with the progress bar.

## Scroll progress bar

Built from scratch this session — a 1px bar tracking scroll position, docked below the nav. Went through several iterations worth knowing about if it's touched again:

1. **First version**: a standalone `position: fixed` bar with its own `top` transition, independent of the nav. This caused a visible **gap** between the nav and the bar during the hide/show animation — because `top` (layout-triggering) and the nav's `transform` (compositor-driven) don't stay frame-synced even with identical duration/easing.
2. **Fix**: nested `ScrollProgress.vue` *inside* `AppNav.vue`'s `<header>`, absolutely positioned, so it rides the nav's own `transform` as a single painted unit — gap eliminated by construction, not by tuning.
3. **New problem**: nesting meant the bar disappeared off-screen along with the nav when hidden, since a `transform` on a parent moves 100% of its rendered subtree. Fixed by changing `.nav--hidden`'s transform from `translateY(-100%)` (moves the nav's full 264px box, including a 200px invisible iOS-overshoot buffer) to `translateY(calc(-1 * var(--nav-height)))` (moves only the visible 64px header). The 200px overshoot region is already independently covered by `.nav-top-mask` regardless of the nav's own hidden state, so this was safe — and it means the bar now lands pinned at `top: 0` instead of sliding fully away. (This was the user's own insight, not mine.)
4. **Mobile regression**: the shorter hide-transform distance meant the nav header content wasn't always fully cleared on real iOS Safari — the dynamic toolbar overshoot needs more margin than a static calculation provides. Fixed by fading `.nav-inner` via `opacity` on mobile when hidden, decoupling "content invisible" from "content off-screen by exactly N pixels."
5. **Height reduced 3px → 1px**: this broke the pinned-at-top positioning again. Root cause: the bar's `bottom` offset is relative to `.nav`'s *padding* box, which sits 1px above its *border* box because of `border-bottom: 1px solid`. At 3px tall, that 1px was absorbed harmlessly (2px still showed). At 1px tall, it consumed the entire bar, pushing it fully above the viewport when hidden. Fixed by using `bottom: -2px` (height + border width), not `bottom: -1px`.

Net result: `ScrollProgress.vue` nested in `AppNav.vue`, `useScrollProgress.ts` computing `scrollY / (scrollHeight - viewportHeight)` clamped 0–1, zero gap during the nav transition, pinned at the true top of the viewport when the nav is hidden.

## Content & copy

- "...which got me a foot in the door..." → "...which got me a determined foot in the door..." (`experience.ts`).
- Career story wording tweaked.
- Footer location updated; gradient text (`.text-gradient`) applied to "Goodwin" in the footer for consistency with the hero.
- Accent colour swapped from green to the gold-to-orange gradient (`--gradient-accent`) now used throughout.

## Animation

- Hero content now fades + slides up on page load via a CSS `@keyframes` animation on `.hero-inner` (`hero-in`), not the `useScrollReveal` IntersectionObserver composable — chosen because above-the-fold content shouldn't depend on an observer firing, which risks a flash of unstyled/hidden content. Slide distance increased from 16px to 64px per explicit request. Respects `prefers-reduced-motion`.
- A docked scroll-progress bar below the nav (see above).
- A constellation SVG background in the hero (`public/constellation.svg`), positioned via `.hero::before`, tuned repeatedly: coverage/size enlarged, opacity taken through `0.7` → `0.4`, hidden entirely on mobile (`display: none` in the `640px` breakpoint) since the shorter viewport made it visually cramped. The SVG artwork itself was swapped out several times directly by the user (re-uploaded raw files); a PNG-vs-SVG comparison was also tried locally, never deployed, then reverted — the PNG was deleted and is not part of the repo.
- **Animated constellation** — the static `::before` background was replaced with `ConstellationBackground.vue`, a canvas that redraws the same artwork each frame with nodes drifting on summed slow sine waves (lines stay attached because every frame strokes edges from the current node positions). Nodes also twinkle: at random intervals (every 3-15s, for 1.5-3s) each eases from its gradient-derived base opacity to fully opaque and back - dots are therefore filled per-node with the gradient computed in JS rather than a shared canvas gradient. The old `opacity: 0.4` on the layer was moved into the drawing itself (`BASE_OPACITY`) with the container at opacity 1, so twinkles ramp past the resting brightness to true full brightness instead of being capped at 0.4. Geometry (234 nodes, 396 edges, dashed flags, per-node radii, the two vertical gradients) was extracted from `constellation.svg` by a one-off parser script into `src/data/constellation.ts`; the SVG itself stays in `public/` as the source of truth but is no longer referenced by CSS. Same placement/opacity/mobile-hidden rules as the old `::before`. Animation pauses when the hero is off-screen (IntersectionObserver) or the tab is hidden, and renders a static frame under `prefers-reduced-motion`. Note for future verification: pages in the Claude Code browser pane report `visibilityState: "hidden"`, so `requestAnimationFrame` (and ResizeObserver/IntersectionObserver deliveries) never fire there — the animation can only be observed live in a real browser; in the pane it was verified by shimming rAF with timers and faking visibility.

## Performance

- **Responsive images**: every displayed photo (`austria.*`, `john-goodwin.*`) ships as `<picture>` with WebP + JPEG sources at `96w`/`192w`/`200w`/`400w`, generated locally via `sips -Z <px> -s formatOptions 68` (JPEG) and `cwebp -q 78` (WebP). The dog photo was also renamed from `john-goodwin-dog.*` to `austria.*` to match its actual filename expectations. Verified via a live PageSpeed Insights run showing zero oversized-image findings.
- **Deferred Google Analytics**: `gtag.js` (~488 KB decoded — the only third-party script this site loads) is kept off the critical path. The `dataLayer`/`gtag()` stub runs synchronously in `index.html` so no events are lost, but the actual script tag is injected on `window.load` + idle (or first scroll/keydown/click/touchstart), whichever comes first.
- **LCP discovery**: the hero photo `<img>` now has `fetchpriority="high"`, and `index.html` carries a matching `<link rel="preload" as="image">` with the same `imagesrcset`/`imagesizes`. This is a client-rendered SPA, so the `<img>` tag doesn't exist in the raw HTML until Vue mounts — the preload link makes the LCP image discoverable to the browser immediately from the initial document instead of waiting on JS execution.
- **Lighthouse findings investigated and deliberately left as-is** (both explicitly confirmed with the user — don't redo this investigation without new information):
  - *Network dependency tree / chained critical requests* (Unscored, 185ms): the chain is already flat — one hop to the JS bundle, one hop to the CSS bundle, both direct children of the document, nothing nested deeper. The only further lever is inlining the ~4 KB CSS into `<head>`, which Vite doesn't do automatically for the main stylesheet and would need a custom postbuild step. Given it's unscored, tiny, and only affects a visitor's very first cold load (CloudFront caches assets for a year after), left alone.
  - *Reduce unused JavaScript, ~701 KiB*: confirmed via direct fetch that this is entirely `gtag.js` (488 KB decoded, the only external script on the page — our own bundle is ~32 KB / ~11 KB gzipped). GA4's library bundles many features (consent mode, ecommerce, Ads linking, etc.) regardless of what a given property uses, so most of it is inherently "unused" on any page. It's already deferred off the critical path, so it doesn't hurt real load speed. The only way to actually remove this finding is swapping GA4 for a lighter analytics tool (e.g. Plausible, Fathom, Cloudflare Web Analytics) — a real tooling decision, not a code fix. Left as GA4 per the user's choice.

## Bugs fixed (real ones, not cosmetic)

- **Mobile horizontal overflow on Selected Work cards**: `.work-item`'s negative margin (`-24px`, from `--space-3`) didn't match the section's own responsive padding (`--space-2` = 16px on mobile), causing an 8px overflow past the viewport edge on every card. Fixed with a matching mobile-breakpoint override on `.work-item`'s margin. Diagnosed with a temporary `OverflowDebugOverlay.vue` component (scanned all elements for `getBoundingClientRect()` overflow past viewport edges) — built, used, then deleted once the real cause was found.
- **Oversized mobile image**: Lighthouse flagged the dog/Austria photo as larger than its displayed size; root cause was missing responsive `srcset` (see Performance above).

## Tried and reverted (don't redo without new evidence)

- **Scrollbar-gap fix**: added a `useScrollbarGap` composable + `--scrollbar-gap` CSS variable to fix an apparent "nav full-width but content has margin" issue. That issue turned out to only reproduce in desktop-style browser tooling with reserved scrollbars, not real mobile Safari. After deploying, a genuine *new* horizontal-scroll bug appeared on a real device. Fully reverted (composable deleted, all usages restored to `right: 0`, variable removed) rather than patched further, since it couldn't be reproduced/verified locally. The real bug was the Selected Work overflow above, unrelated to scrollbars.
- **PNG vs SVG hero background comparison**: tried locally only (never deployed, per explicit instruction), then reverted back to SVG and the PNG file deleted from the project entirely.

## Tooling: CLAUDE.md and `.claude/agents/`

Both were copied into this repo from the **Koda** project (a large multi-tenant freight SaaS with a Node/Express/Prisma backend) and then substantially rewritten — not just find-and-replaced — to fit this project's actual scale. Removed entirely: mandatory pre-commit review gates, TDD requirements, all backend/Prisma/multi-tenant content, and five agents with no applicable surface here (`api-reviewer`, `automation-tester`, `expert-pen-tester`, `tdd-helper`, `security-auditor` — no Express API, no test framework, no auth/multi-tenant data to pen-test). The remaining nine agents were rewritten around this site's actual stack and reframed as available-on-demand tools rather than mandatory gates, matching how this project has actually been run.

## Environment notes for future Claude Code sessions

Things learned about the tooling itself this session, worth knowing before re-diagnosing them as new bugs:

- **The Browser pane's CSS transitions don't reliably animate forward in time** in this environment — `getComputedStyle()`/`getBoundingClientRect()` reads taken mid-transition can return the frozen *start* value indefinitely, even after waiting far longer than the transition's duration. To get a reliable read of a transitioned property's end state, temporarily set `element.style.transition = 'none'` via `javascript_tool`, take the reading, then restore it. Don't conclude a CSS bug exists based on a transition-affected computed value alone — verify with the transition disabled first.
- **Screenshots occasionally come back blank/glitched** — usually resolved by taking another screenshot immediately after; not a real rendering issue.
- **Programmatic `window.scrollTo()` + `dispatchEvent(new Event('scroll'))`** doesn't always reliably trigger Vue's reactive scroll listeners in the same synchronous turn — add a short `setTimeout` wait afterward. Real `computer` scroll actions (drag/scroll gestures) work more reliably for exercising actual scroll-driven behaviour, though this tool has occasionally timed out on larger scroll gestures this session (the scroll itself typically still applies despite the timeout error — verify via a follow-up state check rather than assuming failure).
- `computer`'s `scroll_amount` parameter maxes out at 10 (use `repeat` for a bigger scroll).
- `.DS_Store` files periodically get swept into `public/`/`dist/` by macOS Finder and can end up in an `aws s3 sync` — clean up locally and from S3 (plus a targeted CloudFront invalidation) if this happens.

## Full commit log

```
721044c First commit
6d48604 Update John's hero profile photo
f18057e Further updates - nav, content, bug fixes, UI updates
f043874 Adjust nav branding alignment and update footer location
0cc2ed6 Fix mobile horizontal overflow on Selected Work cards
ddab1b9 Swap green accent for a gold-to-orange gradient
9c81cd9 Fix oversized mobile image and rename austria photo
1fbe1b6 Complete responsive image coverage, link testimonials, tidy CTA border
783281c Retitle testimonials section and add nav link
9cca82f Tweak career story wording
974048f Fade and slide in hero content on page load
35e5ed6 Increase hero entrance slide distance to 64px
88044d0 Apply gradient text to "Goodwin" in the footer
4223dfd Defer Google Analytics script loading
55bb08e Add responsive srcset to hero photo for consistency
7cd2000 Add constellation background to hero section
fc583ac Enlarge constellation background coverage
9f9ad14 Reduce constellation background opacity to 0.7
28e9f36 Update constellation.svg artwork
0c51ad1 Update constellation.svg artwork
7438035 Update constellation.svg artwork
d241085 Update constellation.svg artwork
150660f Reduce constellation background opacity to 0.4
8a982f1 Hide constellation background on mobile
2baca2a Add scroll progress bar below nav
f4e0ab0 Fade nav content out on mobile when hidden
cf546a5 Add CLAUDE.md and specialist agents for this project
f2edc3e Improve LCP discovery for hero photo
```
