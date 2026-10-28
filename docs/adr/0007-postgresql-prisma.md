# ADR-0007: PostgreSQL with Prisma plus reviewed SQL

**Status:** Proposed

## Context and drivers

Orbit is relational and transaction-heavy, needs integrity, full-text search, migrations, and TypeScript productivity. Prisma is preferred but must not weaken database control.

## Options and trade-offs

- **Prisma:** strong schema/client productivity; incomplete expression of some PostgreSQL constraints/indexes and migration pitfalls.
- **Drizzle/Kysely:** closer SQL control and typed queries; more manual mapping/conventions.
- **Raw SQL:** maximum control; higher repetitive effort and lower refactor ergonomics.
- **Non-relational database:** flexible documents, but inferior fit for ownership, transactions, reports, and relational history.

## Proposed decision

Use managed PostgreSQL as system of record. Use Prisma Client for routine owned-module access and Prisma Migrate in reviewed/customized mode. Add checked SQL for partial/expression indexes, extensions, checks, and safe data migrations. Never use auto-push in production.

## Consequences

Fast development with strong relational guarantees. Engineers must understand generated SQL and migration behavior; Prisma schema is not the full database specification.

## Risks and mitigation

Test migrations against real PostgreSQL and representative data; inspect query plans; use expand/contract; document raw SQL; pool connections; avoid leaking Prisma types through contracts.

## Reconsider when

Prisma blocks required PostgreSQL behavior, query control, migration safety, or performance often enough that its productivity benefit no longer wins.
