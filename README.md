# pushkarkumar.me — Personal Portfolio

[![Live Site](https://img.shields.io/badge/Live_Site-pushkarkumar.me-16211d?style=for-the-badge&logo=astro&logoColor=white)](https://pushkarkumar.me)
[![Astro](https://img.shields.io/badge/Astro-7.x_Static-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](package.json)

Source repository for **[pushkarkumar.me](https://pushkarkumar.me)** — case studies, live products, and technical writing in **quantum computing** (`qLDPC` error correction, hybrid optimization) and **production machine learning**.

---

## 🧭 Design & Evidence Philosophy

1. **The Evidence Contract (`src/content.config.ts`)**:
   Every project case study carries an explicit `status`, `evidence` summary, and `evidenceLevel` (`0.0` to `1.0`) rendered as a physical measure bar (`EvidenceMeasure.astro`) and outlined stamp (`StatusStamp.astro`):
   - `verified` (`0.85–1.0`): Backed by a reproducible public artifact, dataset, or leaderboard benchmark.
   - `metrics-pending` (`0.20–0.40`): Built and deployed, with held-out evaluation caveats stated upfront.
   - `in-progress` (`0.00–0.15`): Active work before formal verification closes.
   - `reference`: Curricula, specifications, and learning collections (rendered as a neutral dash).
2. **Zero Client-Side JS by Default**:
   Static HTML output with semantic landmarks, design tokens (`src/styles/tokens.css`), and zero CSS/UI framework bloat.

---

## 📂 Repository Structure

```text
portfolio/
├── src/
│   ├── components/         # ProjectCard, ProductCard, EvidenceMeasure, StatusStamp, Header/Footer
│   ├── content/
│   │   ├── products/       # Live tools (Quantum Arcade, RepoBridge, Pramana AI, Smriti)
│   │   ├── projects/       # Measured case studies (qecscreen, QEC Decoder, QIntern qi26_25, RNA Folding, Veritas AI, Plant Disease, Smriti Vault)
│   │   └── writing/        # Essays on measurement, baselines, and failure modes
│   ├── data/
│   │   └── trust.ts        # Single source of truth for homepage credentials strip
│   ├── layouts/            # Page, CaseStudy, ProductPage, Post layouts
│   ├── pages/              # Static routes (/, /products/, /work/, /services/, /writing/)
│   └── styles/             # tokens.css and global.css
└── astro.config.mjs        # Static build & sitemap configuration for pushkarkumar.me
```

---

## 🚀 Local Development

```bash
npm install
npm run dev       # Starts local dev server at http://localhost:4321
npm run build     # Builds static production output to ./dist/
npm run preview   # Previews production build locally
```
