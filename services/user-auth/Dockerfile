# syntax=docker/dockerfile:1.7

# ---------- base ----------
FROM node:20-slim AS base
WORKDIR /app

# Use Corepack-managed pnpm (avoid global npm install; no EEXIST)
ENV COREPACK_ENABLE_DOWNLOADS=1 PNPM_VERSION=9.12.3 \
    PNPM_HOME=/root/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

# Prisma needs OpenSSL at runtime/build time
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# ---------- deps (install only what auth needs) ----------
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY services/user-auth/package.json services/user-auth/package.json
# If you have shared packages, add their manifests too:
# COPY packages/*/package.json packages/*/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm fetch --filter ./services/user-auth...

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --filter ./services/user-auth... --offline

# ---------- dev/runtime ----------
FROM base AS dev
WORKDIR /app

COPY . .

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --filter ./services/user-auth...

WORKDIR /app/services/user-auth
EXPOSE 4000
CMD ["pnpm","run","dev"]
