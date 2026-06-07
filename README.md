# Battery ERP Platform

A Turborepo monorepo for the Battery ERP platform, built to support a frontend, backend, shared packages, and infrastructure in one repository.

## Complete project folder structure

Root:

- `battery-erp-platform/`
  - `apps/` — application entry points.
    - `apps/web/` — the Next.js frontend application.
    - `apps/api/` — the Express/Node.js backend API service.

  - `packages/` — reusable shared packages.
    - `packages/ui/` — UI components, design tokens, and shared styling utilities.
    - `packages/shared/` — shared domain logic, types, validation, helpers, and cross-app utilities.

  - `config/` — central configuration files and build settings.
    - `config/` can hold ESLint, Prettier, TypeScript, environment schema, and build config used across apps and packages.

  - `infra/` — infrastructure and deployment support.
    - `infra/docker/` — custom Docker helper scripts, Dockerfile fragments, build assets, or container utilities.
    - `infra/nginx/` — Nginx reverse-proxy configuration for local development and production routing.

  - `docs/` — documentation, design notes, architecture guides, and onboarding material.

## Generated root files

- `package.json` — root monorepo package manifest with workspaces and shared scripts.
- `turbo.json` — Turborepo configuration for caching, pipelining, and task dependencies.
- `docker-compose.yml` — orchestrates local services: PostgreSQL, API, web frontend, and Nginx.
- `.env.example` — example environment variables for both API and web.
- `README.md` — overview of the monorepo structure, folder roles, and startup instructions.

## How this monorepo works

- `apps/` contains independent deployable apps.
- `packages/` contains shared code consumed by apps.
- Root `package.json` defines Yarn/NPM workspaces so dependencies are hoisted and packages are linked.
- `turbo.json` defines task pipelines: `dev`, `build`, `lint`, `test`, and `start`.
- `docker-compose.yml` provides a local developer stack with service network routing.

## Getting started

1. Install root dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill values.
3. Start the development stack:
   ```bash
   docker compose up --build
   ```

## Folder responsibilities

- `apps/web/` is the customer-facing frontend.
- `apps/api/` is the backend service exposing API endpoints.
- `packages/ui/` is the shared component library for consistent UI.
- `packages/shared/` is shared business logic, types, and utilities.
- `config/` keeps global config centralized.
- `infra/docker/` stores Docker-related helper resources.
- `infra/nginx/` stores proxy and routing configuration.
- `docs/` stores docs that explain the project and architecture.
