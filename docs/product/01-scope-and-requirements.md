# Product scope and requirements

## Product outcome

Orbit should let a job seeker move through one dependable loop:

> discover a trustworthy-enough opportunity → save/apply → track progress → search history → learn or reapply

Community contribution supports that loop; it is not a social network in the MVP.

## Personas and permissions

| Persona | Capabilities |
|---|---|
| Anonymous visitor | Browse/search active public listings; view listing details |
| Authenticated user | All anonymous actions; save listings; manage only their own applications, interviews, notes, imports, exports; report listings |
| Contributor | A verified user allowed to submit public listings; capability may be throttled/suspended |
| Moderator | Review reports; hide/restore/merge listings; view moderation evidence; never browse private career data by default |
| Administrator | Manage roles/suspensions and operational policy; audited break-glass access only where explicitly implemented |

## MVP: must ship

### Authentication and account

- Register, verify email, sign in, sign out everywhere, recover password.
- View/delete account and export private career data.
- Acceptance: an expired/revoked session cannot access authenticated endpoints; another user’s object ID always yields a non-disclosing `404` or `403` according to policy.

### Public listings

- Browse a cursor-paginated feed; search title/company; filter by location, work mode, employment type, freshness.
- Submit an original source URL and structured job details.
- Normalize URLs and warn/block likely duplicates; clearly label submitter and source.
- Acceptance: inactive/expired/hidden listings do not appear in the default feed; duplicate overrides are recorded; unsafe URL schemes are rejected.

### Private application workspace

- Save a public listing into a private `JobApplication`, or create a private application manually.
- Kanban stages: `SAVED`, `APPLIED`, `SCREENING`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN`, `ARCHIVED`.
- Track application date, stage history, interview events, outcome, and plain-text notes.
- Acceptance: drag/drop is keyboard-accessible and persists only allowed transitions; source listing edits do not rewrite the user’s application snapshot.

### Import/export and history

- CSV/XLSX upload, sheet selection, column mapping, preview, row validation, confirm, and result summary.
- Idempotent retry using file hash plus user/batch key; valid rows may be committed in chunks with exact error reporting.
- Search/filter the user’s own historical applications; export CSV/XLSX with formula-injection protection.
- Acceptance: a failed row never silently disappears; retry never duplicates already committed rows; exports beginning with `=`, `+`, `-`, or `@` are escaped.

### Trust, moderation, and administration

- Report duplicate, expired, misleading, suspicious, or broken listings.
- Moderator queue with resolve/dismiss/hide/merge actions and immutable audit entries.
- Acceptance: repeated reports do not expose reporter identity publicly; every state-changing moderator action records actor, timestamp, reason, target, and before/after summary.

### UX and engineering quality

- Mobile/tablet/desktop; light/dark/system theme; WCAG 2.2 AA target for core journeys.
- Consistent loading, empty, success, validation, offline-ish/network error, and retry states.
- CI, automated tests, structured logs, error tracking, backups, migration and rollback runbooks.

## V1: after MVP stability

- Saved searches and in-app/email notifications.
- Contributor profiles/reputation and curated collections.
- Better duplicate scoring and company normalization.
- Bulk application actions and richer analytics.
- Object storage for documents, with malware scanning and retention controls.
- Optional OAuth sign-in; stronger moderator tooling.

## Future, explicitly excluded

- Gmail synchronization; browser scraping; automatic third-party ingestion.
- AI recommendations, copilots, CV scoring, or generated outreach.
- Following, communities, comments, messaging, employer ATS/tools, verified company portals.
- Native mobile apps, microservices, Kafka, Kubernetes, service mesh, distributed transactions.
- Arbitrary HTML/rich text, document uploads, notifications, or integrations in MVP.

## Key workflows and acceptance criteria

| Workflow | Happy path | Required failure behavior |
|---|---|---|
| Save listing | Creates private application with listing snapshot | Repeated request returns existing record or a deterministic conflict |
| Move card | Validates stage and records stage event atomically | Stale version returns `409`, UI refreshes rather than overwriting |
| Import | Map → preview → confirm → summary | Batch is resumable; row errors are downloadable and private |
| Submit listing | Normalize → duplicate check → publish/pending | Rate limit and suspicious patterns return actionable errors |
| Moderate | Review evidence → act with reason | Unauthorized access denied and logged; action remains auditable |
| Delete account | Reauthenticate → schedule/delete private data | Public contributions are anonymized or retained per approved policy |
