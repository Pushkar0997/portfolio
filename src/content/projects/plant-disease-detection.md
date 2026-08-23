---
title: A plant disease classifier that knows when to say nothing
tagline: Two-stage leaf diagnosis on PlantVillage — and a measured decision about when the model should refuse to answer.
status: metrics-pending
domain: ml
year: '2026'
evidence: '97.8% accuracy on 4,134 images. Not a sealed test split — val drove checkpoint selection.'
evidenceLevel: 0.4
links:
  repo: https://github.com/Pushkar0997/plant-disease-densenet169
  demo: https://huggingface.co/spaces/PushkarKumar/plant-disease-densenet169
  model: https://huggingface.co/PushkarKumar/plant-disease-densenet169
featured: false
order: 5
---

## What it does

A photograph of a leaf goes in. OpenCV contour and HSV morphology locate the leaf and crop to it, a fine-tuned DenseNet-169 classifies the crop across 15 crop-pathology classes, and an overlay engine draws the bounding box, the diagnosis, and the confidence back onto the original image alongside treatment guidance.

The two stages exist because field photographs are not clean. Background clutter, multiple plants and varying distances all degrade a classifier that was trained on centred single leaves, so localisation runs first and the classifier only ever sees a crop.

## The numbers

97.8% accuracy, 97.7% macro F1, 97.8% weighted F1, measured on 4,134 images across 15 classes.

Per-class F1 ranges from 0.927 to 0.997. The weakest classes are tomato early blight (0.927) and tomato target spot (0.941, at 0.904 recall) — both foliar spot diseases with visually similar lesion patterns, which is the confusion you would predict from the pathology rather than an artefact of the model.

## Why this is not a verified number

The training notebook splits the data into train and validation only, and it saved a checkpoint on every validation-accuracy improvement. So the validation split drove model selection, and **no partition of this dataset is sealed.** Measuring on it reports a number that is optimistically biased by construction.

An earlier figure — `best val_acc = 0.9686` — is worse still: it is the maximum over 15 epochs on that same split, which selects for the luckiest epoch as well as the luckiest checkpoint. The 97.8% above is a single-checkpoint estimate rather than a maximum, so it is better, but it is not held out.

Getting an honest number means retraining with a three-way split: carve out a test partition first, never load it during training, select on validation, evaluate once on test. Nothing computable from the existing run substitutes for that.

There is also a smaller uncertainty. The evaluation script reconstructs the notebook's split with a sorted file ordering, while the notebook itself depends on `Path.iterdir()` ordering, which is not reproducible. Some images that were in the original training set may therefore appear in this evaluation, inflating the number by an unknown but probably small amount.

## The decision worth showing

The application refuses to diagnose below a confidence threshold. Choosing that threshold by intuition is guessing, so it was measured instead.

| Floor | Coverage | Errors suppressed | Correct answers lost |
|---|---|---|---|
| 0.40 | 99.9% | 0% | 2 |
| 0.60 | 98.6% | 32% | 30 |
| 0.80 | 95.3% | 70% | 132 |
| 0.90 | 92.5% | 88% | 230 |
| 0.999 | 62.2% | 100% | 1,470 |

My first instinct was 0.40. The sweep shows that would have suppressed **zero errors** — it abstains on two images and catches nothing, which is worse than having no floor at all, because it creates the appearance of a safeguard that does no work.

The shipped default is 0.80: seven errors in ten are caught, at the cost of abstaining on 4.7% of images. Pushing to 0.999 does catch every error, but only by declining to answer on nearly four images in ten, which is not a usable product.

That tradeoff is legible because the two confidence distributions genuinely separate. Correct predictions have a median confidence of 0.9998; incorrect ones sit at 0.682. They overlap — 5% of wrong answers still come back above 0.949, and no threshold fixes those — but the separation is real enough for a floor to do meaningful work.

## The bug this started with

The original version shipped with the trained weights excluded by `.gitignore`, and a classifier that carried on regardless. With no checkpoint found it built the DenseNet backbone from ImageNet weights, attached a **randomly initialised** classification head, logged "running with pre-configured weights," and served predictions.

Running it on a real leaf photo returned "PATHOLOGY DETECTED" at 10.0% confidence, with treatment advice attached. Against 15 classes, chance is 6.7%.

Nothing about the interface distinguished that from a real diagnosis. Someone treating an actual crop would have had no way to tell.

Checkpoint resolution is now explicit: local file first, then the Hugging Face Hub, and if neither yields a usable checkpoint the resolver returns nothing plus a reason string rather than papering over it. A model without weights cannot produce a diagnosis at all.

## Known limitations

**A preprocessing mismatch between training and serving.** The notebook trains and validates with a direct `Resize((224, 224))`; the inference path uses `Resize(256)` followed by `CenterCrop(224)`. Those are different transformations, so the deployed application is not seeing images preprocessed the way the model was trained. The 97.8% figure is measured in notebook mode, which means real served accuracy is somewhat lower by an amount I have not measured. This is documented rather than fixed.

**PlantVillage is lab-condition imagery** — single leaves, uniform backgrounds, controlled lighting. The two-stage architecture exists precisely because field photographs are not like that, which means the headline number is measured on the distribution the localisation stage was built to avoid needing. A field evaluation script exists in the repository and has not been run.

**Fifteen classes, not the full PlantVillage 38.** Published baselines on the complete dataset are not directly comparable to this.

**The threshold sweep is measured on lab-condition data too.** A floor tuned there may behave differently on field photographs, where the confidence distribution is likely flatter.
