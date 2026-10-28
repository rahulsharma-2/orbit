# Orbit Engineering Standards

## Scope and current project state

These instructions apply to every task in this repository and to all implementation agents.

- Orbit is currently in the planning/review phase. Do not initialize frameworks, install packages, generate application code, create infrastructure, or begin implementation until the user explicitly authorizes it.
- Architecture Decision Records in `docs/adr/` are `Proposed`, not accepted. Do not describe them as final or proven.
- Before implementation begins, review `docs/00-planning-status.md`, the relevant ADRs, and the P0 decisions in `docs/99-open-questions.md`.
- Once implementation is authorized, follow the standards below for every change.

## 1. TypeScript

- Enable strict mode. Keep compiler and lint warnings under control.
- Avoid `any`. At untrusted boundaries, accept `unknown` and narrow it explicitly.
- Avoid unnecessary assertions, non-null assertions, and unsafe casts. Never use `@ts-ignore` without a documented, reviewed justification.
- Give public APIs and domain boundaries explicit, meaningful input and output types.
- Use interfaces mainly for object contracts that may be extended or implemented. Use type aliases for unions, intersections, mapped types, and other compositions. Do not force every object into one form.
- Prefer discriminated unions for state-dependent behavior and exhaustive checks for important domain transitions.
- Use enums only when their runtime behavior is useful and justified; string-literal unions are often better for domain states.
- Keep functions focused. Avoid duplicate domain types or inconsistent representations across modules.

## 2. Contracts, validation, and models

Keep API contracts, domain models, and persistence models distinct.

### Backend

- Define DTOs for request bodies, path/query parameters, and relevant responses.
- If NestJS class-based validation is selected, use class DTOs and appropriate decorators consistently.
- Configure validation to reject unexpected properties where appropriate. Validate paths, queries, bodies, headers used as input, and imported rows.
- Frontend validation is never a security boundary.
- Never accept ownership IDs, privileged roles, moderation state, or other protected fields without server-side derivation/authorization.
- Do not expose Prisma records or internal entities directly as API responses.
- Map persistence, domain, and response shapes explicitly when the boundary improves safety or clarity. Do not create ceremonial one-to-one layers with no benefit.

### Frontend

- Use browser-safe shared contracts or generated API types; never import backend implementation modules.
- Represent loading, success, empty, validation, conflict, and error states explicitly.
- Align form rules with the server while treating the server as authoritative.

## 3. Architecture and module boundaries

- Orbit begins as a modular monolith.
- Controllers handle HTTP and delegate. Application services coordinate use cases. Domain policies own business rules. Repositories/persistence adapters own database access where a real boundary exists.
- Keep business rules out of controllers, React components, and infrastructure adapters.
- Each module owns its rules and data changes. A module must not directly modify another module's tables or import its repository.
- Avoid circular dependencies and unnecessary cross-module imports. Cross-module work uses an explicit exported application interface.
- Put external integrations behind interfaces/adapters when that seam enables testing, replacement, or isolation.
- Do not introduce an abstraction before stating the concrete current problem it solves.
- Do not introduce microservices, event buses, message brokers, caching services, or additional dependency-injection frameworks without an approved requirement and ADR.

## 4. Testing

Every meaningful behavior change includes tests appropriate to its risk.

### Unit tests

Cover isolated domain behavior such as:

- application-stage transitions;
- interview-history behavior;
- duplicate detection;
- import normalization and validation;
- permission and ownership decisions.

### Integration and API tests

Use real PostgreSQL in an isolated test environment where database behavior matters. Cover:

- constraints, indexes where correctness depends on them, and transactions;
- repository behavior and concurrency;
- API validation and safe errors;
- authentication, authorization, and cross-user isolation;
- import persistence, idempotency, and partial failure.

Never run destructive tests against production or shared user data.

### End-to-end tests

Protect the critical journeys:

1. register and authenticate;
2. publish a listing;
3. another user saves it privately;
4. update application stage;
5. record an interview event;
6. import a spreadsheet and receive row-level feedback;
7. prove one user cannot access another user's private career data.

### Test rules

- Write tests before or alongside behavior. Add a regression test for every fixed bug or vulnerability.
- Test failures, boundaries, stale state, retries, and unauthorized behavior—not only happy paths.
- Keep tests deterministic, independent, and explicit. Do not mock the behavior under test merely to make a test easy.
- Do not weaken/delete a valid test just to make a change pass.
- Do not substitute an arbitrary coverage percentage for meaningful risk coverage.
- Never claim a test passed unless its command actually completed successfully. If infrastructure prevents execution, report that limitation exactly.

## 5. Incremental development and checkpoints

For every implementation task:

