# Docker Guide 🚀

A practical, step‑by‑step guide to run, iterate, and troubleshoot this monorepo using Docker Compose. Designed to be safe, repeatable, and beginner‑friendly — with pro tips sprinkled in. 😊

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Services & Ports](#services--ports)
- [Quick Start](#quick-start)
- [Iterating on One Service](#iterating-on-one-service)
- [Logs, Shell, and Health Checks](#logs-shell-and-health-checks)
- [Database: Postgres & Redis](#database-postgres--redis)
- [Common Workflows](#common-workflows)
- [Safe Rebuilds & Cleanup](#safe-rebuilds--cleanup)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Overview

- Compose file: `docker/docker-compose.dev.yml`
- Spin up: gateway + user-auth + product + postgres + redis
- Code changes: rebuild only the changed service to save time

## Prerequisites

- Docker Desktop 4.x+ (or Docker Engine 24+)
- Compose v2 (already bundled with recent Docker Desktop)
- Ports available on host: `3000`, `4000`, `4001`, `15432`, `16379`

## Services & Ports

- gateway: `http://localhost:3000`
- user-auth: `http://localhost:4000`
- product: `http://localhost:4001`
- postgres: host port `15432` → container `5432`
- redis: host port `16379` → container `6379`

Tip: The gateway proxies API routes to services per `gateway/nginx.conf`.

## Quick Start

1. Build and start everything (detached):

```bash
docker compose -f docker/docker-compose.dev.yml up -d --build
```

2. Verify health:

```bash
curl http://localhost:4000/health   # user-auth
curl http://localhost:4001/health   # product
```

3. Tail logs (all):

```bash
docker compose -f docker/docker-compose.dev.yml logs -f
```

4. Stop everything:

```bash
docker compose -f docker/docker-compose.dev.yml down
```

Note: volumes are preserved by default (e.g., Postgres data).

## Iterating on One Service

When you change code in a single service, rebuild just that service to go faster.

- Rebuild + (re)start one service (with deps if needed):

```bash
docker compose -f docker/docker-compose.dev.yml up -d --build user-auth
```

- Rebuild one service without touching dependencies:

```bash
docker compose -f docker/docker-compose.dev.yml up -d --no-deps --build product
```

- Restart a service (no rebuild):

```bash
docker compose -f docker/docker-compose.dev.yml restart user-auth
```

- View only that service’s logs:

```bash
docker compose -f docker/docker-compose.dev.yml logs -f product
```

Pro tip 💡: For a clean image rebuild (ignoring cache): add `--build --no-deps --force-recreate` on that service.

## Logs, Shell, and Health Checks

- Tail all logs:

```bash
docker compose -f docker/docker-compose.dev.yml logs -f
```

- Tail a single service:

```bash
docker compose -f docker/docker-compose.dev.yml logs -f user-auth
```

- Open a shell inside a container:

```bash
docker compose -f docker/docker-compose.dev.yml exec user-auth sh
```

(Use `bash` if available; Alpine images often use `sh`.)

- Health check endpoints:

```bash
curl http://localhost:4000/health   # user-auth
curl http://localhost:4001/health   # product
```

## Database: Postgres & Redis

Postgres runs in the `postgres` service with a volume `pgdata`. Default credentials in compose:

- user: `postgresql`
- password: `charu`
- databases: `user_auth_db`, `product_db` (one DB per service)
- host (from other containers): `postgres`
- host (from your machine): `localhost:15432`

Updated approach 📝: Stronger isolation with one database per service. DATABASE_URL examples:

```
postgresql://postgresql:charu@postgres:5432/user_auth_db
postgresql://postgresql:charu@postgres:5432/product_db
```

### Ensure Databases Exist (first time)

On `docker compose up`, a small `db-init` helper service creates `user_auth_db` and `product_db` if they don't exist. If you started Postgres earlier and already have a data volume, you can also run this manually:

```bash
docker compose -f docker/docker-compose.dev.yml exec postgres \
  psql -U postgresql -d postgres -c "CREATE DATABASE user_auth_db" || true
docker compose -f docker/docker-compose.dev.yml exec postgres \
  psql -U postgresql -d postgres -c "CREATE DATABASE product_db" || true
```

### Inspect Tables & Run Queries

- Connect from your machine (psql installed locally):

```bash
psql "postgres://postgresql:charu@localhost:15432/user_auth_db"
psql "postgres://postgresql:charu@localhost:15432/product_db"
```

Inside psql (examples for user_auth_db):

```text
\dt                    -- list tables (public schema)
\d "User"             -- describe table (quoted if capitalized)
SELECT * FROM "User" LIMIT 5;
\q                      -- quit
```

- Or run psql inside the container:

```bash
docker compose -f docker/docker-compose.dev.yml exec postgres psql -U postgresql -d user_auth_db
```

### Running Prisma Commands (inside service containers)

- Generate client:

```bash
docker compose -f docker/docker-compose.dev.yml exec user-auth pnpm prisma generate
```

- Apply migrations (development):

```bash
docker compose -f docker/docker-compose.dev.yml exec user-auth pnpm run migrate:dev
```

- Deploy migrations (CI/prod‑like):

```bash
docker compose -f docker/docker-compose.dev.yml exec user-auth pnpm run migrate:deploy
```

Repeat similarly for `product` (generate/migrate against `schema=product`):

```bash
docker compose -f docker/docker-compose.dev.yml exec product pnpm prisma generate
docker compose -f docker/docker-compose.dev.yml exec product pnpm run migrate:dev
```

## Common Workflows

- Rebuild only the gateway after config change:

```bash
docker compose -f docker/docker-compose.dev.yml up -d --no-deps --build gateway
```

- Bring everything up fresh (recreate containers):

```bash
docker compose -f docker/docker-compose.dev.yml up -d --build --force-recreate
```

- Check resolved compose config (great for debugging env):

```bash
docker compose -f docker/docker-compose.dev.yml config
```

- See running containers:

```bash
docker compose -f docker/docker-compose.dev.yml ps
```

## Safe Rebuilds & Cleanup

- Stop services cleanly:

```bash
docker compose -f docker/docker-compose.dev.yml down
```

- Remove containers + anonymous networks (keeps volumes):

```bash
docker compose -f docker/docker-compose.dev.yml down --remove-orphans
```

- Remove volumes (⚠️ destructive: erases DB data):

```bash
docker compose -f docker/docker-compose.dev.yml down -v
```

- Remove dangling images (safe):

```bash
docker image prune -f
```

## Troubleshooting

- 🔌 Port already in use
  - Close apps listening on `3000/4000/4001/15432/16379` or change host ports in compose.

- 🔑 Database auth failures
  - Ensure service `DATABASE_URL` matches compose: user `postgresql`, password `charu`, db `appdb`.
  - Restart the service after edits: `docker compose -f docker/docker-compose.dev.yml up -d --no-deps --build user-auth`.

- 🐌 Containers not starting / crash loop
  - Inspect logs: `docker compose -f docker/docker-compose.dev.yml logs -f <service>`
  - Validate compose: `docker compose -f docker/docker-compose.dev.yml config`

- 🌐 Services can’t reach each other
  - Use service names as hosts (e.g., `postgres`, `redis`, `user-auth`, `product`).
  - Verify envs: `docker compose -f docker/docker-compose.dev.yml exec user-auth env | sort`

- 🔐 JWT issues
  - Ensure `JWT_SECRET` is set for `user-auth` during local dev.

- 🧹 Reset everything (destructive)
  - `docker compose -f docker/docker-compose.dev.yml down -v && docker compose -f docker/docker-compose.dev.yml up -d --build`

## FAQ

- Can I connect to Postgres from a GUI?
  - Yes. Use host `localhost`, port `15432`, user `postgresql`, password `postgresql`.

- How do I run only one service and DBs?
  - `docker compose -f docker/docker-compose.dev.yml up -d postgres redis user-auth`

- How do I proxy through the gateway in dev?
  - Start `gateway` (`:3000`) and call routes that map to `user-auth` or `product` per `gateway/nginx.conf`.

Happy shipping! ✨
