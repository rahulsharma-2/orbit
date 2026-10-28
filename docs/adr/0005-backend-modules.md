# ADR-0005: NestJS with application-oriented modules

**Status:** Proposed

## Context and drivers

The preferred backend is NestJS. Orbit needs validation, auth guards, OpenAPI, transactions, jobs, and maintainable domain boundaries without enterprise ceremony.

## Options and trade-offs

- **NestJS:** consistent DI/modules/testing ecosystem; decorators/framework coupling and over-abstraction risk.
- **Fastify with hand-rolled composition:** lean and explicit; more conventions and plumbing to design.
- **Next.js route handlers:** fewer deployables, but weaker separation and less suitable for the chosen domain/API architecture.

## Proposed decision

Use NestJS on its Fastify adapter if compatibility testing confirms required middleware. Controllers stay thin; application services own use cases; framework-light domain policies own transitions; owned repositories encapsulate persistence. Start interviews/notes inside applications.

## Consequences

Consistent structure and OpenAPI integration. Some Nest plumbing remains. Not every entity gets a repository/service/interface; abstractions follow meaningful boundaries.

## Risks and mitigation

Avoid “clean architecture” file explosion, generic repositories, and decorators inside domain logic. Establish module import rules and transaction helpers early.

## Reconsider when

Performance/profile evidence or framework friction materially slows delivery, or the team’s operational expertise strongly favors a simpler HTTP stack.
