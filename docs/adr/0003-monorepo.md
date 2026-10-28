# ADR-0003: Use a pnpm workspace monorepo

**Status:** Proposed

## Context and drivers

One engineer owns web, API, contracts, docs, and deployment. Contract changes often span both apps. The repository must not require heavyweight build orchestration prematurely.

## Options and trade-offs

- **Separate repositories:** independent permissions/history; higher coordination, duplicated tooling, awkward atomic changes.
- **npm/yarn/pnpm monorepo:** shared tooling and atomic reviews; broader CI and accidental coupling risk.
- **Nx/Turborepo from day one:** caching/affected graphs, but another configuration layer with little initial payoff.

## Proposed decision

Use pnpm workspaces and ordinary package scripts. Add task orchestration only after CI time or dependency ordering becomes a measured problem.

## Consequences

One lockfile and review surface; easy contract updates. Deploy pipelines must filter by changed app. Package boundaries and browser/server safety must be enforced.

## Risks and mitigation

Prevent imports from app internals, scope CI permissions/secrets per job, and keep packages few and purposeful. Avoid a generic `shared` dumping ground.

## Reconsider when

Teams, compliance, access controls, repository size, or release independence make separate repositories materially safer or faster.
