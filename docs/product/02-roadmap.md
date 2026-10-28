# Solo-developer roadmap

The one-month target is feasible only with ruthless sequencing and a release candidate that may cut P1 items rather than quality gates.

## Week 0: decisions and thin foundations (1–2 days)

- Approve P0 product questions and ADRs.
- Initialize workspace, CI, environments, configuration validation, schema migration discipline.
- Define OpenAPI conventions, error envelope, auth/session skeleton, semantic tokens.
- Exit: production-like hello/health path deploys through CI; no product feature yet.

## Week 1: identity and public discovery

- Registration, verification, recovery, sessions, authorization policy.
- Company/source/listing model, submission, public feed, filters, cursor pagination.
- Duplicate URL normalization and exact-match detection.
- Exit: a verified user can submit; anonymous user can find; abuse controls and API tests exist.

## Week 2: private career workspace

- Save/manual application; list/table/Kanban; stage events; notes; interviews.
- Ownership-isolation tests and optimistic concurrency.
- Responsive shell, themes, keyboard flows, core accessibility checks.
- Exit: the core discover-to-track loop works end to end.

## Week 3: data portability and moderation

- CSV first, then bounded XLSX; mapping/preview/validation/confirm/result.
- Historical search/export; formula-injection protection.
- Reporting, moderation queue/actions/audit log.
- Exit: regression fixtures cover malformed and duplicate imports; moderator cannot access private data.

## Week 4: hardening and release

- Security review, dependency/secret scan, rate-limit checks, load smoke test.
- Error tracking, dashboards/alerts, backup restore rehearsal, migration/rollback rehearsal.
- Cross-browser/device and accessibility pass; empty/error states; runbooks.
- Exit: definition of done and release checklist pass in staging.

## Cut order if schedule slips

1. Cut advanced duplicate similarity; retain normalized exact URL and manual report.
2. Cut fancy Kanban drag animation; retain accessible move action.
3. Cut XLSX export before CSV export; **only if product owner approves changing MVP**.
4. Cut bulk moderation conveniences; retain hide/dismiss plus audit.
5. Never cut authorization tests, validation, backups, or rollback readiness to preserve a date.

## Release metrics

- Activation: verified users who save or create one application within 24 hours.
- Core success: weekly users updating at least one application.
- Discovery usefulness: listing-detail-to-save rate.
- Trust: report rate, confirmed-report rate, duplicate rate, median moderation age.
- Reliability: API error rate, p95 latency, import failure rate, restore-test age.
