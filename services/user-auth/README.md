# UserAuth

Fastify-based authentication service.

## Docker

Run all services together with their dependencies from the repository root:

```bash
docker compose -f docker/docker-compose.dev.yml up --build
```

Troubleshoot the running container:

```bash
docker compose logs -f user-auth
docker compose ps
```

## PNPM Commands

Start the service in watch mode:

```bash
pnpm --filter ./services/user-auth dev
```

Build the service:

```bash
pnpm --filter ./services/user-auth build
```

Run tests:

```bash
pnpm --filter ./services/user-auth test
```

These scripts are defined in `package.json` and leverage `tsx` and `esbuild` for a fast workflow.

## Post-install Steps

### Prisma

```bash
npx prisma init            # creates prisma/schema.prisma & .env
npm run migrate            # runs first migration & seeds DB
```

### Husky + lint-staged

```bash
npm run prepare
npx husky add .husky/pre-commit "npx lint-staged"
```

Add to `package.json`:

```jsonc
"lint-staged": {
  "*.ts": ["eslint --fix", "prettier --write"]
}
```

## Development

Start the dev server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## Environment Variables

This service reads configuration from a `.env` file. To verify the values while running with Docker:

```bash
docker compose exec user-auth env | grep PORT
docker compose config | grep DATABASE_URL
```

## Runtime Dependencies

```json
{
  "dependencies": {
    // ── Fastify core ───────────────
    "fastify": "^5.0.0",
    "@fastify/jwt": "^9.0.0",
    "@fastify/cookie": "^9.0.0",
    "@fastify/rate-limit": "^8.0.0",

    // ── Validation & config ────────
    "zod": "^3.24.4",
    "dotenv": "^16.4.1",

    // ── Database & cache ───────────
    "@prisma/client": "^5.0.0",
    "redis": "^5.4.3",

    // ── Auth & crypto ──────────────
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",

    // ── Observability (optional but recommended) ──
    "@opentelemetry/api": "^1.8.0",
    "@opentelemetry/sdk-node": "^0.50.0",
    "@opentelemetry/instrumentation-fastify": "^0.50.0"
  }
}
```

## Development Dependencies

```json
{
  "devDependencies": {
    // ── TypeScript tool-chain ───────
    "typescript": "^5.5.0",
    "@types/node": "^20.11.1",
    "ts-node": "^10.9.2",

    // fast reload / build
    "esbuild": "^0.23.0",
    "tsx": "^4.7.0", // tiny TS runner (alternative to nodemon + ts-node-dev)

    // ── Prisma CLI ────────────────
    "prisma": "^5.0.0",

    // ── Testing ───────────────────
    "vitest": "^1.5.2",
    "supertest": "^6.4.2",
    "@types/supertest": "^2.0.15",

    // ── Lint / format / hooks ────
    "eslint": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "prettier": "^3.3.0",
    "husky": "^9.0.9",
    "lint-staged": "^15.2.0"
  }
}
```
