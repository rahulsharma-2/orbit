# ADR-0006: Application-managed opaque sessions

**Status:** Proposed

## Context and drivers

Orbit is browser-first, has one API, stores sensitive private career history, needs revocation/logout-everywhere, and has a tight budget. Social login/MFA are not confirmed MVP requirements.

## Options and trade-offs

- **Opaque DB sessions:** straightforward revocation and auditing; adds a database lookup and credential-handling responsibility.
- **JWT access + rotating refresh token:** useful across distributed APIs; complex revocation/reuse handling with little MVP benefit.
- **Managed identity:** reduces credential lifecycle work and adds MFA/OAuth; cost, vendor coupling, webhook/state integration, and UX constraints.

## Proposed decision

Store Argon2id password hashes and hashed opaque session tokens in PostgreSQL. Use host-only Secure/HttpOnly/SameSite cookies, Origin checks plus CSRF token, verification/recovery tokens that are hashed and single-use, and revocation on sensitive changes.

## Consequences

Immediate revocation and simple browser behavior. The application owns password security, recovery, email deliverability, abuse defenses, and session cleanup.

## Risks and mitigation

Calibrate Argon2id, run auth abuse/isolation tests, keep generic responses, rate-limit account + IP, audit session lifecycle, and review topology before final cookie settings.

## Reconsider when

OAuth/MFA/enterprise SSO becomes a launch requirement, auth incidents/maintenance exceed managed-provider cost, or APIs become independently distributed.
