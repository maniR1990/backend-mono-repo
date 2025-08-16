# Backend Mono Repo

A collection of backend services and shared packages built with **Fastify**. The repository is powered by **pnpm** workspaces and **turborepo** to orchestrate tasks across packages.

## Table of Contents

- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Docker](#docker)
- [PNPM Commands](#pnpm-commands)
- [Development Workflow](#development-workflow)
- [Environment Variables](#environment-variables)
- [Packages](#packages)
- [Health Check](#health-check)
- [Auth Service Routes](#auth-service-routes)
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

## Docker

Run all services along with their dependencies using Docker Compose:

```bash
docker compose -f docker/docker-compose.dev.yml up --build
```

Stop and remove the containers when finished:

```bash
docker compose -f docker/docker-compose.dev.yml down
```

Useful commands when troubleshooting:

```bash
docker compose ps              # list running containers
docker compose logs -f <svc>   # view logs for a service
docker images                  # list images
docker container ls            # list running containers
```

## PNPM Commands

- Build every package and service:
  ```bash
  pnpm build
  ```
- Start all services in watch mode:
  ```bash
  pnpm dev
  ```
- Run a single service by filtering:
  ```bash
  pnpm --filter ./services/user-auth dev
  ```
- Execute a command across all workspaces:
  ```bash
  pnpm -r exec -- pwd
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

## Environment Variables

Application configuration is loaded from environment variables. Create a `.env` file in each service directory or supply values through Docker Compose. If variables do not seem to load, use the following commands to inspect them:

```bash
printenv DATABASE_URL                  # check locally
docker compose exec user-auth env      # inspect inside the container
docker compose config                  # view resolved compose config
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

## Auth Service Routes

In addition to `/health` (shown above), the `user-auth` service exposes the following routes:

```bash
# Sign up a new user
curl -X POST http://localhost:4000/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret","profile":{}}'

# Log in to receive a token
curl -X POST http://localhost:4000/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret"}'

# Get current user (requires JWT token)
curl http://localhost:4000/v1/me \
  -H "Authorization: Bearer <TOKEN>"
```

## Further Reading

See [docs/PNPM_GUIDE.md](docs/PNPM_GUIDE.md) for more detailed `pnpm` commands and tips.
