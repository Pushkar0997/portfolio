# Conventions

Portfolio site. Astro, static output, minimal JavaScript.

## Non-negotiables
- Zero client-side JS unless a component genuinely needs interactivity.
  Prefer static HTML. Islands only where required, with an explicit
  `client:` directive and a comment saying why.
- No CSS framework. Plain CSS with custom properties, defined once in
  `src/styles/tokens.css`. Never hardcode a colour, spacing value, or
  font size — always reference a token.
- No component library. Components are hand-written and live in
  `src/components/`.
- Semantic HTML. Real headings in order, real landmarks, real buttons
  and links. Every image has alt text.
- Content lives in `src/content/` as markdown with typed frontmatter,
  never hardcoded into templates.

## Structure
src/
  components/     reusable UI
  layouts/        page shells
  pages/          routes
  content/
    projects/     case studies, markdown
    writing/      posts, markdown
  styles/
    tokens.css    all design tokens
    global.css    base element styles

## Naming
- Components: PascalCase (ProjectCard.astro)
- Everything else: kebab-case
- CSS custom properties: --kebab-case

## Content schema
Every project frontmatter carries a `status` field, one of:
verified | in-progress | metrics-pending | reference
and a `domain` field: ml | quantum | edge

## Never
- Never invent metrics, results, or dates. If a value is unknown,
  leave the frontmatter field absent and it renders as omitted.
- Never add analytics, trackers, or third-party embeds without asking.
- Never add a dependency to solve something CSS can already do.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
