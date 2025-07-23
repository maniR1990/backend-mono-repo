# Backend Mono Repo

This repository hosts a collection of backend services and shared libraries.  It is organised as a **pnpm** monorepo using **turborepo** for task orchestration.  At the moment it only contains a few skeleton packages and one service, but it serves as a starting point for a larger microservice architecture.

## Folder structure

```
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

## Getting started

1. Install dependencies for all workspaces:

   ```bash
   pnpm install
   ```

2. Start development servers for all services:

   ```bash
   pnpm dev
   ```

   This runs the `dev` script in each service in parallel. Individual services can be started with `pnpm --filter <service> dev`.

3. Build all services:

   ```bash
   pnpm build
   ```

## Current status

The code base is still at an early stage. Many packages contain placeholders or empty files that will be fleshed out as development continues. See the README in each package or service for more details.

