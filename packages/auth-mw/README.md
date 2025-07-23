# `@mani-r16-devkit/auth-mw`

Fastify middleware for handling JWT authentication.  The implementation is still
minimal but will provide hooks for verifying tokens and protecting routes.

## Scripts

```bash
pnpm --filter @mani-r16-devkit/auth-mw build   # compile TypeScript
pnpm --filter @mani-r16-devkit/auth-mw test    # run unit tests
```

This package expects `fastify` and `@fastify/jwt` as peer dependencies.
