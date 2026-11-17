---
title: Smriti
tagline: Exam preparation assistant for MIT-ADT students, grounded strictly in batch PYQs and notes with a hard no-match fallback.
status: beta
year: '2026'
access: 'Live at smriti-indol.vercel.app behind a shared batch access code held in memory only.'
links:
  site: https://smriti-indol.vercel.app
  repo: https://github.com/Pushkar0997/Smriti
  docs: https://github.com/Pushkar0997/Smriti/blob/main/CONTRACT.md
featured: true
order: 4
---

## What it does

Lets an MIT-ADT undergraduate ask what a specific subject or exam pattern actually tests, and returns an answer grounded strictly in the batch's own Previous Year Questions (PYQs), lecture slides, and curated notes — with explicit document and section citations on every reply.

## Why generic RAG fails here

Every RAG wrapper has the same temptation: when vector retrieval comes back weak or empty, call the language model anyway with general knowledge *"to still be helpful."*

In an exam-prep tool for a specific university syllabus, that fallback is worse than returning nothing. A confident textbook answer about a topic that is not in the professor's syllabus or PYQ bank misleads the student about what to study.

## The invariants (`CONTRACT.md`)

Smriti enforces three non-negotiable invariants in [`lib/retrieval.ts`](https://github.com/Pushkar0997/Smriti/blob/main/lib/retrieval.ts) and [`app/api/ask/route.ts`](https://github.com/Pushkar0997/Smriti/blob/main/app/api/ask/route.ts), backed by 11 automated contract tests (`tests/inv-1.test.ts`):

- **`INV-1` — Grounded answers only (no third path)**: Every incoming question is embedded and matched against Supabase `pgvector`. If the top chunk similarity falls below `SIMILARITY_THRESHOLD` (`0.65`), `/api/ask` immediately returns `{ code: "NO_MATCH", message: "not in my material" }` and **never invokes the LLM**.
- **`REL-GAP` — Relevance gap filtering**: Even among chunks that clear `0.65`, only chunks within `RELEVANCE_MARGIN` (`0.06`) of the top-scoring chunk are passed to Gemini (`gemini-3.5-flash-lite`) and rendered as citations. Tangential chunks separated by a score cliff are dropped before generation.
- **`INV-3` — Zero query logging and zero browser storage**: Raw student questions are never stored in Supabase (`query_counts` tracks aggregate timestamps only) or printed to Vercel function logs. The batch access code lives exclusively in React in-memory state — never `localStorage`, `sessionStorage`, or cookies.

## Current state

Milestone 0 (full retrieval, ground-check, citation rendering, heartbeat cron, and Vercel deployment) is closed and verified live. Milestone 1 ingests the pilot Operating Systems (`OS`) corpus — 25 curated university documents comprising 261 section-delimited chunks — through a three-stage auditable pipeline (`inventory.ts` → `extract.ts` → `ingest_plan.ts`, which runs in dry-run mode by default).
