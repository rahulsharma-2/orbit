# Authentication, authorization, and threat model

## Chosen authentication model

Use application-managed opaque sessions for the MVP.

1. Passwords use Argon2id with parameters calibrated on production-class hardware and a per-password salt; optionally add a server-side pepper stored in secret management.
2. Login creates 256-bit random token; only its SHA-256 digest is stored in `Session` with user, expiry, device metadata, and revocation fields.
3. Browser receives `__Host-orbit_session` as `Secure`, `HttpOnly`, `Path=/`, `SameSite=Lax`; avoid a broad `Domain` attribute. Production web/API topology must preserve a safe same-site arrangement.
4. Proposed lifetime: 7-day idle, 30-day absolute. Rotate on login, password reset, privilege change, and periodically; revoke all sessions on password reset.
5. Unsafe requests require a valid Origin/Referer allowlist and a CSRF token bound to the session. SameSite is defense-in-depth, not the only defense.

Why not JWT access/refresh tokens? Orbit has one API, browser clients, and immediate revocation requirements. Database-backed sessions are simpler to invalidate and audit. JWTs would add rotation/reuse-detection complexity without removing a datastore lookup because authorization still needs current user state.

A managed identity provider remains a valid alternative if social login, MFA, or reduced credential liability outweighs cost/vendor coupling. OAuth and MFA are V1 candidates.

## Account lifecycle

- Registration always returns a non-enumerating response; email verification tokens are random, single-use, hashed, short-lived.
- Recovery responses do not reveal account existence; tokens are hashed, single-use, 15–30 minutes, and revoke sessions after successful reset.
- Login errors are generic. Apply IP + normalized-account throttles, increasing delay, and security-event logging without storing raw credentials.
- Logout revokes current session; “logout everywhere” revokes all. Role/status changes invalidate affected sessions.
- Secrets live in platform secret storage, are scoped by environment, never prefixed/exposed to the browser, and have an owner/rotation runbook.

## Authorization model

- Default deny. Guards authenticate; application services authorize capability and ownership; repositories require `ownerId` for private operations.
- Contributor is a capability (`canPublish`, suspension/reputation state), not a permanent global role.
- Moderators access public listing/report evidence only. Private applications, interviews, notes, and imports are outside their role.
- Admin privilege changes and any approved break-glass data action require reauthentication, reason, audit, and alerting.
- Never accept `userId` from a private-resource request body. Derive it from the session.

## Prioritized threat model

| Priority | Threat / likely path | Impact | Controls and verification |
|---|---|---|---|
| P0 | IDOR by changing application/import/note ID | Private career history disclosure | owner-scoped repositories; non-disclosing responses; cross-user API tests for every private resource |
| P0 | Account takeover via credential stuffing/recovery abuse | Full private-data compromise | Argon2id; dual-key throttles; non-enumeration; token hashing; session revocation; alert anomalies |
| P0 | Stored XSS in listing/note/company fields | Session actions/data theft | plain text by default; React escaping; no raw HTML; CSP; URL allowlist; XSS regression payloads |
| P0 | Broken moderation/admin authorization | Platform trust damage/data access | explicit capabilities; audited actions; no private data scope; role-change tests |
| P1 | Spam/phishing/malicious job URLs | User harm and feed degradation | verified email; HTTPS only; visible destination domain; throttles; reports; quarantine/suspension; no server fetching |
| P1 | CSV formula injection | Code/data exfiltration when export opens | prefix risky cells with `'`; regression fixtures; warn on import/export |
| P1 | Import parser/resource exhaustion | Availability/cost incident | 5 MB/5k rows; MIME + signature check; reject macro-enabled/encrypted workbooks; time/row/cell limits; bounded concurrency |
| P1 | CSRF/session fixation | Unauthorized state changes | host-only secure cookie; Origin + CSRF token; rotate session; CORS allowlist |
| P1 | SQL injection/mass assignment | Data compromise | parameterized Prisma/raw SQL; DTO allowlists; unknown-field rejection; reviewed raw migrations |
| P1 | Secrets/PII in logs or errors | Credential/privacy breach | structured allowlist logging; redact cookies/tokens/email/note bodies; safe error envelope; secret scanning |
| P2 | SSRF through source URLs | Cloud metadata/internal network compromise | API does not fetch user URLs; future fetcher isolated with DNS/IP/redirect controls |
| P2 | Dependency/supply-chain compromise | Build/runtime compromise | lockfile, minimal dependencies, Renovate/Dependabot, audit, provenance where available, protected CI secrets |

## Security checklist

- [ ] TLS only; HSTS after domain validation; secure headers and strict CSP with no unsafe inline/eval.
- [ ] DTO size/shape validation and output encoding; no arbitrary HTML.
- [ ] URL parser allows `https`, rejects credentials/private schemes; UI shows destination hostname.
- [ ] Upload signatures/types, row/cell/size/time limits; archive-bomb and macro formats rejected.
- [ ] Parameterized queries; raw SQL reviewed; least-privilege runtime/migration database roles if platform permits.
- [ ] CSRF, CORS, cookie, session rotation, throttling, and non-enumeration integration tests.
- [ ] Cross-user isolation test matrix for every private endpoint.
- [ ] Logs, traces, analytics, and error events exclude private notes and tokens.
- [ ] Secret/dependency/container scanning blocks critical known issues or records time-bounded exception.
- [ ] Data export/deletion and backup-expiry behavior documented in privacy policy.
- [ ] Incident contacts, token/session revocation, rollback, restore, and user-notification procedure rehearsed.
