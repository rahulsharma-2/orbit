# Estimated monthly infrastructure cost

**Planning date:** 2026-10-28. Prices change; re-check before purchase. Estimates use a deliberately rounded **₹90/USD** planning rate and exclude domain registration, GST/VAT, overages, and payment FX fees.

## Recommended production baseline

| Item | Assumption | Monthly estimate |
|---|---|---:|
| Next.js web | Render 1 GB service, approximately $19 | ₹1,710 |
| NestJS API | Render 1 GB service, approximately $19 | ₹1,710 |
| PostgreSQL | Entry paid managed tier, plan approximately $6 plus storage | ₹540–₹800 |
| Error tracking | Free tier initially | ₹0 |
| Transactional email | Free/low-volume tier initially | ₹0–₹500 |
| Object storage/CDN | Not required for MVP documents; tiny optional backup usage | ₹0–₹200 |
| **Expected total** | before taxes/domain/overages | **₹3,960–₹4,920** |

Render lists static sites as free and compute tiers around $6 for 256 MB and $19 for 1 GB; actual Node memory must be measured before downgrading. Its database storage, bandwidth, and backup/PITR terms must be verified during provisioning. [Official Render pricing](https://render.com/pricing)

## Cost pressure and alternatives

- A static/client-heavy web deployment could reduce frontend compute, but dynamic public SEO and Next.js runtime behavior must be proven before choosing it.
- Vercel lists Hobby at $0 and Pro at $20; Hobby is suitable for personal projects, while commercial/product use and overages need terms review. Pro plus API/database may breach the target. [Official Vercel pricing](https://vercel.com/pricing)
- Cloudflare Pages/Workers can be inexpensive, but adapting a full Next runtime and splitting operational tooling adds migration/testing work. Use only after a deployment spike proves compatibility. [Official Cloudflare Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/)
- A single VPS is cheaper but transfers patching, firewalling, database backup, restore, and availability work to one engineer. It is not the default recommendation for this month-long MVP.

## Budget controls

- Platform spend alerts at 50%, 80%, and 100% of ₹5,000; hard caps where supported.
- No Redis, message broker, Kubernetes, paid analytics, always-on staging, or object storage until a concrete need exists.
- Staging can use free/on-demand services outside release windows, but production must not rely on sleep-to-zero behavior if availability matters.
- Reforecast at 1k users, when DB storage exceeds 70%, or when bandwidth/compute overages exceed 20% of base cost for two months.
