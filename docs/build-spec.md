# Portfolio — build spec v1

Technical companion to `portfolio-spec-v2.md`. That one decides *what the site says*; this decides *what gets built*. Written to be executed against by agents and verified by you.

**Rule for this document:** every milestone has acceptance criteria that are checkable without judgement. If a criterion needs an opinion to evaluate, it's written wrong — rewrite it.

---

## 1. Scope

### In scope — v1

| Route | Purpose |
|---|---|
| `/` | Hero, three doors, featured work, trust strip, contact |
| `/work/` | Project archive, filterable by domain tag |
| `/work/[slug]/` | Case study pages |
| `/products/` | Live products, honest status |
| `/services/` | What engaging me means, one CTA |
| `/writing/` | Post index |
| `/writing/[slug]/` | Post pages |
| `/404` | Custom |

Content at launch: **3 case studies** (Moderna, Veritas, QIntern), **1 product** (Quantum Arcade), **1 post**, **2 domain tags** (ml, quantum).

### Explicitly out of scope — v1

Dark mode. Search. Comments. Newsletter signup. CMS. Analytics. i18n. Blog pagination. RSS *(add at v1.1, cheap)*. Contact form backend — v1 uses a `mailto:` link.

Out of scope means **not built, not stubbed, not designed around**. Adding any of these later is easy; carrying dead abstractions for them is not.

### Non-goals

- Not a design showcase. Restraint is the aesthetic.
- Not a CMS. Content is markdown in the repo, edited in an editor.
- Not a SPA. Every route is a static HTML file.

---

## 2. Architecture

### Stack

```
Astro 5              static output, zero JS by default
TypeScript strict    content schemas are typed
Plain CSS            custom properties, no framework, no preprocessor
@astrojs/sitemap     the only integration at launch
```

**No** Tailwind, no React, no CSS-in-JS, no animation library, no icon library, no UI kit. Every dependency added after this needs a written reason in the PR.

### File structure

```
src/
  components/
    Layout/
      Header.astro
      Footer.astro
      TrustStrip.astro
    ProjectCard.astro
    EvidenceMeasure.astro      the status bar + stamp
    StatusStamp.astro
    ArcDiagram.astro           hero visual, generative from array
    DomainFilter.astro
    ProseBlock.astro
  layouts/
    Base.astro                 html shell, meta, fonts
    Page.astro                 Base + header/footer + main
    CaseStudy.astro            Page + case-study chrome
  pages/
    index.astro
    work/
      index.astro
      [...slug].astro
    products/index.astro
    services/index.astro
    writing/
      index.astro
      [...slug].astro
    404.astro
  content/
    config.ts                  collection schemas
    projects/*.md
    writing/*.md
  data/
    products.ts                too few for a collection
    trust.ts                   credentials, single source
  styles/
    tokens.css                 every design value, defined once
    global.css                 element defaults, layout primitives
    motion.css                 keyframes + reduced-motion guard
public/
  fonts/                       self-hosted woff2
  og/                          generated social images
```

### Rendering rules

- `output: 'static'`. No SSR, no adapters.
- Zero client JS on `/`, `/work/`, `/services/`, `/writing/`.
- Islands permitted only on case study pages, only with `client:visible`, only with a comment stating why.
- Every island must render meaningful static content before hydration. No empty divs waiting for JS.

---

## 3. Content model

`src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tagline: z.string().max(120),
    status: z.enum(['verified', 'in-progress', 'metrics-pending', 'reference']),
    domain: z.enum(['ml', 'quantum', 'edge']),
    year: z.string(),
    org: z.string().optional(),
    evidence: z.string(),
    evidenceLevel: z.number().min(0).max(1),
    links: z.object({
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      model: z.string().url().optional(),
      report: z.string().url().optional(),
    }).default({}),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    date: z.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
```

### The `evidence` / `evidenceLevel` contract

`evidence` is a plain-language statement of what can be checked. `evidenceLevel` drives the visual measure length. They must agree — a `1.0` with vague evidence text is a lie in the design system.

