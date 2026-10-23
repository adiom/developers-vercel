# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router application. Pages, layouts, and API handlers live in `app/`; public routes include `/platform`, `/services`, and `/agents`, while authenticated routes cover CRM features. Shared React components are in `components/` (reusable primitives in `components/ui/`). Put database access, authentication, server actions, and helpers in `lib/`; hooks and TypeScript declarations live in `hooks/` and `types/`. Static assets belong in `public/`, styles in `styles/` or `app/globals.css`, utilities in `scripts/`, and browser tests in `e2e/`.

## Build, Test, and Development Commands

Use pnpm, pinned in `package.json`:

- `pnpm install` installs dependencies.
- `pnpm dev` starts the local server at `http://localhost:3000`.
- `pnpm build` creates a production build; `pnpm start` serves it locally.
- `pnpm lint` runs the configured Next.js lint command.
- `pnpm exec playwright test` runs browser tests; append `e2e/dynamic-routes.spec.ts` to target the current route test.
- `pnpm db:init` initializes the CRM schema; configure `DATABASE_URL` first.

## Coding Style & Naming Conventions

Follow surrounding TypeScript and React style: two-space indentation, semicolons, and single-quoted imports where consistent with nearby files. Name components and types in PascalCase, hooks with a `use` prefix, and utility modules in kebab-case. Keep route segments lowercase and place shared UI in `components/ui/`. Follow existing Tailwind patterns.

## Testing Guidelines

Add Playwright coverage under `e2e/` for visible routes and workflows. Name files `*.spec.ts`; keep tests focused on observable behavior and use the configured base URL. No unit-test script or coverage threshold is currently configured.

## Commit & Pull Request Guidelines

Recent commits use short subjects in both Russian and English, without a consistent prefix convention. Use a concise subject describing the change (for example, `Add public agents directory`). Pull requests should summarize changes, list relevant checks, link related issues when available, and include screenshots for UI changes.

## Security & Configuration

Keep credentials out of source control. Configure database and AI secrets through environment variables; use `.env.local` locally and never expose server-side keys with `NEXT_PUBLIC_`. Confirm optional public agent URLs point to intended live pages.
