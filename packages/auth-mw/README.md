# `@mani-r16-devkit/auth-mw`

Fastify middleware for handling JWT authentication. The implementation is still
minimal but will provide hooks for verifying tokens and protecting routes.

## PNPM Commands

```bash
pnpm --filter @mani-r16-devkit/auth-mw build   # compile TypeScript
pnpm --filter @mani-r16-devkit/auth-mw test    # run unit tests
```

Build the entire workspace:

```bash
pnpm build
```

## Docker

Run the full stack via Docker Compose when developing services that use this middleware:

```bash
docker compose -f docker/docker-compose.dev.yml up --build
```

Check container status and logs:

```bash
docker compose ps
docker compose logs -f user-auth
```

## Environment Variables

Verify environment variables inside a running container if middleware complains about missing secrets:

```bash
docker compose exec user-auth env
```

This package expects `fastify` and `@fastify/jwt` as peer dependencies.
