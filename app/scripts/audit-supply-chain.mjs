import { readFile } from 'node:fs/promises';

const appRoot = new URL('../', import.meta.url);
const repoRoot = new URL('../../', import.meta.url);

const [html, packageText, lockText, licenseText] = await Promise.all([
  readFile(new URL('index.html', appRoot), 'utf8'),
  readFile(new URL('package.json', appRoot), 'utf8'),
  readFile(new URL('package-lock.json', appRoot), 'utf8'),
  readFile(new URL('LICENSE', repoRoot), 'utf8'),
]);

const packageJson = JSON.parse(packageText);
const lockfile = JSON.parse(lockText);
const failures = [];

const allowedRemoteScripts = new Set([
  'https://unpkg.com/lucide@1.42.0',
  'https://unpkg.com/@studio-freight/lenis@1.0.29/dist/lenis.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js',
]);

const scriptSources = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
const remoteScripts = scriptSources.filter((source) => /^(?:https?:)?\/\//i.test(source));

for (const source of remoteScripts) {
  if (!source.startsWith('https://')) {
    failures.push(`Executable remote dependency must use HTTPS: ${source}`);
  }
  if (/@(?:latest|next|canary)(?:\/|$)/i.test(source)) {
    failures.push(`Floating executable dependency is forbidden: ${source}`);
  }
  if (!allowedRemoteScripts.has(source)) {
    failures.push(`Remote executable dependency is not in the reviewed allowlist: ${source}`);
  }
}

for (const allowedSource of allowedRemoteScripts) {
  if (!remoteScripts.includes(allowedSource)) {
    failures.push(`Reviewed executable dependency is missing or changed: ${allowedSource}`);
  }
}

if (packageJson.license !== 'MIT') {
  failures.push(`package.json license must remain MIT; found ${packageJson.license ?? 'missing'}.`);
}

if (!licenseText.includes('MIT License') || !licenseText.includes('Copyright (c) 2026 Nischhal Raj Subba')) {
  failures.push('Root LICENSE does not match the declared MIT license and repository owner attribution.');
}

if (!Number.isInteger(lockfile.lockfileVersion) || lockfile.lockfileVersion < 3) {
  failures.push(`package-lock.json must use lockfileVersion 3 or newer; found ${lockfile.lockfileVersion ?? 'missing'}.`);
}

const lockedRoot = lockfile.packages?.[''];
if (!lockedRoot) {
  failures.push('package-lock.json is missing the root package record.');
} else {
  if (lockedRoot.name !== packageJson.name) {
    failures.push(`Lockfile package name drift: expected ${packageJson.name}, found ${lockedRoot.name ?? 'missing'}.`);
  }
  if (lockedRoot.version !== packageJson.version) {
    failures.push(`Lockfile package version drift: expected ${packageJson.version}, found ${lockedRoot.version ?? 'missing'}.`);
  }
  if (lockedRoot.license !== packageJson.license) {
    failures.push(`Lockfile license drift: expected ${packageJson.license}, found ${lockedRoot.license ?? 'missing'}.`);
  }

  const packageDevDependencies = packageJson.devDependencies ?? {};
  const lockedDevDependencies = lockedRoot.devDependencies ?? {};
  if (JSON.stringify(packageDevDependencies) !== JSON.stringify(lockedDevDependencies)) {
    failures.push('package-lock.json root devDependencies do not match package.json. Regenerate the lockfile with npm.');
  }
}

if (failures.length) {
  console.error('\nCareGene supply-chain audit failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`CareGene supply-chain audit passed for ${remoteScripts.length} reviewed remote scripts and npm lockfile v${lockfile.lockfileVersion}.`);
