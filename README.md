# CareGene

CareGene is a static healthcare product concept focused on helping families organize longitudinal records, caregiver observations, and clinical conversations for rare-condition journeys.

> **Concept status:** This repository is a product/design prototype, not a deployed medical service. Healthcare, privacy, security, compliance, retention, and launch claims in the interface must be independently verified before any real-world publication or use.

## Stack

- Vite for local development and production builds
- Semantic HTML for the single-page interface
- CSS for the visual system and responsive layout
- Vanilla browser JavaScript for interactions
- GSAP and Lenis loaded from CDNs for motion and smooth scrolling
- Lucide icons loaded from a CDN

The interactive memory-summary demo is intentionally self-contained. It uses local example data and does not send health information or API credentials to an external model from the browser.

## Repository structure

```text
CareGene/
├── src/
│   ├── scripts/
│   │   └── main.js
│   └── styles/
│       └── main.css
├── public/
│   └── robots.txt
├── index.html
├── script.js
├── styles.css
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

The root `script.js` and `styles.css` files are deliberately small compatibility entrypoints used by `index.html`. Maintained runtime code lives under `src/`.

## Development

Install dependencies and start Vite:

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

Preview the production output with:

```bash
npm run preview
```

No private API key is required for the current concept demo. Private secrets must never be injected into Vite's browser bundle.

## Source documentation standard

- Every authored HTML, CSS, JavaScript, and TypeScript source file should start with a concise description of its purpose and responsibilities.
- Meaningful functions should document what they do, important inputs and outputs, side effects, and non-obvious constraints.
- Comments should explain intent and maintenance concerns rather than restating syntax.
- Compatibility entrypoints should remain small and point to the canonical maintained source.

## Safety and content rules

Because the interface discusses medical records and clinical observations:

- do not treat example output as medical advice or a diagnosis;
- do not expose patient information, credentials, or private API keys in browser code;
- verify claims about HIPAA, encryption, data retention, model isolation, security hardening, and launch readiness before publishing them as factual product capabilities;
- keep sample patient information fictional and clearly separated from real records;
- require qualified clinical review for any future feature that interprets real medical data.

## Verification checklist

Before considering a change complete:

1. Run the Vite production build.
2. Load the page without console or network errors.
3. Test the navigation, staged-scroll story, concept demo, and calls to action.
4. Check keyboard interaction and visible focus states.
5. Check small-screen layout and reduced-motion behavior.
6. Confirm no private environment value is emitted into the client bundle.
7. Re-review healthcare and compliance copy whenever the product scope changes.