1. Inspect relevant code, repository status, and conventions.
2. State intended behavior, affected modules, acceptance criteria, and risks.
3. Propose the smallest coherent implementation and its tests.
4. Implement one reviewable change; do not bundle unrelated work.
5. Run formatting and linting.
6. Run TypeScript type checking.
7. Run relevant unit, integration, API, and end-to-end tests.
8. Run the appropriate broader regression suite.
9. Review the complete diff for accidental edits, secrets, authorization/data-integrity errors, and needless complexity.
10. Fix relevant failures before calling the checkpoint stable.
11. Commit only when the repository is configured and the user has authorized the commit workflow.
12. Report the verified checkpoint and next logical step.

A checkpoint is stable only when its acceptance criteria and relevant validation checks pass.

## 6. Git and commit policy

- When explicitly authorized, make one Conventional Commit per small, coherent, verified change, for example:
  - `feat(api): validate job listing input`
  - `test(applications): cover stage transitions`
  - `feat(web): add theme switcher`
  - `fix(imports): reject malformed rows`
  - `docs(adr): record authentication decision`
- Check `git status`, inspect unstaged/staged diffs, and stage only intended files.
- Do not commit known failing relevant tests, unrelated formatting, secrets, credentials, `.env` files, or user data.
- Never rewrite/delete user commits or use destructive Git commands without explicit authorization.
- Do not push, publish, create releases, or deploy without explicit authorization.
- If committing is unavailable or unauthorized, report the stable checkpoint and suggest a commit message.

## 7. Formatting, naming, and maintainability

- Use automated formatter/linter and the repository's established import-order rules.
- Use PascalCase for appropriate classes/interfaces/types, camelCase for variables/functions, and UPPER_SNAKE_CASE only for genuine constants.
- Prefer domain-oriented filenames and names. Do not use names such as `data2`, `tempObj`, `commonHelper`, or `handleEverything`.
- Do not create generic utility modules that collect unrelated rules.
- Prefer established, maintained dependencies compatible with pinned framework versions.
- Do not add a dependency for trivial platform functionality. Review relevant license and security advisories before adding one.
- Pin dependencies through the lockfile and update them deliberately. Do not upgrade unrelated packages inside a feature change.

## 8. Errors and logging

- Use the documented API error envelope and distinguish validation, unauthenticated, unauthorized, not found, conflict, rate limit, and unexpected errors.
- Never expose stack traces, SQL details, secrets, or internal exception messages to clients.
- Preserve useful causal context when translating/rethrowing; never silently swallow exceptions.
- Log structured, safe context sufficient to debug: request/correlation ID, route template, safe actor/resource IDs, status, and latency.
- Never log passwords, tokens, session cookies, secret values, private notes, spreadsheet rows, or unnecessary personal data.

## 9. Database and migrations

- Use version-controlled migrations; never rely on manual production schema edits or schema auto-push.
- Test migrations against representative data in a safe environment. Document locking, backfill, rollback, and roll-forward risk.
- Define foreign keys, uniqueness, checks, and indexes where they enforce actual invariants/query paths.
- Use bounded queries and cursor pagination; do not load unbounded result sets.
- Use transactions when a use case must succeed or fail atomically.
- Preserve private application history when a public listing is edited, hidden, expired, or removed.
- Do not assume a migration is safely reversible after new production writes. Prefer expand → migrate/backfill → contract.

## 10. Security and privacy

- Enforce authentication, capabilities, and ownership on every protected server operation.
- Validate all untrusted inputs and use parameterized database operations.
- Apply layered rate limits to sensitive and abuse-prone endpoints.
- Store secrets only in environment/platform secret management. Never expose server credentials in browser bundles.
- Prevent private notes, applications, interviews, imports, and identifiers from leaking through responses, logs, caches, exports, analytics, or links.
- Validate upload type, signature/content, size, row/cell count, and processing time. Reject unsupported macro-enabled/encrypted spreadsheet formats.
- Add a regression test for every security fix.

## 11. Definition of done

A task is complete only when:

- its acceptance criteria are satisfied;
- formatting, lint, and TypeScript checks pass;
- relevant tests actually pass;
- error, boundary, and failure cases are handled;
- authorization, privacy, and data integrity are preserved;
- no secret or unrelated file was introduced;
- documentation/contracts/migrations/runbooks are updated where needed;
- the final diff was reviewed;
- the stable change was committed when authorized and feasible.

Generated code alone is never completion.

## 12. Required completion report

After every implementation task, report:

1. what changed;
2. why it was necessary;
3. important design decisions and trade-offs;
4. files added, changed, or removed;
5. tests executed with actual commands/results;
6. formatting, lint, and type-check results;
7. known limitations or outstanding risks;
8. commit hash/message, or why no commit was created;
9. the next logical implementation step.

**Guiding principle:** Optimize for correctness, clarity, maintainability, security, and incremental delivery. Every stable checkpoint must leave Orbit working and understandable.
