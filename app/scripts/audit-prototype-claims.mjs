import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const metadata = await readFile(new URL('metadata.json', root), 'utf8');
const runtime = await readFile(new URL('src/scripts/main.js', root), 'utf8');
const failures = [];

const forbiddenClaims = [
  'HIPAA Ready',
  'AES-256 Encrypted',
  'HIPAA Environment Launching',
  'Bank-Grade Hardening',
  'Zero-Retention',
  'Model Isolation',
  'Deleted records are purged instantly',
  '847 sources scanned',
  "Smart prompts adapt to your child's diagnosis",
  'detects subtle changes—so you know what to do next',
  'functional symptom analysis demo powered by Gemini',
];

for (const claim of forbiddenClaims) {
  if (html.includes(claim) || metadata.includes(claim)) {
    failures.push(`Unsupported prototype claim returned: ${claim}`);
  }
}

const requiredHtmlBoundaries = [
  'Product concept · fictional local data',
  'Not medical advice',
  'does not claim HIPAA compliance',
  'no clinical launch date',
  'does not diagnose, recommend treatment',
];
for (const statement of requiredHtmlBoundaries) {
  if (!html.includes(statement)) failures.push(`Missing prototype safety boundary: ${statement}`);
}

for (const statement of ['fictional local example data', 'not medical advice', 'not medical advice, diagnosis']) {
  if (!metadata.toLowerCase().includes(statement.toLowerCase())) {
    failures.push(`Metadata is missing safety wording: ${statement}`);
  }
}

for (const unsafeRuntimeMarker of ['GoogleGenerativeAI', 'Gemini', 'process.env.API_KEY', 'VITE_GEMINI_API_KEY']) {
  if (runtime.includes(unsafeRuntimeMarker)) {
    failures.push(`Browser runtime unexpectedly references external AI/private-key path: ${unsafeRuntimeMarker}`);
  }
}
if (!runtime.includes('conceptMemory') || !runtime.includes('This concept demo can summarize the example timeline')) {
  failures.push('The deterministic local concept-memory demo contract is missing.');
}

if (failures.length) {
  console.error('\nCareGene prototype-claims audit failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('CareGene prototype-claims audit passed.');
