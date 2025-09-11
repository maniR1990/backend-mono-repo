# syntax=docker/dockerfile:1.7

# ---------- base ----------
FROM node:20-slim AS base
WORKDIR /app

# Use Corepack-managed pnpm (no global npm install to avoid EEXIST)
ENV COREPACK_ENABLE_DOWNLOADS=1 PNPM_VERSION=9.12.3 \
    PNPM_HOME=/root/.local/share/pnpm
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

# Prisma needs OpenSSL at runtime/build time
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# ---------- deps (install only what product needs) ----------
FROM base AS deps
# Copy only manifests so this layer stays cached on code changes
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY services/product/package.json services/product/package.json
# If you have shared packages, add their package.json lines here:
# COPY packages/*/package.json packages/*/package.json

# Pre-fetch dependency tarballs into the pnpm store (cached by BuildKit)
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm fetch --filter ./services/product...

# Materialize node_modules for product from the store (offline)
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --filter ./services/product... --offline

# ---------- dev/runtime ----------
FROM base AS dev
WORKDIR /app

# Bring in the full repo AFTER deps so cache survives edits
COPY . .

# Link workspaces quickly using the cached store
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --filter ./services/product...

WORKDIR /app/services/product
EXPOSE 4001
CMD ["pnpm","run","dev"]