| Status | Level | `evidence` reads like |
|---|---|---|
| `verified` | 0.85–1.0 | "35/35 runs, gap = 0.000" |
| `metrics-pending` | 0.2–0.4 | "in-dataset only, no transfer test" |
| `in-progress` | 0.0–0.15 | "nothing to check yet" |
| `reference` | n/a — renders as a dash | "not applicable by design" |

**Hard rule:** no project ships with `evidenceLevel` above `0.5` unless a public artifact backs it. This is enforced by review, not code.

---

## 4. Design tokens

`src/styles/tokens.css`. Values extracted from the Claude Design exploration.

```css
:root {
  /* Ground — cool, dry bone. Not the warm paper. */
  --page:        #e8e5db;
  --surface:     #efece2;
  --surface-alt: #ddd8ca;

  /* Ink and structure */
  --ink:         #16211d;
  --ink-2:       #47504b;
  --ink-3:       #6f6a5f;
  --ink-4:       #8b877c;
  --line:        #d9d3c4;
  --line-strong: #cfc9ba;
  --line-faint:  #b9b3a4;

  /* The triad — spent ONLY on evidence */
  --verified:      #3f7d55;
  --verified-deep: #2f6741;
  --untested:      #9a958a;
  --missed:        #b5432f;
  --missed-deep:   #97371f;

  /* Type */
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body:    'IBM Plex Sans', system-ui, sans-serif;
  --font-mono:    'IBM Plex Mono', ui-monospace, monospace;

  --step--1: 0.833rem;
  --step-0:  1rem;
  --step-1:  1.2rem;
  --step-2:  1.6rem;
  --step-3:  2.2rem;
  --step-4:  3rem;
  --step-5:  clamp(2.6rem, 6vw, 4.2rem);

  --label: 0.6875rem;   /* 11px mono, uppercase, 0.16em tracking */

  /* Space — 4px base */
  --s-1: 0.25rem;  --s-2: 0.5rem;   --s-3: 0.75rem;
  --s-4: 1rem;     --s-6: 1.5rem;   --s-8: 2rem;
  --s-12: 3rem;    --s-16: 4rem;    --s-24: 6rem;

  /* Layout */
  --measure: 68ch;
  --width:   1120px;
  --width-prose: 720px;
  --gutter: clamp(1.25rem, 5vw, 3rem);

  /* Motion */
  --dur-fast: 180ms;
  --dur-base: 400ms;
  --dur-draw: 900ms;
  --ease:     cubic-bezier(.22,.61,.36,1);
}
```

### Colour law

1. The triad appears **only** on evidence indicators. Never on links, buttons, headings, borders, or backgrounds.
2. Everything structural is `--ink` or a `--line`.
3. There is no brand accent colour. If a link needs emphasis, it gets an underline, not a hue.

This is the whole visual idea. Violating it once dilutes it everywhere.

### Type law

- `--font-display` — page titles and the hero only. Never below `--step-2`.
- `--font-body` — all prose. `line-height: 1.65`, max `--measure`.
- `--font-mono` — labels, evidence strings, metadata, statuses. Always `--label` size, uppercase, `0.16em` tracking, `--ink-4`.

Three fonts, three jobs, no overlap.

---

## 5. Layout system

### Grid

One 12-column grid at `--width`, `--gutter` outside. Most content occupies columns 1–8 (prose) or full width (cards, hero). No nested grids.

### The margin column

Case studies use an asymmetric layout: prose in columns 1–8, a persistent margin column in 10–12 holding metadata, evidence, and links. On viewports below 900px the margin column collapses to a block above the prose. This is the layout signature — it reads as an annotated document.

### Breakpoints

```
default        mobile-first, single column
≥ 600px        two-column cards
≥ 900px        margin column appears, three-column cards
≥ 1200px       max width reached, gutters grow
```

Four breakpoints. Adding a fifth needs a reason.

### Vertical rhythm

Section spacing is `--s-24` desktop, `--s-16` mobile. Within a section, `--s-8` between blocks, `--s-4` between related elements. Nothing else.

---

