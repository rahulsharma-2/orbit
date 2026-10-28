# ADR-0008: Versioned REST with OpenAPI contracts

**Status:** Proposed

## Context and drivers

Web and API deploy independently. The product is resource-oriented and does not need client-selected graph traversal. Runtime validation and compatibility matter more than novelty.

## Options and trade-offs

- **REST + OpenAPI:** familiar caching/status semantics and broad tooling; generated client and schema synchronization require CI.
- **GraphQL:** flexible reads and typed schema; authorization/caching/query-cost complexity is unjustified.
- **tRPC/shared server types:** excellent TypeScript coupling; weakens independent boundary and non-TypeScript client portability.
- **Handwritten REST types:** simple start, inevitable drift.

## Proposed decision

Expose `/api/v1` REST, publish OpenAPI, generate the web client/types, and use a consistent error envelope, cursor pagination, optimistic concurrency, and idempotency keys. Shared source packages may contain browser-safe wire schemas only.

## Consequences

Clear external boundary and documentation; additional generation/diff tooling. Backward-compatible changes and deploy order become explicit engineering work.

## Risks and mitigation

CI detects breaking OpenAPI diffs and compiles/smoke-tests the generated client. Keep DTO/domain/persistence models distinct and avoid versioning every additive change.

## Reconsider when

Many clients require highly variable graph-shaped reads, or generated REST maintenance demonstrably outweighs GraphQL/tRPC coupling costs.
