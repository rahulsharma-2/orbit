# ADR-0009: Durable, bounded database-backed imports without a broker

**Status:** Proposed

## Context and drivers

CSV/XLSX mapping, validation, partial failure, idempotency, and recovery are MVP requirements. Files are untrusted; infrastructure must stay small.

## Options and trade-offs

- **Single synchronous transaction:** simple but request timeouts/memory and one-bad-row rollback create poor UX.
- **Database-backed batches/rows:** durable/resumable with existing PostgreSQL; creates temporary row storage and polling/cleanup work.
- **Queue + object storage + worker:** robust scale and isolation; more services, cost, retries, and operations.
- **Browser-only parsing:** saves server compute but cannot be trusted for validation/idempotency and handles sensitive files inconsistently.

## Proposed decision

Bound files to 5 MB/5,000 rows. Parse server-side into a preview and durable `ImportBatch`/`ImportRow` results, version mappings, confirm explicitly, and commit deterministic row chunks through application-module interfaces. Run processing inline for small batches or via a separately runnable process from the same codebase using PostgreSQL claiming; no Redis/broker. Delete raw content quickly.

## Consequences

Reliable progress/retry and precise row errors. More schema/state-machine/testing work; database bears temporary workload. Partial success is explicit.

## Risks and mitigation

Reject macros/encrypted/oversized workbooks, cap sheets/cells/time, sanitize exports, serialize per-user jobs, clean retention, and regression-test representative files.

## Reconsider when

Imports exceed limits, backlog/DB contention is measured, durable long-running work expands, or virus-scanned object storage becomes necessary.
