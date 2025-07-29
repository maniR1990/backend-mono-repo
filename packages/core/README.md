# `@mani-r16-devkit/core`

Utilities and helpers shared across backend services.
Currently this package only contains placeholder files but will eventually host
things like logging wrappers and common response helpers.

## PNPM Commands

```bash
pnpm --filter @mani-r16-devkit/core build   # compile TypeScript
pnpm --filter @mani-r16-devkit/core lint    # run ESLint (when implemented)
```

Build everything in the workspace:

```bash
pnpm build
```

## Docker

The package itself does not run in a container, but you can start the services that depend on it using the root compose file:

```bash
docker compose -f docker/docker-compose.dev.yml up --build
```

Check running containers and logs when debugging:

```bash
docker compose ps
docker compose logs -f user-auth
```

## Environment Variables

If environment variables are missing inside a container, inspect them with:

```bash
docker compose exec user-auth env
```

This package is published as part of the monorepo and can be imported by other packages or services.