## 6. Motion system

### The rule

**Motion demonstrates or it doesn't ship.** Every animation must convey information that would otherwise need a sentence. Decorative motion is out — it's the visual form of overclaiming, which contradicts the entire positioning.

### Tier 1 — baseline, CSS only

| Effect | Demonstrates |
|---|---|
| Hero arcs draw in sequence: ink → grey → rust | Verified first, untested next, failures last. The order is the argument. |
| Evidence measures fill on scroll into view | Bar length = evidence quantity. Short bars are visibly short. |
| Card hover raises the evidence line | Rewards inspection |
| Status stamp draws its outline on entry | Marks the claim as stamped, not styled |

No library. `stroke-dasharray` transitions and `IntersectionObserver` for scroll triggers. Total JS budget for Tier 1: **under 2KB**.

### Tier 2 — one interactive island per case study, maximum

| Page | Island | Demonstrates |
|---|---|---|
| Moderna | Noise-run grid, scrubbable by shot count | 35/35 recovery across noise conditions, felt rather than read |
| Veritas | Token-window visualiser: 512 vs 1024 vs 4096 against a real article length | Exactly why Longformer was chosen |
| QIntern | *(none at launch — no results to demonstrate)* | — |

Each is an Astro island, `client:visible`, static-first. Each costs roughly a day. They are earned per page, not sprinkled.

### Tier 3 — prohibited

Scroll-jacking, parallax, WebGL, cursor followers, page-load spinners, text scramble effects, magnetic buttons, animated gradients. These read as portfolio-template and undercut the premium register.

### Non-negotiable

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Every animated element must reach its final state without JS. Animation is enhancement over a correct static render, never a prerequisite for content being visible.

---

## 7. Quality gates

Applied at every milestone. A milestone isn't done until all pass.

| Gate | Threshold | How to check |
|---|---|---|
| Lighthouse performance | ≥ 95 | Chrome DevTools, mobile preset |
| Lighthouse accessibility | 100 | same |
| JS shipped on `/` | 0 bytes | Network tab, filter JS |
| Largest page weight | < 300KB | Network tab, uncached |
| Keyboard navigable | every interactive element reachable and visibly focused | Tab through |
| Works with JS disabled | all content readable, all links work | DevTools → disable JS |
| Reduced motion respected | no animation plays | OS setting or DevTools emulation |
| No console errors | zero | DevTools console |
| Heading order | no skipped levels | Lighthouse / axe |
| Colour contrast | 4.5:1 body, 3:1 large | axe |

---

## 8. Milestones

Each is independently shippable. **Deploy at M0** so every later milestone lands on a live site — this prevents the classic failure where nothing ships until everything is perfect.

---

### M0 — Foundation and deploy
*Target: 1 session*

- `tokens.css`, `global.css`, `motion.css`
- Self-hosted fonts in `/public/fonts/` (woff2, subset latin, `font-display: swap`)
- `Base.astro` and `Page.astro` with full meta: title, description, canonical, OG, Twitter
- `Header.astro`, `Footer.astro`
- Placeholder `/` rendering the hero headline with correct type and tokens
- Deploy to Cloudflare Pages, auto-deploy on push to `main`

**Accepts when:** the live URL renders the headline in Instrument Serif on the bone ground, Lighthouse ≥95/100, zero JS in the network tab, and a shared link produces a correct OG preview.

---

### M1 — Content model and the card
*Target: 1 session*

- `content/config.ts` with both schemas
- All 3 projects as markdown with complete frontmatter
- `StatusStamp.astro`, `EvidenceMeasure.astro`, `ProjectCard.astro`
- The hybrid treatment: measure length from B, outlined stamp from A
- `/work/` listing all three

**Accepts when:** changing `evidenceLevel` in a markdown file visibly changes bar length with no code edit; a card with a missing optional link renders without a gap; all four status values render distinctly; TypeScript build passes with zero errors.

---

### M2 — Hero and home
*Target: 1–2 sessions*

