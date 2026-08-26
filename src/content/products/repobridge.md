---
title: RepoBridge
tagline: Turns a public GitHub repository into grounded, traceable context for an LLM — and never claims to have read something it didn't.
status: beta
year: '2026'
access: 'Paste a public repo URL and run it. No account. Shared instance with published limits.'
links:
  site: https://repobridge.pushkarkumar.me
featured: true
order: 2
---

## What it does

Point it at a public GitHub repository. It fetches the full file tree, classifies every entry, reads what it can, and produces a summary that states in its own prose how many files it was built from out of how many exist.

The pipeline runs in eight recorded stages: validate the URL, fetch metadata and tree, classify every entry, extract selected files to normalised text, generate a grounded summary, record diagnostics, persist everything. Runs can be reopened, filtered and re-summarised without re-fetching.

Jupyter notebooks are flattened cell by cell with index and type preserved, so a notebook reads as a sequence rather than as JSON.

## The problem it exists for

Ask most AI tools about a repository and one of three things happens. They can't fetch it. They read the README and stop. Or they produce a confident summary assembled from training priors, having read nothing.

The output looks identical in all three cases. There is no way for a reader to tell an informed summary from a plausible one.

## The invariant

One identity holds across every run:

`total_entries == directories + selected + skipped + failed`

Nothing falls through. Every file is either read, or skipped with a specific machine-readable reason — excluded directory, lockfile, non-text asset, too large, unsupported extension, submodule — or failed and says so. It holds at 37,393 entries on `kubernetes/kubernetes`, verified by recomputing from stored rows rather than reading a stored count, because a denormalised count can drift and then certify itself.

The interface follows the same rule. The tree says *"Showing 1–100 of 37,393 entries"*, and when filtered, *"Showing 1–7 of 7 matching entries (of 37,393 in this run)"* — so a small number can never be misread as the size of the repository. A nonexistent branch returns 404 naming the branch, not 200 with cheerful metadata. And `resolved_ref` stays null unless the tree call actually confirmed it, because a field must not assert a stage that never ran.

## The finding that shaped it

The read cap originally took the alphabetically-first N files.

Run against `psf/requests` at a cap of 20, it read 18 files from `.github/` and no source code at all. The README went unread. Every module of `src/requests/` went unread. The summary described the project as *"heavily structured around GitHub infrastructure and automation."*

Every individual fact in it was grounded. No unread file was named. It violated no rule in the system instructions. And it was materially wrong about what one of Python's most-used HTTP libraries is.

Grounding and representativeness are different properties. A summary can be true about everything it saw and false about the repository.

**The control is what made it a finding rather than an anecdote.** `github/docs` read 1.8% of its selected files — far less coverage — and characterised the repository correctly, because a documentation site is docs-shaped throughout, so an alphabetical slice is representative. Same machinery, same disclosure, opposite outcome. The variable was never the summariser; it was which files the cap chose.

I had predicted this failure mode five milestones earlier and logged it as an open item: a summary *"grounded in the wrong 2%."*

**The fix was to rank files for reading, not just chunks for the prompt.** Those need different signals. Chunk ranking orders content already read — every area is in the pool, and sorting only decides order. File ranking decides what gets read at all, so an area the cap never reaches is absent from the evidence entirely.

Ranking alone was not enough; it moved the concentration from `.github/` to `docs/`. What worked was ranking plus a round-robin across top-level areas, so no single directory can consume the budget.

Re-run at the same cap of 20, the summary now opens: *"This repository contains Requests, a simple and elegant HTTP library for Python built for human beings."*

The old ordering is pinned as a regression test, so the before and after live in the suite rather than only in this write-up.

## Other engineering

**Connection pooling took a 107-file extraction from 99.6s to 7.5s** — 13.3×, with an identical number of API calls. Bounded concurrency alone had bought only 2×; the real bottleneck was a fresh TCP and TLS handshake per file, which parallelism does not fix.

**65 claims audited mechanically** across six live summaries on five repositories, checked against the chunks the model actually received. The prompt is deterministically reconstructible, so this verifies what was sent rather than what merely exists in the run. Zero hallucinated files.

**Rate limits read from per-response headers**, not GitHub's `/rate_limit` endpoint, which was measured returning figures stale by 17 calls. Gemini's daily-quota 429 advertises a roughly 58-second retry delay when the actual reset is at the day boundary; that case is detected and fails fast rather than burning retries against a wall it cannot clear.

**No API key or token is ever stored, logged, or rendered.** Tests assert this by scanning every stored value and every rendered page, including for 8-character fragments, so a partial reveal fails too.

## How it was built

Spec-driven. A constitution, specification, milestone plan, task breakdown and evaluation rubric existed before implementation started.

A milestone closed only when every criterion was backed by a test or a recorded live result. Milestone 6 was held open twice — once because the grounding property had been demonstrated only on the easiest input in the suite, which is not a demonstration. Four scope changes were recorded as dated amendments rather than absorbed quietly, including splitting a milestone that had bundled three separable concerns and was therefore unclosable as written.

The project began with an audit of an earlier attempt that had claimed a milestone complete. The audit found the test suite collecting zero tests due to an import error, and the milestone roughly one third done. Everything after that was built on the rule that a claim without evidence is not a claim.

Eleven milestones, 646 tests, 12 documented smoke runs against real repositories from 1 to 37,393 entries. Python, FastAPI, SQLAlchemy with aiosqlite, Jinja2, hand-written CSS and JavaScript, Gemini for summarisation, pytest. No frontend framework, no build step, and no dependency added without a recorded reason — a constraint that held across all eleven milestones.

## What the public instance is and isn't

The deployment at `repobridge.pushkarkumar.me` is a shared demo running on one set of API keys against one database. Every analysis is visible to everyone using it, there are no accounts, and stored runs do not survive a restart. The limits are published on the page rather than discovered by hitting them: 20 analyses per hour across all visitors, 5 per visitor, repositories up to 5,000 tree entries, at most 100 files read per run.

Those constraints are a property of this instance, not of the tool. Running it locally removes all of them.

v0.1 covers public repositories only. Python, JavaScript, TypeScript, notebooks, Markdown, config and documentation are read; other languages' source is out of scope and reported as such rather than silently skipped. Single LLM provider. Both API keys are optional — without them the tool degrades and explains its own limits in the interface rather than failing opaquely.

Two decisions worth stating with their costs. No migrations in v0.1, because every stored row derives from a public repository and regenerates on re-run — a reset costs API quota, not information. And no API version prefix, because a prefix is a promise v0.1 cannot keep, and shipping one then breaking it is worse than never shipping one.

Next: multi-user deployment with private workspaces, and an MCP server so any LLM client can call RepoBridge as a tool instead of a person operating the interface.