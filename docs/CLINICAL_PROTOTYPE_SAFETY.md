# Healthcare prototype communication and privacy safety

> Status: contributor review checklist, not a claim that the product has passed an audit. This document introduces review expectations; it does not change application behavior.

## Why this exists

Establish a review boundary for a rare-condition caregiver concept so that illustrative summaries are not mistaken for diagnoses, consent or implemented clinical guarantees.

## Review rules

1. Identify all records, timeline items, symptoms and caregiver notes as fictional demo data unless a separately approved real-data pathway exists.
2. Do not output diagnosis, medication adjustment, triage direction, treatment recommendation or interpreted risk score as validated clinical guidance. Explain model or heuristic limitations next to the output.
3. Provide source provenance and review dates for educational claims. Clinical wording and translations require review by qualified professionals before publication.
4. Avoid real patient names, device identifiers, health documents and tokens in fixtures, logs, screenshots, commit history or public links.
5. Require explicit role and audience distinction for patient, caregiver and clinician views. A mock interface is not proof of protected access or regulatory compliance.
6. Exercise empty, conflicting, missing-date and uncertain observation states; use plain-language uncertainty and do not collapse unknown data into reassuring normal states.

## Verification

From `app/` run `npm run audit:claims`, `npm run audit:supply-chain`, `npm run typecheck` and `npm run build` (or `npm run verify` as the combined gate). Manually review privacy disclosures, assistive-tech descriptions and safety disclaimers; automated checks cannot establish clinical validity.

## Required evidence in a change request

PR: intended audience, changed claims/illustrations, fictional fixture evidence, clinical reviewer if relevant, actual command logs, privacy data-flow review and explicit unverified capabilities.

## Rollback and incident response

Remove misleading healthcare copy and public fixtures, revoke accidental exposure where possible, and record any privacy incident through a restricted channel rather than a public issue.

## Acceptance criteria

- [ ] The change addresses a stated user or maintainer risk.
- [ ] Evidence and source-of-truth references are attached or explicitly marked unavailable.
- [ ] Relevant automated checks are reported with actual outcomes; unrun checks are not marked passing.
- [ ] Negative, failure and recovery states are accounted for.
- [ ] A reviewer can understand what changed, remaining risk and how to revert it.

Document owner: repository maintainers. Review this checklist when workflows, dependencies or public claims materially change.
