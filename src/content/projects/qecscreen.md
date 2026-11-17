---
title: Screening quantum LDPC codes against the kd²/n proxy
tagline: 'Pre-registered circuit-level screening across 242 bivariate bicycle codes: Spearman 0.871 vs 0.242 for kd²/n, while top-10 recall failed to separate.'
status: verified
domain: quantum
year: '2026'
evidence: '242 BB codes measured (76.3 core-hours, SHA-256 pinned). Spearman 0.871 vs 0.242 for kd²/n; headline Recall@30-of-top-10 (0.200 vs 0.000) failed to clear zero.'
evidenceLevel: 0.95
links:
  repo: https://github.com/Pushkar0997/qecscreen
  report: https://github.com/Pushkar0997/qecscreen/blob/main/docs/m0-writeup.md
featured: true
order: 1
---

## The pre-registered question

Searches for good quantum LDPC codes have to rank many candidate codes cheaply and spend full Monte Carlo simulation on only a few. The standard analytical proxy is $\Phi = kd^2/n$, built from logical qubits $k$, distance $d$, and block length $n$.

`qecscreen` was built to test a specific pre-registered question in Milestone 0 (M0): **does a LightGBM model trained on cheap structural and circuit features beat $\Phi = kd^2/n$ at `Recall@30-of-top-10` on a construction-program-grouped split, by a margin that survives bootstrap resampling?**

The answer is **no**. And the project proceeds to Milestone 1 anyway, because the kill condition did not fire either.

## What was measured

The population is every admissible bivariate bicycle (BB) code with $n \le 72$ and $d_{\text{upper}} \ge 3$ enumerated across 11 polynomial construction templates: 244 codes in total, of which 242 are measurable under the pinned syndrome extraction schedule (two `mixed_3_5` codes with $l=2$ have $x^3 = x$ monomial cancellation over $\text{GF}(2)$ and are excluded by protocol rule `D-036`).

Every code was simulated under uniform circuit-level depolarizing noise at $p = 0.002$, $Z$-basis memory for $r = d_{\text{upper}}$ rounds in `Stim 1.16.0`, and decoded with `ldpc 2.4.1` BP+OSD until recording 100 logical failures or hitting a 40,960-shot ceiling (76.3 core-hours across three Kaggle CPU sessions; SHA-256 archive `ccef076d…`).

A 28-feature LightGBM regressor was evaluated using leave-one-program-out cross-validation across all 11 construction templates, with 1,000-sample paired bootstrap intervals:

| Leave-one-program-out (242 BB codes) | Learned Model | $\Phi = kd_{\text{upper}}^2/n$ | Model − $\Phi$ |
| :--- | :--- | :--- | :--- |
| **Recall@30-of-top-10 (Headline)** | `0.200 [0.000, 0.600]` | `0.000 [0.000, 0.000]` | `+0.200 [0.000, 0.600]` |
| **Spearman rank correlation** | `0.871 [0.838, 0.894]` | `0.242 [0.118, 0.354]` | `+0.629 [0.521, 0.750]` |
| **Label-noise ceiling (Recall@30)** | `1.000 [1.000, 1.000]` | — | — |

## Why top-10 recall failed to separate while Spearman succeeded

All ten of the lowest-error codes in the population belong to a single template family (`pair_2_2`) with $k = 2$. Under leave-one-program-out evaluation, the single fold that holds out `pair_2_2` produces every one of their predictions. One held-out fold decides the entire headline metric, which is why the bootstrap interval spans `[0.000, 0.600]` and includes zero.

 Meanwhile, $\Phi = kd_{\text{upper}}^2/n$ scores `0.000` recall because every top-10 code has $k = 2$ and $\Phi \le 1.64$ — at least 70 higher-$k$ codes with worse logical error rates rank above them under $\Phi$. Across all 242 codes, $\Phi$ correlates weakly with measured logical error rate (`0.242`), whereas the structural feature model tracks the global ordering at `0.871` (a `+0.629` lead whose 95% interval `[0.521, 0.750]` clears zero cleanly).

## Why the headline failure is not rounded up

Pre-registration only means something if a failed headline criterion stays failed in the write-up. Spearman rank correlation over 242 codes is a statement about global ordering; `Recall@30-of-top-10` is a statement about finding the extreme tail. They disagree here, and Milestone 0 is recorded as **headline criterion FAIL, kill condition NOT MET, verdict PROCEED**.

## Reproducibility

The M0 dataset snapshot (`CC-BY-4.0`), protocol hash (`6230a7a8…`), `CITATION.cff`, and evaluation code (`Apache-2.0`) are public in `Pushkar0997/qecscreen`. Running `pip install .`, `python -m qecscreen.selfcheck`, and the evaluation snippets in the README reproduces both `0.000` recall and `0.242` Spearman for $\Phi$ directly from the committed Parquet snapshot.
