# Proposed folder structure

Create folders only as implementation requires them; this is a target map, not a request for empty scaffolding.

```text
orbit/
├── apps/
│   ├── web/
│   │   ├── src/app/                 # routes/layouts only
│   │   ├── src/features/            # listing, application, import workflows
│   │   ├── src/components/ui/       # product-agnostic accessible primitives
│   │   ├── src/components/layout/   # navigation and page shells
│   │   ├── src/lib/api/             # generated client wrapper and errors
│   │   ├── src/lib/auth/            # browser/server auth helpers, no policy
│   │   ├── src/styles/              # tokens and global styles
│   │   └── tests/e2e/
│   └── api/
│       ├── src/main.ts
│       ├── src/app.module.ts
│       ├── src/common/              # cross-cutting guards, errors, logging
│       ├── src/config/              # validated runtime configuration
│       ├── src/infrastructure/      # Prisma, email, clock, IDs
│       ├── src/modules/
│       │   ├── identity/
│       │   ├── companies/
│       │   ├── listings/
│       │   ├── applications/        # includes interviews/notes initially
│       │   ├── imports/
│       │   └── moderation/
│       ├── prisma/schema.prisma
│       ├── prisma/migrations/
│       └── test/
├── packages/
│   ├── contracts/                   # API schemas/types; browser-safe
│   ├── eslint-config/               # only once duplication exists
│   └── tsconfig/                    # only once duplication exists
├── docs/{product,architecture,security,operations,adr}/
├── scripts/                         # reviewed operational/dev scripts
├── infrastructure/                  # deployment descriptors, when chosen
└── .github/workflows/               # CI/CD
```

## Dependency rules

| Area | Belongs here | Must not live here | Allowed dependencies |
|---|---|---|---|
| `web/app` | routing, metadata, layouts, composition | business rules, raw fetch calls | features, UI, API layer |
| `web/features` | product workflows and feature-local view models | backend persistence assumptions | UI, contracts, API layer |
| `web/components/ui` | accessible reusable primitives | job/application concepts | tokens and small UI utilities |
| `api/common` | truly cross-cutting transport concerns | domain-specific helpers dumping ground | infrastructure abstractions, Nest |
| `api/modules/*` | controllers, application/domain services, owned persistence adapters | direct writes to another module’s tables | common, infrastructure ports, contracts; other modules only via exported interface |
| `api/infrastructure` | database/email/logging implementations | product orchestration | third-party libraries and defined ports |
| `contracts` | schemas, enums intended for wire format, error shapes | Prisma entities, secrets, Nest/Next imports | validation library only |
| `scripts` | repeatable migrations/maintenance/dev automation | hidden production business logic | documented CLIs/APIs |
| `infrastructure` | deploy/runtime configuration | application source or secrets | deployment platform conventions |

Interviews and notes begin inside `applications` because their lifecycle and authorization are inseparable. Split them only if they develop independent rules. `search` is a capability inside listing/application queries, not an empty module. This keeps the folder tree honest.

## Testing and extraction support

- Domain/application services accept ports for clock, IDs, email, and owned repositories; unit tests avoid Nest bootstrapping.
- Each module has integration tests against real PostgreSQL and API tests at its boundary.
- Import and notification runners call the same public application services used by HTTP, preserving rules.
- Import rules across module public interfaces, never filesystem shortcuts such as `../../listings/repository`.
