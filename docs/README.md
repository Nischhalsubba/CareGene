# CareGene

CareGene is a static healthcare product concept focused on helping families organize longitudinal records, caregiver observations, and clinical conversations for rare-condition journeys.

> **Concept status:** This repository is a product/design prototype, not a deployed medical service. Healthcare, privacy, security, compliance, retention, and launch claims in the interface must be independently verified before real-world publication or use.

## Workspace layout

```text
CareGene/
├── .github/
│   └── workflows/
│       └── quality.yml
├── app/
│   ├── public/
│   ├── src/
│   │   ├── scripts/
│   │   └── styles/
│   ├── .gitignore
│   ├── index.html
│   ├── metadata.json
│   ├── package.json
│   ├── script.js
│   ├── styles.css
│   ├── tsconfig.json
│   └── vite.config.ts
└── docs/
    └── README.md
```

The repository root contains folders only. The complete Vite project lives under `app/`, so its runtime-relative paths, Vite root, public directory, and source imports stay together.

## Development

```bash
cd app
npm install
npm run dev
```

Create a production build with:

```bash
cd app
npm run build
```

Preview the production output with:

```bash
cd app
npm run preview
```

The GitHub Actions quality workflow runs the production build from `app/` so future structural changes are checked against the same workspace boundary.

## Stack

- Vite for local development and production builds
- Semantic HTML for the single-page interface
- CSS for the visual system and responsive layout
- Vanilla browser JavaScript for interactions
- GSAP and Lenis loaded from CDNs for motion and smooth scrolling
- Lucide icons loaded from a CDN

The interactive memory-summary demo is intentionally self-contained. It uses local example data and does not send health information or API credentials to an external model from the browser.

## Source ownership

- `app/index.html` owns the page structure.
- `app/script.js` and `app/styles.css` are small compatibility entrypoints used by the page.
- Maintained runtime code lives in `app/src/scripts/` and `app/src/styles/`.
- `app/public/` contains files copied directly by Vite.
- `docs/` contains repository and maintenance documentation.

## Safety and content rules

Because the interface discusses medical records and clinical observations:

- do not treat example output as medical advice or a diagnosis;
- do not expose patient information, credentials, or private API keys in browser code;
- verify claims about HIPAA, encryption, data retention, model isolation, security hardening, and launch readiness before publishing them as factual product capabilities;
- keep sample patient information fictional and clearly separated from real records;
- require qualified clinical review for any future feature that interprets real medical data.

## Verification checklist

1. Run `npm run build` from `app/`.
2. Load the page without console or network errors.
3. Test navigation, staged-scroll story, concept demo, and calls to action.
4. Check keyboard interaction, visible focus states, small-screen layout, and reduced motion.
5. Confirm no private environment value is emitted into the client bundle.
6. Re-review healthcare and compliance copy whenever product scope changes.
