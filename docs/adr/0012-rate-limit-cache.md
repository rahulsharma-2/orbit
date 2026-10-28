# ADR-0012: PostgreSQL-backed sensitive limits and no Redis cache

**Status:** Proposed

## Context and drivers

Login, recovery, submissions, reports, imports, and search can be abused. Multiple replicas must not bypass security limits. No current workload proves a cache requirement.

## Options and trade-offs

- **In-memory only:** cheap/fast, but inconsistent across instances/restarts.
- **PostgreSQL atomic windows:** correct across replicas using existing infrastructure; extra database writes and approximate policy.
- **Managed Redis:** strong counters/queues/cache; another cost, failure mode, and operational dependency.
- **Edge/WAF only:** absorbs IP abuse but lacks user/account semantics.

## Proposed decision

Use layered edge ceilings plus PostgreSQL atomic fixed/sliding-window counters for sensitive identity/user operations. In-memory buckets may smooth local bursts but never enforce critical policy alone. Use indexes, pagination, HTTP caching of safe public content, and client request dedupe; do not add Redis for MVP. Private responses are never shared-cacheable.

## Consequences

One fewer service and consistent limits across replicas. Counter writes consume DB capacity and cleanup is required. Public cache gains remain modest initially.

## Risks and mitigation

Hash sensitive keys, expire/clean windows, monitor DB load and false positives, return `Retry-After`, and ensure public cache keys cannot mix private variants.

## Reconsider when

Rate counters create measurable DB contention, a durable queue is justified, multiple replicas/high traffic are sustained, or profiling identifies hot public queries with safe cache semantics.
