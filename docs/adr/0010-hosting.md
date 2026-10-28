# ADR-0010: Managed application hosting and PostgreSQL

**Status:** Proposed

## Context and drivers

Production-minded MVP, independent web/API deployment, one operator, and ₹2,000–₹5,000 monthly target favor managed basics over infrastructure ownership.

## Options and trade-offs

- **Render web/API/PostgreSQL:** simple unified operations and independent deploys; entry tiers, region choice, backups, and cost need validation.
- **Vercel web + another API/DB provider:** excellent Next experience; more providers and likely paid-plan budget pressure.
- **Cloudflare web + managed API/DB:** low edge cost; Next runtime adaptation and multi-provider diagnostics add work.
- **Single VPS:** cheapest and flexible; operator owns patching, firewall, database availability, backups, and restores.
- **AWS managed stack:** flexible and career-relevant; cost/operational complexity is poor for this deadline.

## Proposed decision

Use Render for separately deployed Next.js web, NestJS API, and managed PostgreSQL, subject to a pre-implementation spike confirming region latency, Node memory, connection limits, backup/PITR/restore, and actual tax-inclusive cost. Use portable Dockerfiles and standard PostgreSQL.

## Consequences

Low operational surface and one billing/observability location. Some vendor dependence and potentially less favorable scaling economics. Staging may need on-demand scheduling to stay under budget.

## Risks and mitigation

Set spend alerts/caps, measure memory, rehearse export/restore, retain portable config, and avoid provider-specific business logic. Do not represent untested backup claims as recovery capability.

## Reconsider when

The spike breaches budget/requirements, Indian-user latency is unacceptable, usage economics shift, or uptime/compliance needs exceed entry managed tiers.
