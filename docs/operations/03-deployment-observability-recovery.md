# Deployment, observability, backup, and recovery

## Environment and deployment model

- **Local:** web/API processes plus PostgreSQL in Docker Compose; fake/local email capture; seeded non-sensitive fixtures.
- **Staging:** production-shaped services with separate database/secrets, reduced sizing, synthetic data only. It may be on-demand to control cost.
- **Production:** independent web/API services and managed PostgreSQL in one nearby region. No Kubernetes.

Proposed MVP platform: Render for web, API, and PostgreSQL to minimize providers and operational load. Keep standard Dockerfiles and environment contracts to preserve portability. The architecture does not rely on proprietary runtime APIs.

## CI/CD gates

1. Install from frozen lockfile; format/lint; strict typecheck.
2. Unit tests; PostgreSQL integration/API tests; web component/accessibility tests.
3. Build web/API; generate and diff OpenAPI; dependency/secret/container scan.
4. Deploy staging; run migration compatibility checks and critical E2E smoke tests.
5. Production requires an explicit approval initially. Take/verify backup posture, run forward migrations as a dedicated release step, deploy API then web in compatibility-safe order, run smoke checks.

Never run schema migration automatically in every application replica at boot.

## Health and telemetry

- `/health/live`: process/event-loop basics only; no dependency fan-out.
- `/health/ready`: critical database connectivity and migration compatibility; email provider should not necessarily remove API readiness.
- Structured logs: request ID, trace/correlation ID, route template, duration, status, safe actor/resource IDs, deployment version.
- Error tracking: server and browser exceptions, release/source maps, scrubbed request context.
- Metrics: request rate/error/latency, DB pool saturation/query latency, auth failures/rate limits, import queue age/outcomes, moderation backlog age, email failures.
- Alerts must be actionable: sustained 5xx/error spike, readiness failure, DB storage/connections, failed backup, migration failure, import backlog, budget threshold.

OpenTelemetry is optional later. A platform dashboard + error tracker + structured logs is enough for MVP; running Prometheus/Grafana would consume the budget and an engineer’s attention.

## Backup and restore

- Use managed PostgreSQL automated backups/PITR at the selected tier. Confirm retention before launch; do not assume a marketing label equals a tested restore.
- Nightly logical encrypted export to a separate account/bucket is desirable if platform terms, encryption, and privacy deletion are resolved.
- Monthly restore drill into an isolated database: verify migration version, row counts, representative relationships, login reset path, and app smoke queries. Record duration and outcome.
- Proposed RPO 24 hours/RTO 4 hours until the selected database tier offers and demonstrates better.
- Backups are access-restricted, encrypted, lifecycle-expired, and included in account-deletion/privacy language.

## Rollback and incident runbook

- Application rollback: redeploy last known-good immutable image; keep at least two releases.
- Database rollback: prefer roll-forward; destructive/contract migrations happen only after old code is retired and a backup/restore path is verified.
- Incident flow: detect → assign severity/owner → contain (disable publication/import, revoke sessions/secrets) → preserve evidence → restore/roll forward → validate → communicate → postmortem/actions.
- Feature flags for high-risk workflows should be server-controlled and default safe, but do not build a general flag platform.

## Operational cadence

- Daily during launch: errors, moderation backlog, DB/storage, email failures, spend.
- Weekly: dependency updates, slow queries, rate-limit false positives, restore/backup status.
- Monthly: restore drill, access/secret review, budget forecast, retention cleanup verification, incident/action review.
