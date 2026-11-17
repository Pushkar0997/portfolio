---
title: Pramana AI
tagline: Live HTML checkout audit and deterministic sandbox harness that turns UI failures into verified visual proof and a patch diff.
status: beta
year: '2026'
access: 'Paste any public HTTPS URL for a live DOM audit, or run the three deterministic checkout fixtures. No account.'
links:
  site: https://pramana-ai-eta.vercel.app
  repo: https://github.com/Pushkar0997/pramana-ai
  docs: https://pramana-ai-eta.vercel.app/deck/index.html
featured: true
order: 3
---

## What it does

Give it a public URL or pick one of three deterministic e-commerce checkout fixtures. It inspects the page's structural DOM, form controls, mobile viewport configuration, accessibility labels, and script-blocking patterns, and emits a structured defect report paired with a concrete code diff.

Built for the **Startup Buildathon India 2026** (Google DeepMind × Google Cloud / Hack2skill / Nasscom / Headstart) under Team Vimarsha with teammate Saurav Kumar.

## The failure mode we had to fix in our own demo

An early build mixed live URL inputs with simulated checkout telemetry. Point it at `google.com` or `github.com` and it would cheerfully report a checkout conversion leak and an estimated monthly revenue loss on a page that has no checkout flow at all.

An external stress-test caught two things at once: first-time visitors could not tell whether they were looking at a live scrape or a canned fixture, and estimating rupee or dollar leakage on arbitrary non-commerce domains destroyed trust immediately.

The rewrite separated the two modes at the protocol boundary (`api/audit.js` and `src/App.jsx`):

- **Live Public HTML Audit**: Fetches the target URL server-side with a hard timeout, parses the returned HTML, and reports only structural signals actually present in the response — missing form labels, absent viewport meta tags, render-blocking synchronous scripts, unlabelled buttons, and whether checkout/cart DOM markers exist on the page at all. If the page is not a checkout flow, revenue-leakage estimates are suppressed rather than invented.
- **Sandbox Checkout Fixtures**: Three deterministic reproduction harnesses (mobile Z-index sticky-footer overlap, silent UPI webhook timeout, and unthrottled coupon-input layout shift) where the exact DOM fault, visual proof, and unified Git diff are pinned and reproducible.

## What is verified

Twenty-four unit and contract tests (`npm test`) cover the API audit handler, URL validation, non-checkout domain guardrails, fixture integrity, and diff generation. Offline verification scripts (`scripts/generate_outreach_proof.py`) run with explicit UTF-8 encoding so Windows PowerShell and Linux CI runners produce byte-identical proof bundles.

## What the hosted instance is and isn't

The Vercel deployment (`pramana-ai-eta.vercel.app`) runs serverless Node.js HTML fetching, not a headless Chromium cluster. Sites that render their entire DOM client-side behind a WAF challenge or require authenticated multi-step session state will show only their initial server-rendered shell in live mode. Full browser actuation belongs in the local runner, and the interface states that distinction upfront.
