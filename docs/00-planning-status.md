# Planning status

**Status:** Draft for review
**Prepared:** 2026-10-28
**Repository observation:** The repository was empty and not initialized as Git when inspected. No prior requirements, feature inventory, code, or documents were available beyond the supplied master prompt.

## Evidence labels

- **Confirmed:** explicitly required in the master prompt.
- **Assumption:** a default used to make the plan concrete; it needs review.
- **Proposal:** an engineering recommendation, not yet approved.
- **Open:** materially affects scope, architecture, cost, or policy.

## Confirmed constraints

- One engineer; roughly one month for an MVP.
- Monthly infrastructure target of ₹2,000–₹5,000.
- TypeScript; Next.js/React frontend; NestJS REST backend; PostgreSQL; Prisma to be evaluated.
- Modular monolith, with web and API independently deployable.
- Public job discovery and private application tracking are distinct domains.
- Responsive, accessible, themeable UI; import/export; moderation; tests and production readiness.
- The initial planning phase prohibited implementation; incremental implementation was authorized on 2026-10-28.

## Decisions approved on 2026-10-28

- Begin incremental implementation with a foundation-only checkpoint before product features.
- Launch India-first while keeping the data model globally usable.
- Use email/password authentication; require verified email before public job publication.
- Keep both CSV and XLSX in MVP scope.
- Allow verified users to publish immediately, subject to duplicate detection, rate limits, reporting, and moderation.
- Delete private career data on account deletion; anonymize retained public contributions.
- Treat ₹5,000/month as an infrastructure target excluding domain registration and taxes.
- Limit initial imports to 5 MB or 5,000 rows.
- Finalize production domains before staging rather than blocking local foundation work.

Implementation choices remain provisional while their ADR status is `Proposed`; using them in the foundation is not evidence that they are optimal.

## Proposed defaults requiring approval

| Decision | Proposed default | Why |
|---|---|---|
| Product audience | India-first, English UI, global-ready data | Budget and examples imply India; avoids premature localization |
| Auth | Email/password plus email verification; opaque DB-backed sessions | Simple revocation and browser security; no JWT ceremony |
| Account roles | `USER`, `MODERATOR`, `ADMIN`; contributor is a reputation/capability, not a role | Prevents role explosion |
| Repository | pnpm workspace monorepo | Atomic contract changes without framework coupling |
| Hosting | Render web + API + PostgreSQL for MVP | Low operational burden and independent deploys |
| Import limit | 5 MB and 5,000 rows per batch | Keeps memory, abuse, and runtime bounded |
| Job publication | Authenticated, verified-email users only | Reduces spam while retaining community submissions |
| Public content | Plain text/limited structured fields; no arbitrary HTML | Shrinks XSS and moderation surface |

## Important conflicts or missing requirements

1. “One month” conflicts with the full breadth of polished imports, moderation, recovery, accessibility, and production operations. The roadmap protects the core loop and treats lower-priority polish as exit-criteria dependent.
2. Employer verification is mentioned only as a distinction/future feature. MVP listings must therefore say **community-submitted**, never “verified employer.”
3. No geography, legal entity, privacy policy, retention duration, or age requirement is specified.
4. No traffic, user, listing, file-size, availability, or recovery targets are supplied. This plan states conservative assumptions in the NFR document.
5. Email verification/recovery require a transactional email provider, but no provider or domain exists yet.
6. “XLSX import/export” increases security and regression scope. It remains MVP, but formulas, macros, hidden sheets, and workbook complexity are explicitly rejected.
7. A one-month MVP cannot promise high availability. It can be recoverable, observable, and safely deployable.

## Review gates

Do not start implementation until the P0 questions in [Open questions](99-open-questions.md) and the draft ADRs are reviewed. Approval can be incremental; decisions should move from `Proposed` to `Accepted` with date and rationale.
