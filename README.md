# Orbit

Orbit is a community-powered job discovery and private career-tracking product.

The initial engineering foundation is under active development. Product behavior remains governed by the planning documents and proposed ADRs below.

All future implementation work must follow the repository-wide [engineering standards](AGENTS.md).

## Review order

1. [Planning status and decisions](docs/00-planning-status.md)
2. [Product scope and requirements](docs/product/01-scope-and-requirements.md)
3. [Architecture summary](docs/architecture/01-architecture-summary.md)
4. [Domain model](docs/architecture/03-domain-model.md)
5. [Security plan](docs/security/01-auth-and-threat-model.md)
6. [Roadmap](docs/product/02-roadmap.md)
7. [Open questions](docs/99-open-questions.md)

Draft Architecture Decision Records live in [`docs/adr`](docs/adr). They are proposals, not accepted decisions.

## Local foundation

Use Node.js 24.22.1 and pnpm 12.15.0.

```bash
pnpm install
pnpm db:up
pnpm db:migrate:deploy
pnpm dev
```

- Web: `http://localhost:3000`
- API liveness: `http://localhost:4000/api/v1/health/live`
- API readiness: `http://localhost:4000/api/v1/health/ready`
- PostgreSQL: `localhost:5432` using the local-only credentials in `infrastructure/compose.local.yml`

Copy `.env.example` to `.env` for local configuration. Never commit `.env` files.

Run the complete local quality gate with:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
