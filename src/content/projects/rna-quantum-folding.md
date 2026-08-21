---
title: Folding RNA with quantum optimization
tagline: A hybrid quantum-classical solver for mRNA secondary structure, built for the Moderna challenge — and a control that proved the formulation was the problem.
status: verified
domain: quantum
year: '2026'
org: WISER Global Quantum+AI Program
evidence: 'Reference structure reproduced at 0.000 kcal/mol gap. 35 of 35 noise runs recovered it.'
evidenceLevel: 0.85
links:
  repo: https://github.com/Harold-Ohandja/Moderna-Quantum-RNA-
  demo: https://harold-ohandja.github.io/Moderna-Quantum-RNA-/
featured: true
order: 2
---

## The problem

An mRNA strand folds back on itself, and the shape it settles into governs how stable it is and how well it translates. Predicting that shape means finding the minimum free energy configuration over an exponential space of possible base pairings — a combinatorial optimization problem, and therefore a candidate for quantum optimization.

The approach follows the method Moderna and IBM Quantum published in 2024: encode candidate base pairs as binary variables in a QUBO, then minimise it with a variational quantum algorithm. This is a smaller reimplementation of that approach, built for the Moderna challenge in the WISER Global Quantum+AI Program.

## What it achieves

On a 10-nucleotide sequence, CVaR-VQE reproduces ViennaRNA's exact minimum free energy structure — `(((....)))` at −1.3 kcal/mol — at an energy gap of 0.000, in about two seconds on 7 qubits. QAOA matches it.

That result survives noise. Across 35 runs spanning five random seeds and seven conditions — noiseless, shot budgets of 128, 512 and 2048, and depolarizing error rates of 0.001, 0.005 and 0.02 — every single run recovered the exact structure at zero gap.

## The control that mattered

On two other sequences, the quantum solvers miss the reference structure.

So does exhaustive brute-force search over the same QUBO.

That is the useful part. Brute force cannot do better than the problem it is handed, so when it fails identically, the limitation is provably in the *formulation* — how base pairs and energies were encoded — and not in the optimizer. Without that control, the honest report would have been "the quantum method underperformed," which points at the wrong component and would have sent the next iteration in the wrong direction.

Building the baseline that can fail is what makes the failure informative.

## Scaling, measured rather than asserted

One qubit per candidate base pair. Measured from 2 qubits at 6 nucleotides up to 87 qubits at 23 nucleotides, with circuit depth and QUBO term counts recorded at each step rather than extrapolated.

A 16-qubit line in an earlier version of the write-up was described as a hard limit. It was not — it was a threshold chosen to keep simulation fast. That was corrected after submission, along with a set of numbers in an intermediate report that had been stated without measurement behind them.

## Limits

The sequences are short. Real therapeutic mRNA runs to thousands of nucleotides, and one qubit per candidate pair does not get there on current hardware. The energy model is simplified relative to what ViennaRNA implements. And the two sequences where every method missed remain unsolved — the formulation needs work that this project did not do.

## Contributions

Repository owned by Harold Ohandja (AIMS Cameroon), who built the QUBO encoding, the Hamiltonian construction, and the ViennaRNA reference generation.

I built the solvers and everything that measures them: CVaR-VQE, QAOA, the hybrid and heuristic solvers, both classical baselines including the exact brute-force control, the resource and scaling analysis, all five benchmarking notebooks, the noise-robustness study, the visualisation module, the interactive explainer, and the final report.

The commit history is public if you want to check that split.
