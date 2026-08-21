# AGENTS.md

Entry point for any agent working in this repo (Claude Code, Antigravity, Copilot).

**Read `docs/build-spec.md` before making changes.** It is the authoritative spec: architecture, tokens, layout, motion, milestones, and acceptance criteria. This file is the summary; that file settles disputes.

---

## What this is

A personal portfolio site. Astro 5, static output, TypeScript strict, plain CSS. It sells freelance ML/quantum work and hosts case studies and products.

The site's whole premise is that every claim on it carries a visible evidence level, including the unflattering ones. That premise is enforced in code (see "The evidence system" below) and it is the one thing that must not be diluted.

---

## Hard rules

1. **Never write or edit public prose.** Case study copy, project descriptions, hero lines, taglines, evidence strings, the trust strip. Structure and markup only. If a task requires new prose, stop and ask.
2. **Never invent a metric, result, date, link, or credential.** Absent frontmatter renders as omitted — that is correct behaviour, not a bug to fix.
3. **Never raise `evidenceLevel`.** Only the repo owner sets that value.
4. **Never use the evidence triad colours** (`--verified`, `--untested`, `--missed`) outside evidence indicators. No accent links, no coloured buttons, no tinted backgrounds.
5. **Never hardcode a colour, size, spacing value, duration, or font.** Reference a token from `src/styles/tokens.css`. If a needed value doesn't exist, add it to tokens first.
6. **Never ship an animation** without a `prefers-reduced-motion` guard and a static final state.
7. **Never add a dependency** not named in `docs/build-spec.md`. If one seems necessary, stop and ask.
8. **Never add analytics, trackers, third-party embeds, or external font/script requests.**

---

## Stack

```
Astro 5 (static)     TypeScript strict     Plain CSS
@astrojs/sitemap     @fontsource/*         nothing else
```

No Tailwind, no React, no CSS-in-JS, no animation library, no icon library, no UI kit.

---

## Structure

```
src/
  components/
    Layout/          Header, Footer, TrustStrip
    *.astro          ProjectCard, EvidenceMeasure, StatusStamp, ArcDiagram
  layouts/
    Base.astro       html shell, meta, fonts
    Page.astro       Base + header/main/footer
    CaseStudy.astro  Page + margin-column chrome
  pages/             routes, file-based
  content/
    config.ts        collection schemas
    projects/*.md    case studies
    writing/*.md     posts
  data/
    products.ts      too few for a collection
    trust.ts         credentials, single source of truth
  styles/
    tokens.css       every design value
    global.css       element defaults + layout primitives
    motion.css       keyframes + reduced-motion guard
docs/
  build-spec.md      authoritative spec
public/
  og/                social images
```

---

## Conventions

- Components: `PascalCase.astro`. Everything else: `kebab-case`.
- CSS custom properties: `--kebab-case`.
- Component styles go in the component's `<style>` block, scoped. Only genuinely global rules go in `global.css`.
- Semantic HTML. Headings in order, no skipped levels. Real landmarks, real buttons, real links.
- Every image needs meaningful `alt`; decorative SVG gets `aria-hidden="true"`.
- Layout primitives available: `.wrap`, `.prose`, `.stack`, `.stack-lg`, `.stack-xl`, `.section`, `.label`, `.sr-only`.

---

## JavaScript budget

- Zero client JS on `/`, `/work/`, `/services/`, `/writing/`.
- Islands only on case study pages, only `client:visible`, only with a comment stating why.
- Every island must render meaningful static content before hydration. No empty divs waiting for JS.
- Tier 1 motion total JS budget: under 2KB.

The `js` class is added to `<html>` by one inline script in `Base.astro`. Motion that would hide content must be scoped under `.js` so the no-JS render shows the final state.

---

## The evidence system

Every project carries `status` and `evidenceLevel` in frontmatter.

| Status | Level range | Meaning |
|---|---|---|
| `verified` | 0.85–1.0 | A public artifact backs this |
| `metrics-pending` | 0.2–0.4 | Built, not properly evaluated |
| `in-progress` | 0.0–0.15 | Live work, nothing to check yet |
| `reference` | n/a | Learning collection, renders as a dash |

`evidenceLevel` drives the visual measure length. The `evidence` string states in plain language what can be checked. They must agree.

**This system exists to make overclaiming visible.** An agent that quietly rounds a 0.3 up to a 0.6 has broken the product, not improved it.

---

## Definition of done

No change ships until:

- `npm run build` passes with zero TypeScript errors
- Lighthouse: performance ≥ 95, accessibility 100
- Zero console errors
- Keyboard navigable, focus visible
- Content readable with JS disabled
- No animation plays under `prefers-reduced-motion: reduce`
- No hardcoded design values introduced

---

## When to stop and ask

- The task needs new public prose
- The task needs a dependency
- The task needs a value not in `tokens.css`
- The spec and the request disagree
- A metric, date, or result is needed and isn't already in the repo
