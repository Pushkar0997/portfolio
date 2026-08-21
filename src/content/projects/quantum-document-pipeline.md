---
title: A quantum document pipeline, measured honestly
tagline: Quantum feature extraction and Grover string search for document processing, benchmarked against Tesseract and against itself.
status: verified
domain: quantum
year: '2026'
org: QIntern 2026 · QWorld
evidence: 'Reproduces from a clean clone in under a minute. 30-split significance testing, cross-platform verified.'
evidenceLevel: 0.95
links:
  repo: https://github.com/Pushkar0997/qi26_25
  demo: https://pushkar0997.github.io/qi26_25/
  report: https://github.com/Pushkar0997/qi26_25/blob/main/docs/final_report.md
featured: true
order: 1
---

## What it does

A document image goes in. Classical projection-profile segmentation cuts it into 8×8 character crops. Each crop is encoded as RY rotation angles and passed through a quanvolutional layer — a simulated entangling circuit — producing a feature vector that a lightweight logistic regression turns back into text. The recovered document ID is then searched with a Grover comparator oracle that computes string comparison inside the circuit.

Both quantum stages are real. The quanvolutional layer's output is verified against Qiskit Aer. The Grover oracle is given only the text and the pattern, never the answer.

## What the measurements say

At matched feature dimensionality, the quantum layer scores 92.2% against a classical convolution's 91.9%. Over 30 paired train/test splits that difference is not distinguishable from noise — roughly half the splits go each way.

Raw pixels beat both, at 93.6%, using *lower* dimensionality. That result holds in 30 splits out of 30.

This reframes the comparison. The interesting axis was never quantum versus classical; it was untrained random feature map versus no feature map at all. At 8×8 the input is already close to information-minimal, so any fixed random projection discards more than it contributes. The classical control fails identically, which is what rules out quantumness as the cause.

Training the filter does not rescue it. Optimising the eight RY angles moved sealed-test accuracy from 91.7% to 90.6% — down, not up — while validation accuracy rose. Eight parameters against a step-function objective is enough to fit the validation split's noise.

## The result I had to withdraw

An earlier run of that experiment reported a +1.4 point gain for the trained quantum filter, bringing it level with raw pixels.

That result was wrong. The angle search had run over the full dataset, and the final evaluation then used a fresh random split of the same dataset — so the angles had been selected using rows that later appeared in the test set. Re-running with a sealed 30% partition the search never touches reduced the gain to +0.1.

Both numbers are in the report. The difference between them is the difference between a headline claim and a real finding.

## The finding worth carrying elsewhere

The largest single improvement in the project came from a data-plumbing defect, not a modelling change.

Training crops were cut from exact glyph bounds recorded at dataset generation. At inference, crops came from projection segmentation. Those are measurably different distributions — median 16×19 px against 12×15 px on clean scans. The classifier was trained on one and asked to predict on the other.

It surfaced through an inversion that should not be possible: switching to a strictly better feature set raised isolated-character accuracy and made end-to-end error *worse*. That only happens when the two measurements aren't sampling the same input distribution.

Fixing it cut clean-tier character error from 42.9% to 6.6%. And it inverted a metric: training on realistic crops *lowered* reported held-out character accuracy from 92.6% to 67.7%, while producing dramatically better documents. Isolated-character accuracy was an actively misleading proxy, and optimising it drove the pipeline in the wrong direction.

## Against a real baseline

Tesseract — in development since 1985 — was run on the same images with the same scoring function.

It wins on clean and moderately degraded input by a factor of three to four on character error rate. Forty years of task-specific engineering beats a 4-qubit filter over 8×8 crops, and nothing here suggests otherwise.

Two details complicate that without rescuing it. On clean digital documents this pipeline recovers the identifier in every case against Tesseract's 92%, because a constrained 36-class charset cannot emit the out-of-charset characters Tesseract sometimes produces. And on the two most degraded tiers Tesseract returns essentially nothing, where this pipeline still recovers roughly one character in five — an artefact of Tesseract's page analysis rejecting input it judges unreadable, not evidence of a better method.

## Where Grover actually lands

The oracle works. Measured on a 16-character hex field with a 2-character pattern: 14 qubits, 3 Grover iterations, correct position recovered in 95.2% of shots, with zero amplitude leakage after uncomputation.

But measured CX gate count scales with a fitted exponent of 1.39 — superlinear in text length, because every candidate position needs its own controlled load of the text into the circuit. The √N query advantage does not survive into an end-to-end speedup for stored classical text. Grover's edge here is real only where the text is already a quantum oracle or is generated by a function rather than stored.

That is a known caveat. These measurements reproduce it directly rather than quoting √N unqualified.

## Honest limits

The data is synthetic. Labels are exact, but the degradation model is mine rather than sampled from real scanner behaviour. The handwriting tiers use an italic font with per-glyph jitter as a proxy — they are not real handwriting, and the IAM database is the correct extension.

Every conclusion is a conclusion about this regime: 6,023 characters, 8×8 crops, a 36-class charset, a 4-qubit filter, 60 synthetic documents. Whether quanvolutional layers behave the same way at larger patch sizes or on real scans is untested, and these measurements do not license extrapolating to them.

This work does not demonstrate quantum advantage for document intelligence. It identifies specific measured reasons why not.

## Scope

The project was scoped for three people across two tracks, with a mentor. Mentor contact ended in early July and neither track was taken up. Both tracks were consolidated into a single-person scope; all 23 commits in the repository are mine.
