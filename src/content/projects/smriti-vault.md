---
title: Smriti Vault — cross-document commitment and conflict ledger
tagline: 'On-device Uliya skill architecture for UGREEN AI NAS that reconciles contracts, invoices, and notes into a SHA-256 dossier across five epistemic states.'
status: reference
domain: edge
year: '2026'
org: UGREEN AI NAS Hackathon 2026
evidence: 'Specification and Uliya skill package published (SKILL.md + 4 reference schemas). Standalone FastAPI + SQLite + Ollama runtime is next.'
evidenceLevel: 0.15
links:
  repo: https://github.com/Pushkar0997/smriti-vault
  report: https://github.com/Pushkar0997/smriti-vault/blob/main/SKILL.md
featured: false
order: 7
---

## The problem

A project folder on a local NAS rarely fails because a file is missing. It fails because a signed Master Services Agreement says Net-30, an amended SOW PDF says Net-45, a whiteboard photo from Tuesday's call changes the milestone cap, and a voice note promises a Friday delivery.

Standard local RAG searches chunks by cosine similarity and blends whichever two paragraphs rank highest, hiding the contradiction.

## What is built

Submitted to Round 1 of the **UGREEN Hackathon 2026 on AI NAS** (*Automate Your Workflow* track), `smriti-vault` packages a deterministic **Uliya Skill** (`SKILL.md` plus four reference specifications in `references/`) that turns a local NAS directory into an auditable commitment and conflict ledger.

Every extracted claim (payment terms, dates, deliverables, owners, numeric caps) is assigned to one of five mutually exclusive epistemic states:

- **`CONFIRMED`**: Backed by a primary authoritative document with no contradicting later record.
- **`CONFLICTING`**: Two or more sources make incompatible claims on the same attribute without an explicit superseding clause.
- **`SUPERSEDED`**: An earlier commitment was explicitly overridden by a newer dated, signed, or higher-precedence record.
- **`UNVERIFIED_MENTION`**: Appears only in an informal channel (voice note, chat export, whiteboard scan) with no formal corroboration.
- **`MISSING_IN_SCOPE`**: A required contract attribute is absent across all inspected files in the directory.

Every cited fact carries its source path, byte/page span, and SHA-256 file digest so a human reviewer can verify the exact clause before acting.

## Limits and next step

The Round 1 artifact is a pure-Markdown Uliya Skill specification designed for UGREEN's UGOS Pro agent runtime. The standalone Dockerized prosumer engine (`FastAPI` + `SQLite` + local `Ollama` / `Gemma` inference with deterministic conflict-graph resolution) is the next implementation milestone.
