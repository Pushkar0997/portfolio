---
title: Decoding [[18,4,4]] qLDPC syndromes without QEC libraries
tagline: 'From-scratch Numba Min-Sum BP + GF(2) OSD decoder under SI1000 circuit-level noise, reaching 0.04483 Private MAE within an 8 GB RAM ceiling.'
status: verified
domain: quantum
year: '2026'
org: NQCP / Niels Bohr Institute Kaggle Hackathon
evidence: '0.04446 Public / 0.04483 Private per-observable MAE (~6.5× below the 0.29 baseline); 0.079915 shot LER over 200k SI1000 shots.'
evidenceLevel: 0.9
links:
  repo: https://github.com/Pushkar0997/qec-decoder-hackathon-2026
  report: https://github.com/Pushkar0997/qec-decoder-hackathon-2026/blob/main/README.md
featured: true
order: 2
---

## The constraint

The Quantum Error Correction: Decoder Hackathon 2026 (hosted by the Novo Nordisk Foundation Quantum Computing Programme at the Niels Bohr Institute) posed a strict rule: decode circuit-level syndromes for an `[[18, 4, 4]]` quantum LDPC code under the superconducting `SI1000` noise model ($p = 0.002$) **without importing any external QEC decoding packages** (`pymatching`, `ldpc`, `bposd`, or `sinter`).

Only standard scientific Python (`numpy`, `scipy`, `numba`, and `stim` for circuit parsing) was permitted, and the submission had to execute comfortably on an 8 GB RAM machine.

## Architecture of the from-scratch decoder

Rather than coupling to `qecscreen` (which relies on `ldpc`), this project was built in a zero-coupled repository around `handin/decoder.py`:

1. **Detector Error Model (DEM) Extraction**: Parses the `Stim` circuit's detector error model into a sparse parity-check matrix $H \in \mathbb{F}_2^{M \times N}$, logical observable matrix $L \in \mathbb{F}_2^{K \times N}$, and prior channel log-likelihood ratios $\text{LLR}_j = \ln\frac{1 - p_j}{p_j}$.
2. **Numba-JIT Normalized Min-Sum Belief Propagation (BP)**: Runs 5 iterations of message passing in `float32` with normalization factor $\alpha = 0.8$ and syndrome-sign flipping.
3. **$\text{GF}(2)$ Ordered Statistics Decoding (`OSD-0`) Rescue**: Whenever BP fails to converge to a valid syndrome ($H \hat{e} \ne s \pmod 2$), columns of $H$ are ordered by their posterior BP reliability and reduced over $\text{GF}(2)$ via bit-packed Gaussian elimination to solve for the exact syndrome-consistent error configuration.
4. **10,000-Shot Chunked Streaming**: Processes syndrome batches in 10k-shot slices so peak memory never exceeds 8 GB RAM even on multi-hundred-thousand-shot evaluation matrices.

## What the measurements say

| Evaluation Split | Per-Observable MAE | Shot Logical Error Rate (LER) | Comparison vs. Baseline |
| :--- | :--- | :--- | :--- |
| **Local Validation (`200,000` sampled shots)** | — | `0.079915` | Verified via `scripts/verify_and_stress_test.py` |
| **Provided `train.csv` Benchmark** | — | `0.081285` | Consistent across seed partitions |
| **Kaggle Public Leaderboard** | **`0.04446`** | — | ~6.5× lower error than ~`0.29` baseline |
| **Kaggle Private Leaderboard** | **`0.04483`** | — | Zero generalization gap (`+0.00037` delta) |

## Limits

The decoder implements `OSD-0` (zero-order reprocessing over the most reliable independent basis). Higher-order combination sweeps (`OSD-CS` of order $w \ge 2$) would trade additional CPU cycles per non-convergent shot for a lower logical error floor at higher physical error rates, which was unnecessary at $p = 0.002$ where 5-iteration normalized Min-Sum + `OSD-0` already saturated the target runtime budget.
