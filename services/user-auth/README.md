# UserAuth

Fastify-based authentication service.

## Available Scripts

```jsonc
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "esbuild src/main.ts --bundle --platform=node --target=node20 --outfile=dist/main.js",
    "start": "node dist/main.js",
    "migrate": "prisma migrate dev --name init",
    "generate": "prisma generate",
    "test": "vitest",
    "prepare": "husky install",
  },
}
```

- `type: module` lets you use native ESM imports.
- `dev` uses tsx for super-fast reloads.
- `build` bundles into a single file with esbuild.

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

pnpm commands.

pnpm -r exec -- pwd
ppnpm add @mani-r16-devkit/core --filter ./services/user-auth --workspace
pnpm add @mani-r16-devkit/auth-mw --filter ./services/user-auth --workspace

pnpm install
pnpm turbo run build # builds packages then services
