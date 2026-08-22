import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ─────────────────────────────────────────────────────────────
   The evidence contract.

   `status` and `evidenceLevel` must agree. `evidence` states in
   plain language what a visitor can go and check for themselves.

     verified         0.85–1.0   a public artifact backs this
     metrics-pending  0.2–0.4    built, not properly evaluated
     in-progress      0.0–0.15   live work, nothing to check yet
     reference        —          learning collection, renders as a dash

   No project ships above 0.5 without something checkable behind
   it. Only the repo owner sets this value — never an agent.
   ───────────────────────────────────────────────────────────── */

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string().max(160),
    status: z.enum(['verified', 'in-progress', 'metrics-pending', 'reference']),
    domain: z.enum(['ml', 'quantum', 'edge']),
    year: z.string(),
    org: z.string().optional(),
    evidence: z.string(),
    evidenceLevel: z.number().min(0).max(1),
    links: z
      .object({
        repo: z.string().url().optional(),
        demo: z.string().url().optional(),
        app: z.string().url().optional(),
        model: z.string().url().optional(),
        report: z.string().url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    date: z.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
