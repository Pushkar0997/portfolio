---
title: Build the baseline that can fail
description: A quantum solver missed the answer. So did exhaustive search. That second result is the one that told me anything.
date: 2026-08-24
draft: false
---

A few months ago I was working on RNA secondary structure prediction — given a short mRNA sequence, find the shape it folds into. The approach encodes candidate base pairings as binary variables in a QUBO and minimises it with a variational quantum algorithm.

On one sequence it worked. CVaR-VQE reproduced the reference minimum-free-energy structure exactly, at an energy gap of 0.000, and held that result across 35 runs under shot noise and depolarizing error.

On two others it missed.

The obvious write-up was sitting right there: *the quantum method underperformed on longer sequences.* It would have been true, it would have been publishable in a student report, and it would have been useless.

## The result that made it useful

I had also implemented exhaustive brute-force search over the same QUBO. Not because I expected to need it — mostly because you want a ground truth to check the solver against on the small cases.

Brute force missed the same two sequences. Identically.

That changes what the failure means. Exhaustive search cannot do worse than the problem it is handed; it evaluates every configuration and returns the true minimum. So if brute force also returns the wrong structure, the wrong structure *is* the minimum of that QUBO. The optimiser found the right answer to the wrong question.

The limitation was in the formulation — how base pairs and energies were encoded — and not in the quantum algorithm at all.

Without that control, I would have written a conclusion that pointed at the wrong component. Someone reading it, including me six months later, would have gone off and tried a better solver, or more shots, or a deeper ansatz. All of it wasted, because none of it touches the encoding.

## Why this keeps happening

The pattern generalises, and once you start looking for it you see it constantly.

A model underperforms and the team tunes hyperparameters, when the labels are noisy. A retrieval system returns bad answers and the team swaps the embedding model, when the chunking strategy is dropping the relevant passage. A pipeline's accuracy drops in production and the team retrains, when the preprocessing differs between training and serving.

In each case the observation is real. The attribution is a guess. And the guess is usually the component the person was already thinking about.

The reason a control fixes this is not that it makes you more careful. It is that a control has a known answer. When something with a known answer fails, the failure is diagnostic rather than ambiguous.

## What counts as a good control

The useful property is not "simpler." It is **incapable of failing for the reason you are testing.**

Brute force cannot fail because of optimisation. So when it failed, optimisation was ruled out. That is the whole mechanism.

Some controls I have found worth building, in roughly increasing order of effort:

**Random.** Shuffle the labels and retrain. If performance barely drops, the model was not learning from the features. This catches a surprising amount.

**Exhaustive.** Only possible on small instances, which is exactly why you keep small instances around. If the exact answer is also wrong, the problem is upstream.

**The obvious classical thing.** In another project I benchmarked a quantum feature extractor against a classical convolution at matched dimensionality — and against raw pixels with no feature extraction at all. Raw pixels won. The classical convolution failed the same way the quantum layer did, which ruled out quantumness as the cause and reframed the question entirely: it was untrained feature map versus no feature map, and at that input size any fixed random projection discards more than it adds.

**The mature external tool.** In the same project I ran Tesseract, which has been in development since 1985, over the same images with the same scoring function. It beat my pipeline by three to four times on character error rate. I published that. A comparison you are confident you will lose is more informative than one you expect to win, because if you *do* win, you have learned something real.

## The awkward part

Controls mostly produce results you did not want.

Every one I have listed made a result worse or smaller. The brute-force control turned "the quantum method has limits" into "my encoding is wrong." The classical convolution turned "quantum features are competitive" into "neither feature map helps here." Tesseract turned a working OCR pipeline into a working OCR pipeline that loses badly to a forty-year-old baseline.

None of those are the findings I was hoping for when I started building. All of them are more useful than what I would have written without them, and all of them are things I would rather find myself than have someone else point out after publication.

There is a version of this discipline that is just self-flagellation, and I do not think that is what it is. The point is not humility. The point is that a result you cannot attribute to a cause does not tell you what to do next, and the entire reason to measure something is to know what to do next.

If a negative result would not change your next action, you have not learned anything from it. Build the thing that makes it change your next action.
