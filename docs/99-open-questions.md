# Open questions, risks, and approval checklist

## P0 — answer before implementation

1. **Partly resolved — audience and legal:** India-first with a globally usable model is approved. Minimum age, privacy policy, terms, grievance/contact process, and exact deletion timing remain open before public launch.
2. **Resolved — MVP priority:** CSV and XLSX are both MVP requirements.
3. **Resolved — accounts:** Email/password is approved; verification is required before public contribution, not before private tracking.
4. **Partly resolved — listing policy:** Verified users may publish immediately with safeguards. Prohibited sources/domains and default expiry remain open before listing implementation.
5. **Partly resolved — data retention:** Delete private career data and anonymize retained public contributions. Exact retention for audit, import diagnostics, and backups remains open.
6. **Deferred — brand/domain:** Finalize production web/API domains before staging; local foundation work may proceed.
7. **Open — import compatibility:** Representative sanitized spreadsheets, expected columns, and date formats are required before import implementation.
8. **Resolved — budget posture:** ₹5,000/month is an infrastructure target excluding domain registration and taxes.

## P1 — decide during implementation

- Exact Kanban stages/transitions and whether users can customize them.
- Remote/location taxonomy, salary/currency representation, experience and employment type vocabularies.
- Listing edit rights and history; contributor attribution/privacy.
- Moderator staffing, target review time, appeals, emergency hide threshold, and admin break-glass policy.
- Availability/RPO/RTO targets and whether entry managed-database backups satisfy launch requirements.
- Search expectations: prefix/typo matching, relevance sorting, and whether company aliases are needed at launch.
- Export formats and inclusion/exclusion of notes/interviews/private fields.
- Accessibility test devices and supported browser matrix approval.

## Top unresolved risks

| Risk | Effect | Mitigation / decision trigger |
|---|---|---|
| Scope exceeds one developer-month | late or unsafe launch | protect core loop; apply documented cut order; weekly exit review |
| Spreadsheet variability | import defects/support burden | obtain real samples; strict limits; versioned mapping; downloadable errors |
| Community spam/phishing | user harm and lost trust | verified publication, quotas, clear source domain, moderation, no URL fetching |
| Private-data authorization bug | severe privacy incident | owner-scoped repositories and exhaustive cross-user tests |
| Low-cost database limitations | weak recovery/performance | validate backup/PITR/connection/storage terms; conduct restore spike before launch |
| Auth/email deliverability | blocked signup/recovery | configure SPF/DKIM/DMARC; provider sandbox test; resend/status handling |
| Premature framework complexity | missed product learning | enforce module boundaries without generic repositories/event buses/Redis |

## Approval checklist

- [ ] MVP/V1/future scope and cut order
- [ ] P0 answers and initial NFR assumptions
- [ ] Domain model, deletion/retention policy, import limits
- [ ] Auth/session model and role/capability boundaries
- [ ] Deployment provider and verified backup/cost terms
- [ ] All 12 draft ADRs moved individually to Accepted or revised
