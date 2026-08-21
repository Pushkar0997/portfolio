---
title: Veritas AI, and what distributed training actually costs
tagline: Three iterations of a long-context misinformation classifier, and the infrastructure failures that shaped each one.
status: metrics-pending
domain: ml
year: '2025–2026'
evidence: 'No held-out evaluation published. The training metrics were lost with the cloud account.'
evidenceLevel: 0.3
links:
  repo: https://github.com/Pushkar0997/vertex-pytorch-trainers
  model: https://huggingface.co/PushkarKumar/veritas_ai_v2
  demo: https://github.com/Pushkar0997/veritas_ai_v2
featured: true
order: 3
---

## Three models, not one

The published artifacts are a progression, and the differences between them are the point.

**v0** — a 67M-parameter classifier trained on the ISOT dataset alone, September 2025. A first pass.

**v1** — moved to `allenai/longformer-base-4096` to handle article-length input without truncation. Still ISOT only, one epoch, on Kaggle.

**v2** — the same architecture trained on a merged corpus of ISOT, LIAR and FEVER, distributed across multiple GPUs on Google Cloud Vertex AI. Three epochs, cosine schedule, early stopping, best checkpoint selected on weighted F1.

## The bug between v1 and v2

Longformer's defining feature is global attention: a small number of tokens attend across the whole sequence while the rest use a sliding window. Configure that wrong and you are paying for a long-context model without getting one.

In v1 the global attention mask was built as a flat Python list the length of the input IDs, with only the first element set — while inference constructed a proper `(batch_size, seq_len)` tensor. Training and inference were running different attention configurations for the entire run.

v2 applies the same construction in both paths. It is a two-line difference and it invalidated the run that preceded it.

## What the infrastructure work actually involved

Vertex AI launches a training container with `python -m trainer.task`, which is a single process. Distributed training needs `accelerate launch` to spawn one process per GPU. The launcher detects that it is the initial invocation and re-executes itself under `accelerate`, which is the only way to get a correct DDP topology out of that entry point.

Then the failures, in the order they were found:

**A silent deadlock.** A run hung and produced nothing for over twenty hours before anyone noticed. No error, no crash — just a job burning GPU time. Everything after this was built to make that impossible to repeat quietly.

**A checkpoint race.** Two GPUs wrote the final checkpoint simultaneously and corrupted the saved state. The run completed; the artifact was unusable.

**Tokenization cache collisions.** Every worker tried to tokenize and write the same Arrow cache, and they fought over the file lock. The fix gates tokenization to `LOCAL_RANK == 0` behind a spin-wait barrier file, so the other ranks wait rather than duplicate the work.

What came out of it: NCCL configured explicitly for GCP's inter-GPU behaviour, and a four-destination save strategy — Vertex output path, primary GCS bucket, timestamped GCS backup, local copy — with upload retry and verification.

And a smoke test. Before any GPU spins up, a trivial scikit-learn job runs against the same service account to confirm IAM permissions and GCS access work. It costs nothing and it catches the failure that otherwise surfaces forty minutes into an expensive job.

## Why there is no accuracy number here

v2's training computed accuracy and weighted F1, and selected its best checkpoint on F1. Those numbers went with the GCP account when I closed it after the bill arrived. I can't recover them and I won't reconstruct them from memory.

There is a validation loss figure from the v1 run that looks extraordinary. It should not be trusted, and I am not publishing it as a result. ISOT's labels derive from source characteristics — one outlet against a set of unreliable ones — so a model can score nearly perfectly by learning publisher formatting rather than anything about credibility. A near-zero loss on that data is a description of the dataset, not of the model.

The evaluation that would settle this is straightforward: reload v2, rebuild the merged corpus with the documented seeds, and score the held-out split **per source**. If it holds on LIAR and FEVER, that is a real result. If it collapses to ISOT, that is worth knowing too. Until that runs, this project stays marked as unmeasured.

## Limits

The deployed inference app does no URL scraping, no evidence retrieval and no external fact-checking — it classifies text you give it and returns a probability. It is a signal for triage with a human in the loop, not a fact-checker. The model is English-only, and mixing claim-style data with article-style data creates domain-shift effects that have not been characterised.
