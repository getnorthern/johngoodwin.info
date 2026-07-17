# CLAUDE.md

Project context and conventions for Claude Code.

## General Behaviour

- **Work directly on `main`** — do not create branches or worktrees. This is a solo project; branching adds no value. Always commit and deploy from `main`.
- **Every change gets committed, pushed, and deployed** — the deployed site should always match what's on GitHub, and GitHub should always match the working tree. Don't leave changes uncommitted or committed-but-undeployed unless explicitly asked to hold off.
- **Verify visually before calling something done** — for anything observable in the browser, check it in the dev server (or the live site after deploy). `npm run build` succeeding proves the code compiles, not that the feature works.
- Be as concise as possible with responses.
- **Punctuation:** use `-` (hyphen) not `—` (em dash) in user-facing copy.
- Be certain of a task before beginning it.
- There is no test suite in this project (see **Testing** below) — do not assume TDD or existing test coverage.

## Frontend Development

- **Composition API + `<script setup lang="ts">`** for every component — no Options API.
- **Component filenames:** PascalCase (e.g. `SelectedWork.vue`). Section components live in `src/components/sections/`; shared/layout components live in `src/components/`.
- **Composable naming:** camelCase, `use`-prefixed, in `src/composables/` (e.g. `useScrollProgress.ts`).
- **Data files:** camelCase in `src/data/*.ts` (e.g. `experience.ts`, `selectedWork.ts`) — content lives here, separate from the components that render it, so copy can be edited without touching Vue/CSS.
- **Prop casing:** camelCase in `<script>`, kebab-case in templates. Type props with `defineProps<{ ... }>()`.
- **`<style scoped>`** for all component styles. Shared values (colour, spacing, type scale, breakpoints, the `640px` mobile cutoff, the nav's `0.35s` transition duration) live as custom properties in `src/styles/tokens.css` — reuse them rather than hardcoding new values.
- **Reuse existing composables** for scroll/animation behaviour (`useScrollReveal`, `useNavVisibility`, `useScrollProgress`) rather than duplicating listener logic in a component.
- **Small and focused components** — split a section component if it grows past ~150 lines with genuinely separate responsibilities. Don't pre-split or add prop-driven configurability a static one-page site doesn't need.
- **`prefers-reduced-motion: reduce`** must disable any new non-essential CSS animation, matching the existing pattern in `tokens.css` and `Hero.vue`.

## Git & Workflow

- **Commit messages:** short, imperative, plain sentence describing what changed (e.g. `Add scroll progress bar below nav`, `Fade nav content out on mobile when hidden`) — no Conventional Commits prefix. End with the `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` trailer.
- **No branches, no PRs** — commit and push straight to `main`.
- **Stage specific files**, not `git add -A`, so unrelated in-progress work never gets swept into a commit.

## Agents

Agents live in `.claude/agents/`. This is a small static site, not a project with compliance gates — none of these are mandatory before every commit. Invoke the relevant one when the change actually touches that concern.

| Agent                    | When to invoke                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| `vue-component-auditor`  | After creating or modifying a `.vue` file. Checks Composition API usage, naming, prop casing, content/presentation separation. |
| `accessibility-checker`  | After UI changes. Audits semantic HTML, ARIA, keyboard navigation, and colour contrast against WCAG 2.1 AA. |
| `code-reviewer`          | After a non-trivial change. Checks TypeScript correctness, naming, and reuse of existing patterns.        |
| `expert-architecture`    | When adding new components/composables or considering a refactor. Reviews structural boundaries.          |
| `expert-code-quality`    | Periodically, or before a larger commit. Reviews TypeScript strictness, dead code, and duplication.        |
| `expert-performance`     | After adding images or third-party scripts, or before a Lighthouse pass. Reviews image sizing, bundle size, script loading. |
| `expert-security`        | Periodically. Checks for secrets in source, unsafe external links, and dependency vulnerabilities.         |
| `docs-writer`            | If a composable's behaviour is genuinely non-obvious and undocumented.                                     |
| `lint-runner`            | Before committing, to confirm `npm run build` (the only automated check) passes.                            |

## Performance

- **Images are the main lever.** Every displayed image should have a responsive `<picture>`/`srcset`/`sizes` set (see `Hero.vue`/`Personal.vue` for the pattern: `96w`/`192w`/`200w`/`400w` WebP + JPEG). Generate via `sips -Z <px> -s formatOptions 68` (JPEG) and `cwebp -q 78` (WebP).
- Below-the-fold images use `loading="lazy"`; the hero photo (above the fold) does not.
- Keep Google Analytics (`gtag.js`) off the critical initial-load path — it's deferred until `window.load`/idle/first-interaction in `index.html`. Don't revert this to a plain blocking `<script src>`.
- **Core Web Vitals targets:** LCP < 2.5s, CLS < 0.1. Run Lighthouse/PageSpeed Insights after meaningful visual or asset changes.
- Animate `transform`/`opacity`, not `top`/`left`/`width`/`height` — matches the pattern used for the nav hide/show and hero entrance.

## Accessibility

- Target WCAG 2.1 Level AA.
- Prefer semantic HTML (`<nav>`, `<main>`, `<section>`, `<button>`) over generic `<div>`/`<span>`.
- All interactive elements (nav links, burger menu, drawer) must be keyboard-operable with a logical focus order.
- External links (`target="_blank"`) include `rel="noopener"`.
- Check colour contrast for body copy against `--color-bg` — `--color-ink-soft` and `--color-ink-faint` are intentionally muted and the most likely to fail 4.5:1.

## Security

- No secrets, API keys, or credentials in source — this site has none currently; AWS deploys use the local CLI profile, never embedded keys.
- No `v-html` with anything other than fully static, repo-authored content.
- Run `npm audit` periodically and address high/critical findings.
- This site has no backend, auth, or user data — most SaaS-style security concerns (multi-tenancy, injection, session handling) simply don't apply here. Don't add defensive code for scenarios that can't occur.

## Naming & File Conventions

- **Vue components:** PascalCase filenames.
- **Composables & data files:** camelCase filenames (`useScrollProgress.ts`, `selectedWork.ts`) — this project does not use kebab-case for TS files.
- **Types & interfaces:** PascalCase.

## Dependency Management

- This project deliberately has almost no dependencies (Vue + Vite + TypeScript tooling only) — no router, no state management library, no UI kit, no HTTP client. Don't add one without a specific, concrete need.
- Before adding any package, check bundle size impact and whether Vue/plain CSS already covers the need.
- Run `npm audit` periodically.

## Testing

- There is currently no test suite, test framework, or TDD workflow in this project.
- The only automated check is `npm run build` (`vue-tsc -b && vite build`), which type-checks and builds.
- If test coverage is ever wanted, discuss the approach with the user first rather than introducing a framework unprompted.

## Documentation

- Don't add JSDoc/comments reflexively. Comments explain *why*, not *what* — only add one when there's a non-obvious constraint, workaround, or intent that the code itself doesn't convey.
- Vue SFCs and `src/data/*.ts` content exports don't need doc blocks — they're self-explanatory.
- A composable with genuinely non-obvious behaviour (e.g. `useNavVisibility`'s hero-relative hide threshold) can carry a short doc comment.

## Project Overview

**johngoodwin.info** — John Goodwin's personal portfolio/CV site. Single-page, anchor-navigated, positioning him for Director-of-Engineering-level roles: leadership philosophy, career story, selected work, and testimonials, backed by his actual CV facts.

No backend, no router (single page, in-page anchor navigation only), no CMS — all content lives in `src/data/*.ts` and is edited directly in the repo.

## Tech Stack

- **Frontend:** Vue 3 + Vite + TypeScript, `<script setup>` throughout
- **Styling:** Plain CSS with custom-property design tokens (`src/styles/tokens.css`) — no Tailwind or CSS framework
- **Fonts:** Newsreader (display/serif) + Inter (body), loaded via Google Fonts with a non-blocking preload pattern
- **State:** None — no Pinia/Vuex; component-local `ref`/`computed` and composables are sufficient at this scale
- **Hosting:** AWS S3 (static website) + CloudFront (CDN/HTTPS)
- **Analytics:** Google Analytics (`gtag.js`), deferred off the critical path

## Project Structure

```
/
├── CLAUDE.md
├── index.html               # Google Fonts preload, deferred gtag.js loader
├── package.json
├── vite.config.ts
├── .claude/
│   └── agents/               # Specialist agents (see Agents section above)
├── public/                   # Static assets served as-is (images, favicon, CV PDF, constellation.svg)
├── reference/                 # Source CVs — gitignored, not part of the public site
└── src/
    ├── App.vue                # Composes AppNav + all sections + footer
    ├── main.ts
    ├── components/
    │   ├── AppNav.vue          # Fixed header: burger + drawer nav, hosts ScrollProgress
    │   ├── ScrollProgress.vue  # Scroll-position progress bar, nested inside AppNav's header
    │   └── sections/           # One component per page section
    │       ├── Hero.vue
    │       ├── Highlights.vue
    │       ├── CareerStory.vue
    │       ├── SelectedWork.vue
    │       ├── Philosophy.vue
    │       ├── Personal.vue
    │       ├── Testimonials.vue
    │       └── Contact.vue
    ├── composables/
    │   ├── useScrollReveal.ts   # IntersectionObserver fade/slide-in on scroll
    │   ├── useNavVisibility.ts  # Hide nav on scroll-down past hero, show on scroll-up
    │   └── useScrollProgress.ts # scrollY / (scrollHeight - viewportHeight), clamped 0–1
    ├── data/                    # Content, separate from the components that render it
    │   ├── profile.ts
    │   ├── highlights.ts
    │   ├── experience.ts
    │   ├── selectedWork.ts
    │   ├── philosophy.ts
    │   ├── personal.ts
    │   └── testimonials.ts
    └── styles/
        └── tokens.css           # Colour, type, spacing, layout custom properties
```

## Common Commands

```bash
npm install
npm run dev          # dev server (Vite)
npm run build         # vue-tsc type-check + production build
npm run preview       # preview the production build locally
```

## Deploy

> **Always commit and push to GitHub before deploying.** The deployed state should always be traceable in git history.

```bash
# 1. Build
npm run build

# 2. Clean stray macOS files that sometimes end up in dist/
find dist -name ".DS_Store" -delete

# 3. Sync hashed/static assets with a 1-year immutable cache
#    (--exclude index.html since it needs different cache semantics)
aws s3 sync dist/ s3://johngoodwin.info --delete --exclude "index.html" \
  --cache-control "public, max-age=31536000, immutable"

# 4. Upload index.html separately with must-revalidate so updates are picked up immediately
aws s3 cp dist/index.html s3://johngoodwin.info/index.html \
  --cache-control "public, max-age=0, must-revalidate"

# 5. Invalidate CloudFront so the CDN doesn't serve stale content
aws cloudfront create-invalidation --distribution-id EHJNEU66NWWC9 --paths "/*"
```

S3 bucket: `johngoodwin.info` | CloudFront distribution: `EHJNEU66NWWC9`

## Architectural Decisions

These decisions were made deliberately. Don't revisit without a clear reason — consistency and simplicity matter more here than following "how a bigger app would do it."

### No router, no state library, no UI kit

Single scrolling page with anchor navigation — a router adds nothing. No Pinia/Vuex — component-local state and a handful of composables cover everything this site needs. No Vuetify/UI framework — hand-written CSS keeps the editorial, non-templated visual style the site is going for.

### Plain CSS with design tokens, not Tailwind

Utility classes tend to produce the same visual rhythm as every other site built with them; hand-written CSS scoped per component, backed by shared tokens in `tokens.css`, fits the "written by a person" brief better.

### No contact form / no backend

A `mailto:` link, a LinkedIn link, and a CV download are enough. Adding form handling would need a backend or third-party service that isn't justified for a CV site.

### Nav hide-on-scroll + docked progress bar

`AppNav.vue`'s header hides on scroll-down (past the hero) and reappears on scroll-up, via `useNavVisibility`. `ScrollProgress.vue` is nested *inside* the nav's header element (not a sibling) specifically so it rides the nav's own `transform` — two independently-animated elements (one via `transform`, one via `top`) drift out of sync frame-to-frame even with matching duration/easing, which was visible as a gap during the hide/show transition. Nesting eliminates that by construction. The hide-transform distance is `translateY(calc(-1 * var(--nav-height)))` (not `-100%` of the full box) so the bar lands pinned at `top: 0` once the nav is fully hidden, rather than sliding away with it. On mobile, `.nav-inner` additionally fades via `opacity` when hidden, because the transform's shorter travel distance isn't always enough to clear iOS Safari's dynamic toolbar overshoot.

### Responsive images

Every displayed photo ships as a `<picture>` with WebP + JPEG sources at `96w`/`192w`/`200w`/`400w`, generated locally via `sips`/`cwebp` — not an image CDN or build-time transform pipeline, since the image set is small and changes infrequently.

### Deferred Google Analytics

`dataLayer`/`gtag()` stub is set up synchronously (no lost events), but the actual `gtag.js` script loads on `window.load` + idle (or first user interaction), keeping it off the critical initial-load path that Lighthouse measures.

## Notes

- This project has no environment variables — it's fully static.
- `.DS_Store` files occasionally get swept into `public/`/`dist/` by macOS Finder; clean them up (locally and from S3) before/after a deploy if `aws s3 sync` picks one up.
