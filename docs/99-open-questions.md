# Open questions, risks, and approval checklist

## P0 — answer before implementation

1. **Audience and legal:** Is launch India-only? What minimum age, privacy policy, terms, grievance/contact process, and deletion promise apply?
2. **MVP priority:** If one month becomes tight, may XLSX be deferred while CSV ships, or is XLSX a hard launch gate?
3. **Accounts:** Is email/password sufficient? Is email verification required before saving privately, or only before public contribution?
4. **Listing policy:** Who may publish, is publication immediate, which sources/domains are prohibited, and what is the default expiry window?
5. **Data retention:** On account deletion, should public contributions be anonymized or removed? How long may moderation audit/import diagnostics/backups retain identifiers?
6. **Brand/domain:** What production domains will web and API use? This affects cookie, CORS, CSP, email deliverability, and deployment configuration.
7. **Import compatibility:** Which existing spreadsheet templates/columns/date formats must work? Representative sanitized files are required for acceptance fixtures.
8. **Budget posture:** Is ₹5,000 a hard all-in cap including tax/domain/email, or an infrastructure target with limited launch overage?

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
