# ADR-0011: Risk-based tests and gated CI/CD

**Status:** Proposed

## Context and drivers

Private-data isolation, imports, state transitions, and independent contracts are high-risk. One engineer cannot maintain exhaustive low-value coverage or a complex pipeline.

## Options and trade-offs

- **Mostly E2E:** realistic but slow/flaky and poor at edge-case diagnosis.
- **Mostly unit:** fast but misses PostgreSQL, HTTP, auth, and integration failures.
- **Risk-based pyramid:** balanced confidence; requires fixture/container discipline.
- **Manual testing:** quick initially, non-repeatable and unsafe for authorization/import regressions.

## Proposed decision

Unit-test policies; integration-test real PostgreSQL transactions/constraints; API-test auth/validation/ownership; E2E-test critical journeys; automate accessibility and OpenAPI compatibility. CI gates lint/type/test/build/scan. Staging smoke precedes explicitly approved production deployment.

## Consequences

High confidence where failures are costly, with moderate CI time. Developers must maintain deterministic fixtures and avoid duplicating assertions across layers.

## Risks and mitigation

Quarantine is not a graveyard: flaky tests get an owner/deadline. Track CI duration and parallelize later. Never replace Postgres integration tests with SQLite.

## Reconsider when

Suite time/flakiness impairs delivery, production incidents reveal missing layers, or team/traffic justifies stronger performance/security testing.