- `ArcDiagram.astro` — generative from a coordinate array, not hardcoded paths
- Tier 1 draw-in sequence with reduced-motion guard
- Three doors, featured work, trust strip from `data/trust.ts`, contact
- `data/trust.ts` as the single source for all credentials

**Accepts when:** the arcs animate in the documented order; with reduced motion enabled the diagram appears complete and static; the page ships under 2KB of JS; changing the coordinate array changes the diagram.

---

### M3 — Moderna case study *(the pattern-setter)*
*Target: 2 sessions*

- `CaseStudy.astro` with the margin column
- Full Moderna write-up: problem → approach → the brute-force control → results → limitations
- Tier 2 island: scrubbable noise-run grid
- Margin column carries status, evidence, links, collaborator credit

**Accepts when:** the margin column collapses correctly below 900px; the island renders a usable static grid before hydration; the page states the limitations section as prominently as the results; every external link resolves.

**This milestone sets the template.** Get it right before M4 — everything after copies its structure.

---

### M4 — Archive and filtering
*Target: 1 session*

- Domain filter on `/work/`
- Filter is URL-driven (`/work/?domain=quantum`) and works without JS via progressive enhancement, or is a static per-tag page — either is acceptable, pick one and document it
- Empty-state handling for tags with no content

**Accepts when:** filtering works with JS disabled; a filtered view is linkable and survives refresh; the `edge` tag does not appear anywhere in the UI.

---

### M5 — Products and services
*Target: 1 session*

- `/products/` with Quantum Arcade, honest status, real link
- `/services/` organised by capability, single CTA
- `data/products.ts`

**Accepts when:** the Quantum Arcade card status matches its actual state; the services page has exactly one call to action; the link resolves to a working page (requires the `firebase.json` fix shipped first).

---

### M6 — Veritas case study and first post
*Target: 2 sessions*

- Veritas as a three-phase progression, incidents leading
- Tier 2 island: token-window visualiser
- First post: the brute-force control
- `/writing/` index

**Accepts when:** the case study states the ISOT limitation explicitly; no metric appears that isn't backed; the post renders with correct prose width and typography.

---

### M7 — QIntern, polish, launch
*Target: 1–2 sessions*

- QIntern case study, labelled live, no island
- 404 page
- OG images per route
- Full accessibility pass with axe
- Cross-browser check: Chrome, Firefox, Safari, mobile Safari
- Custom domain

**Accepts when:** every gate in §7 passes on every route; axe reports zero violations; the site renders correctly on a real phone.

---

## 9. Revision triggers

| Trigger | Action |
|---|---|
| QIntern benchmarks land | Promote to flagship; add a Tier 2 island; revisit §8 M7 |
| RakshAI gets a real metric | Add as a fourth case study, `metrics-pending` or better |
| Quantum Arcade reaches usable | Change status; consider promoting to `/` |
| A fourth domain appears | Add tag to enum, add content, no layout change required |
| Any claim becomes unsupportable | Drop `evidenceLevel`, update `evidence` string, same day |

---

## 10. What agents must not do

Restates `AGENTS.md` with build-specific additions:

1. **Never write or edit public prose** — case study copy, project descriptions, hero lines, the trust strip. Structure and markup only.
2. **Never invent a metric, date, result, or link.** Absent frontmatter renders as omitted; that is the correct behaviour.
3. **Never raise `evidenceLevel`.** Only you set that value.
4. **Never add a dependency** without it being named in this spec.
5. **Never use the triad colours** outside evidence indicators.
6. **Never ship an animation** without a reduced-motion guard.
7. **Never hardcode a colour, size, or spacing value** — reference a token.

---

## 11. Open decisions

| Decision | Default if unresolved |
|---|---|
| Hero concept | `1b` — arc diagram |
| Type pairing | `1e` — Instrument Serif + IBM Plex Sans/Mono |
| Card treatment | Hybrid — B's measure, A's stamp |
| Filter implementation | Static per-tag pages (simpler, zero JS) |
| Domain | `.dev` purchased outright |

Defaults apply unless changed before the relevant milestone. Changing one after its milestone ships means rework — decide before, not during.
