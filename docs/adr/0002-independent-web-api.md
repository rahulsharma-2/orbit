# ADR-0002: Keep web and API independently deployable

**Status:** Proposed

## Context and drivers

The web and backend should evolve independently, preserve server-side authorization, and support non-web clients later. Yet shared contracts and atomic changes should remain practical for one engineer.

## Options and trade-offs

- **Next.js full-stack only:** fastest integration, but conflicts with preferred Nest backend and blurs deployment/domain boundaries.
- **Separate Next.js and NestJS deployables:** explicit contracts and independent releases; adds CORS/cookie/version compatibility concerns.
- **Separate repositories:** strongest operational separation, but synchronizing one engineer’s contracts and changes is overhead.

## Proposed decision

Deploy `apps/web` and `apps/api` independently from one repository. The web uses only versioned HTTPS APIs; it never accesses production PostgreSQL. Use same-site subdomains where possible, strict CORS, and backward-compatible expand/contract releases.

## Consequences

Frontend can deploy without API release and vice versa. Local development and CI need two apps. Authentication and SSR calls need deliberate base URLs, cookies, and CSRF design.

## Risks and mitigation

Contract drift is mitigated by OpenAPI diffing, generated client compilation, and staging smoke tests. Shared packages contain wire contracts only—not server entities.

## Reconsider when

Operational burden clearly exceeds value and no independent consumers/releases exist, or organizational/security boundaries require separate repositories/accounts.
