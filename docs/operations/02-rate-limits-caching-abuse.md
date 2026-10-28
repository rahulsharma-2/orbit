# Rate limiting, caching, and abuse prevention

## Rate-limit policy

Initial values are tunable policy, not security constants.

| Operation | Identity | Proposed limit |
|---|---|---|
| Login | IP prefix + normalized account hash | 10/15 min per IP; 5/15 min per account; progressive delay |
| Recovery/verification resend | IP + account hash | 5/hour IP; 3/hour account |
| Registration | IP prefix + device-risk signal if available | 5/hour; 20/day |
| Listing creation | user + IP | 10/hour; 30/day |
| Reports | user + listing + IP | 10/hour; one active same-category report per listing |
| Import | user + concurrent count | 5/day; 1 active; 5 MB/5,000 rows |
| Search | session/IP | burst 30/min, sustained 300/hour; min query length and timeout |
| General authenticated writes | user | 120/min burst ceiling |

Return `429` with stable error code and `Retry-After`; do not reveal account existence. Successful and failed sensitive attempts both count where appropriate.

For the first single API instance, in-memory token buckets may protect accidental bursts, but correctness-sensitive limits use PostgreSQL atomic counters keyed by hashed identity and window. This works across replicas without Redis. Periodic cleanup deletes expired windows. Add a platform/WAF IP ceiling at the edge. If counter load becomes measurable, move only rate-limit state to managed Redis; do not add Redis merely because it is fashionable.

## Caching strategy

The MVP does not need application Redis.

- Start with indexes, cursor pagination, bounded queries, connection pooling, debounced search, and client request deduplication.
- Static assets use immutable content-hash caching.
- Public listing detail/feed may use short CDN/browser caching only when invalidation and moderation visibility are proven (`s-maxage` tens of seconds, stale-while-revalidate). Search query explosion limits cache value.
- Auth/session responses use `Cache-Control: no-store`.
- Private application/import/moderation responses are never put in shared caches; include `private, no-store` initially.
- Cache keys must include every representation-affecting field. Cookies on public routes should not accidentally make responses private or leak variants.

Redis is justified later by multiple replicas plus high-volume rate limits, durable queues, or measured hot-query pressure—not anticipated scale.

## Abuse and trust controls

- Verified email before publication; per-user/IP quotas; source domain displayed prominently; no link shorteners unless safely expanded in a future isolated service.
- Exact canonical URL duplicate block/warning; fuzzy candidates visible to contributor/moderator; override reason audited.
- Risk signals: account age, submission velocity, repeated domains, duplicate overrides, confirmed reports. Start rule-based and explainable.
- Reports enter a queue; high-confidence emergency hide may require threshold + distinct trusted reporters, but automated permanent removal is out of scope.
- Moderator actions are append-only audited. Contributors can be suspended without deleting history.
- “Community-submitted” and “source link” are distinct from future “employer verified.” The UI must never blur them.
- Prevent report brigading through one active report/category/user/listing, throttles, reporter reputation later, and moderator evidence—not raw vote count.
