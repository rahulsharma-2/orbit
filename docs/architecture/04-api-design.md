# API and contract design

## Conventions

- Base path `/api/v1`; additive backward-compatible changes remain in v1. Breaking semantics require a migration window or v2, not silent drift.
- JSON uses `camelCase`; timestamps are ISO 8601 UTC; IDs are opaque UUIDv7/ULID strings and never authorization evidence.
- OpenAPI is generated from backend schemas and checked into an artifact. The browser-safe client/types are generated; runtime response validation is used at risky integration boundaries.
- Request validation rejects unknown fields, coerces only explicitly supported query values, and applies body/field limits.
- CORS is an explicit allowlist; cookie requests use credentials; no wildcard origin.

## Resource sketch

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
DELETE /api/v1/auth/sessions
POST   /api/v1/auth/password-recovery

GET    /api/v1/listings?after=&q=&companyId=&workMode=&...
GET    /api/v1/listings/{listingId}
POST   /api/v1/listings
POST   /api/v1/listings/{listingId}/reports

GET    /api/v1/applications?after=&stage=&q=&...
POST   /api/v1/applications
GET    /api/v1/applications/{applicationId}
PATCH  /api/v1/applications/{applicationId}
DELETE /api/v1/applications/{applicationId}
POST   /api/v1/applications/{applicationId}/interviews
POST   /api/v1/applications/{applicationId}/notes

POST   /api/v1/imports                         # upload/parse preview
PUT    /api/v1/imports/{batchId}/mapping
POST   /api/v1/imports/{batchId}/confirm
GET    /api/v1/imports/{batchId}
GET    /api/v1/applications/export?format=csv

GET    /api/v1/moderation/reports
POST   /api/v1/moderation/reports/{reportId}/actions
```

Saving a listing is `POST /applications` with `listingId`; the idempotency key prevents duplicate retries. Avoid RPC sprawl such as `/saveJob`.

## Pagination, concurrency, and idempotency

- Cursor pagination uses a stable sort tuple such as `(publishedAt, id)`; responses return `items` and `page.nextCursor`.
- Offset pagination is acceptable only for small bounded admin views where jumping to a page matters.
- Mutable resources return `version`/ETag; update requires `If-Match` or expected version and returns `409`/`412` on stale writes.
- `Idempotency-Key` is required for listing submission, save/manual application creation, import confirmation, and moderator actions. Store user + route + key + request hash + response reference with TTL; reusing a key with a different body is `409`.

## Error envelope

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Some fields need attention.",
    "fieldErrors": [{ "path": "sourceUrl", "code": "INVALID_URL", "message": "Use an HTTPS URL." }],
    "requestId": "01..."
  }
}
```

Messages are safe for users; internal causes/stacks appear only in redacted logs keyed by `requestId`. `401` means unauthenticated, `403` known but forbidden, `404` hides private object existence, `409` represents state/idempotency conflicts, `422` semantic validation, and `429` includes `Retry-After`.

## Contract governance

- `packages/contracts` contains wire schemas/enums only. It cannot import Prisma, NestJS, database types, or secrets.
- CI detects unintended OpenAPI breaking changes, compiles generated client, and runs web/API contract smoke tests.
- Deprecations are documented with replacement and removal date; web and API deploy independently with expand/contract changes.
