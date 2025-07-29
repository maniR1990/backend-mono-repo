# Backend Mono Repo

A collection of backend services and shared packages built with **Fastify**. The repository is powered by **pnpm** workspaces and **turborepo** to orchestrate tasks across packages.

## Table of Contents

- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Packages](#packages)
- [Health Check](#health-check)
- [Further Reading](#further-reading)

## Folder Structure

```text
.
├── docker/        # Docker compose files for local dependencies
├── packages/      # Reusable packages shared across services
│   ├── auth-mw/   # Authentication middleware (Fastify JWT)
│   └── core/      # Core utilities (logger, helpers)
├── services/      # Independent microservices
│   └── user-auth/ # Fastify based authentication service
├── package.json   # Root workspace scripts
└── pnpm-workspace.yaml
```

- **packages/** holds libraries that can be versioned and published independently.
- **services/** contains runnable applications. Each service can be developed and deployed separately.
- **docker/** provides a `docker-compose` setup with Postgres and Redis for local development.

## Getting Started

1. Install dependencies for all workspaces:
   ```bash
   pnpm install
   ```
2. Start development servers for all services:
   ```bash
   pnpm dev
   ```
   Use `pnpm --filter <service> dev` to start a single service.
3. Build all services when preparing for deployment:
   ```bash
   pnpm build
   ```

## Development Workflow

- **Lint** the project and automatically fix issues:
  ```bash
  pnpm lint
  ```
- **Format** the codebase using Prettier:
  ```bash
  pnpm format
  ```
- **Run tests** for every workspace:
  ```bash
  pnpm test
  ```

## Packages

The shared packages declare peer dependencies:

- `@mani-r16-devkit/auth-mw` → expects `fastify` and `@fastify/jwt`.
- `@mani-r16-devkit/core` → expects `fastify`.

Ensure these peer dependencies are available when consuming the packages outside the monorepo.

## Health Check

The `user-auth` service exposes a simple endpoint:

```bash
curl http://localhost:4000/health
```

Response:

```json
{ "status": "ok", "data": { "uptime": 0 }, "meta": { "trace_id": null } }
```

## Further Reading

See [docs/PNPM_GUIDE.md](docs/PNPM_GUIDE.md) for more detailed `pnpm` commands and tips.
