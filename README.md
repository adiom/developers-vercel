# Canfly Development Portal

`dev.canfly.org` is the public Russian-language portal for Canfly development, its technology platform, AI-agent projects, and service inquiries. The portal is built with Next.js, React, Tailwind CSS, and Neon PostgreSQL.

## Public pages

- `/` — Canfly development portal and AI consultation entry point
- `/platform` — public, high-level overview of the platform
- `/services` — project development directions
- `/agents` — public agent project directory
- `/privacy` — notice for information submitted with a request

## Workspace

The existing assessment CRM is served under `/workspace` and requires a valid session. Workspace routes include clients, projects, assessments, vulnerabilities, tasks, reports, team, analytics, settings, and (for administrators) `/workspace/leads`.

## Configuration

Set these variables in the deployment environment:

```env
DATABASE_URL=your_neon_database_url
NEXT_PUBLIC_APP_URL=https://dev.canfly.org
AI_CHAT_API_URL=https://your-openai-compatible-provider/v1/chat/completions
AI_CHAT_API_KEY=your_server_side_api_key
AI_CHAT_MODEL=your_model_name
NEXT_PUBLIC_INGRIA_URL=https://your-agent-site
NEXT_PUBLIC_KRISTINA_URL=https://your-agent-site
NEXT_PUBLIC_BANITA_URL=https://your-agent-site
```

The three `NEXT_PUBLIC_*_URL` agent links are optional and must point to confirmed live project pages. The AI variables are server-side except the model name used only by the server. If AI credentials are missing or the provider is unavailable, the chat explains that it is temporarily offline while the lead form remains available. Submitted leads are stored in the `public_leads` table and can be viewed in the authenticated workspace by administrators.

The database must have the existing CRM schema initialized (`pnpm db:init`). The public lead table is created automatically when the first request is submitted.

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm start
```
