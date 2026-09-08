# Security Policy

CareGene is a product/design prototype. It is not a deployed medical service and must not be used to store, process, or transmit real patient information.

## Supported code

Security fixes are maintained on the latest `main` branch. Historical snapshots and forks are not supported security targets.

## Reporting a vulnerability

Prefer GitHub's private **Report a vulnerability** flow from the repository Security tab when it is available. If private vulnerability reporting is unavailable, contact the repository owner through their GitHub profile before publishing exploit details.

Do not include real patient information, protected health information, credentials, private API keys, or other sensitive personal data in a report. Reproduce healthcare-data findings only with synthetic or fictional data.

A useful report includes:

- the affected file, dependency, workflow, or commit;
- clear reproduction steps using non-sensitive test data;
- expected versus observed behavior;
- security impact and any known preconditions;
- a minimal proof of concept when needed.

## Scope boundaries

The repository intentionally represents a prototype. Reports that identify a path which could expose secrets, execute unreviewed code, weaken the prototype's local-data boundary, or create misleading security/privacy behavior are in scope.

CareGene does not claim HIPAA compliance, regulatory certification, production encryption guarantees, production retention controls, or clinical safety validation. Missing production controls that are already documented as unimplemented are product-readiness gaps rather than vulnerabilities unless the prototype falsely presents or technically bypasses those boundaries.
