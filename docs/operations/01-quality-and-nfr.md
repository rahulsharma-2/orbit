# Non-functional requirements, testing, and coding standards

## Initial NFR targets (assumptions, not promises)

| Concern | MVP target |
|---|---|
| Availability | 99.5% monthly target, excluding announced maintenance; no contractual SLA |
| API latency | p95 < 500 ms for ordinary reads/writes at assumed load; search p95 < 1 s |
| Web performance | Core public pages target LCP < 2.5 s at p75 mobile; avoid blocking dashboard bundles |
| Scale assumption | 1,000 registered, 100 concurrent, 100k listings, 100k private applications in first phase |
| Recovery | Proposed RPO ≤ 24 h, RTO ≤ 4 h; improve after traction/paid backup tier |
| Accessibility | WCAG 2.2 AA for core journeys; keyboard-equivalent Kanban actions |
| Data isolation | Zero tolerated cross-user private-data disclosures; automated negative tests mandatory |
| Import | 5 MB/5,000 rows; deterministic result and retry; target completion < 2 min under normal load |
| Compatibility | Current and previous major Chrome/Edge/Firefox/Safari; responsive down to 320 px |

## Test pyramid by risk

- **Unit:** URL canonicalization, duplicate score, stage transitions, import mapping/validation, permissions, export escaping.
- **PostgreSQL integration:** constraints, transaction rollback, indexes/query plans for critical paths, idempotency, chunk recovery, concurrent stage updates.
- **API:** schemas, auth lifecycle, CSRF/CORS, rate limits, ownership matrix, moderator capabilities, safe errors.
- **End to end:** register/verify/login; discover/save/move/interview/note; import mapping and retry; report/moderate; theme and keyboard paths.
- **Contract:** OpenAPI breaking-change detection and generated-client compile/smoke tests.
- **Accessibility:** axe automation plus manual keyboard, focus, screen-reader labels, contrast, reduced-motion, zoom.
- **Security/regression:** cross-user IDs, stored XSS payloads, spreadsheet formulas, malicious URLs/files, stale versions, duplicate retries.

Use real PostgreSQL (ephemeral CI service/container) for integration tests; SQLite is not a substitute for PostgreSQL constraints and concurrency.

## Coding standards

- TypeScript `strict`; avoid `any`, unchecked casts, and non-null assertions unless locally justified.
- ESLint + Prettier; import/dependency boundaries enforced. Naming favors domain language over technical suffix soup.
- Controllers translate HTTP only; application services orchestrate; domain rules are framework-light; repositories own persistence details.
- Expected failures use typed domain/application errors mapped once to safe API codes. Unexpected failures log correlation/context and return generic `500`.
- Structured JSON logs with request ID, route template, latency, status, actor ID where safe; never bodies, cookies, tokens, passwords, notes, or spreadsheet rows.
- Configuration schema validates and exits at startup; no scattered `process.env` reads.
- Every schema change uses forward migration, reviewed SQL, tested against representative data, and explicit rollback/roll-forward plan. Prefer expand → deploy → backfill → contract.
- Pin lockfile; minimize dependencies; batch routine updates; urgent security patches follow incident SLA.
- Abstract after repeated change pressure, not in anticipation. A duplicated three-line mapping is often cheaper than a dishonest “generic engine.”

## Definition of done

A feature is done only when:

- acceptance criteria and error/empty/loading states pass;
- server-side authorization, validation, audit needs, and rate policy are implemented;
- unit/integration/API/E2E coverage matches its risk, including negative cases;
- accessibility and responsive behavior are checked;
- logs/metrics/errors are useful and redact sensitive data;
- database migration/rollback and API compatibility are reviewed;
- docs/OpenAPI/runbook are updated;
- CI is green and a self-review checks security, performance, failure modes, and scope creep;
- it is demonstrated in staging with no claim that production was tested unless it actually was.
