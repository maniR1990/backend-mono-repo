# PNPM Workflow Guide

Welcome to the **Backend Mono Repo**. This document collects common `pnpm` commands and tips for working with the workspace. Use the table of contents to navigate.

## Table of Contents

- [Install Dependencies](#install-dependencies)
- [Development Server](#development-server)
- [Linting & Formatting](#linting--formatting)
- [Build & Test](#build--test)
- [Working with Packages](#working-with-packages)
- [Peer Dependencies](#peer-dependencies)

## Install Dependencies

Run the following at the repository root to install all packages:

```bash
pnpm install
```

## Development Server

Start every service in watch mode:

```bash
pnpm dev
```

To run a single service only, filter by its folder:

```bash
pnpm --filter ./services/user-auth dev
```

## Linting & Formatting

- Lint all TypeScript files and automatically fix problems:

```bash
pnpm lint
```

- Check lint errors without fixing (useful in CI):

```bash
pnpm lint:ci
```

- Format the entire repo with Prettier:

```bash
pnpm format
```

- Verify formatting without writing changes:

```bash
pnpm format:check
```

## Build & Test

- Build all services:

```bash
pnpm build
```

Use this before deployment or when you want compiled output in the `dist` folders.

- Run the test suites for every workspace:

```bash
pnpm test
```

## Working with Packages

Add a dependency to a specific workspace using the `--filter` flag:

```bash
pnpm add <package> --filter ./services/user-auth --workspace
```

You can also execute a command in every workspace using `-r` (recursive):

```bash
pnpm -r exec -- pwd
```

## Peer Dependencies

The shared packages in `packages/` define peer dependencies:

- **@mani-r16-devkit/auth-mw** expects `fastify` and `@fastify/jwt`.
- **@mani-r16-devkit/core** expects `fastify`.

When consuming these packages outside the monorepo, ensure those peer dependencies are installed in your project.
