# ADR-0001: Use a modular monolith

**Status:** Proposed

## Context and drivers

One engineer must deliver in roughly one month on a small budget, while preserving intelligible domain boundaries and a possible path to extract imports/notifications/ingestion later. Core application transitions need local transactions.

## Options and trade-offs

- **Layered monolith without module ownership:** fastest initially, but cross-domain writes and dependency tangles emerge quickly.
- **Modular monolith:** small deployment surface and ACID transactions; requires discipline because boundaries are not network-enforced.
- **Microservices:** independent scaling/deployment, but introduces data ownership, network failures, service auth, queues, tracing, and consistency work the MVP does not need.
- **Serverless functions per feature:** easy isolated deploys, but fragmented transactions, cold/runtime constraints, and platform coupling complicate imports and cohesive domain work.

## Proposed decision

Use one NestJS deployable organized into identity, companies, listings, applications, imports, and moderation modules. Modules own writes and expose explicit application interfaces. No cross-module repository access or circular dependencies.

## Consequences

Simple operations, one database, and synchronous transactions. Scaling is mostly whole-API scaling. Code review/tests must enforce boundaries. Extraction is reduced work, never automatic.

## Risks and mitigation

“Modular” can decay into folders only. Enforce import rules, ownership tests, public interfaces, and dependency diagrams. Avoid an internal event bus until actual asynchronous behavior requires it.

## Reconsider when

A module has independently dominant load, team ownership, compliance isolation, release cadence, or failure characteristics—and measured benefits exceed distributed-system cost.
