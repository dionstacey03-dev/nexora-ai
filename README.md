# NEXORA AI

NEXORA AI is an AI-assisted software planning workspace for turning ideas into structured project plans, roadmaps, technology recommendations, starter code, and repository documentation.

## Modules
- Project Generator — transform product ideas into structured software plans.
- Roadmap Builder — organize milestones and delivery steps.
- Tech Stack Recommender — compare implementation choices.
- Code Studio — generate starter code and implementation guidance.
- README Studio — prepare repository documentation.
- My Projects — manage locally saved project plans.

## Stack
React 19, TypeScript, Vite 8, Tailwind CSS 4, Express 4, and Google GenAI.

## Local development
Requires Bun (the repository includes `bun.lock`).

```bash
bun install --frozen-lockfile
cp .env.example .env
# Add GEMINI_API_KEY to .env for live generation
bun run dev
```

The development server serves the Vite app and API from the same origin (port 3000 by default).

## Environment variables
| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Server-only Gemini credential. Never use a `VITE_*` prefix. |
| `UPSTASH_REDIS_REST_URL` | Reserved production shared rate-limit store configuration. |
| `UPSTASH_REDIS_REST_TOKEN` | Reserved production shared rate-limit store credential. |
| `APP_URL` | Optional canonical public URL. |

Without a Gemini key, supported features use the existing deterministic starter/fallback responses; these should not be represented as model-generated output.

## Vercel
This branch adds an Express serverless adapter and configures Vite's `dist` output. Add `GEMINI_API_KEY` in Vercel Project Settings as a server-side encrypted environment variable. Configure and verify a shared rate-limit store before exposing the API to public traffic. Use separate Preview and Production credentials.

No deployment is triggered by this change. Review the preview configuration and approve deployment separately.

## Persistence and accounts
Project and profile settings currently remain in browser `localStorage`; they are not account-synced or backed up to a cloud database. The initial Neon-compatible schema is in `database/migrations` and is not automatically applied. Authentication and database CRUD must be connected to a chosen identity provider and provisioned Neon database before multi-user access is enabled.

## Quality checks
```bash
bun run typecheck
bun run test
bun run build
```

## Security
- Keep credentials on the server and rotate any key that has ever been committed.
- Browser storage is user-controlled and is not an authorization boundary.
- Derive project ownership from verified server-side sessions, never client-supplied owner IDs.
- Use parameterized SQL and HTTPS for production data access.
- Do not store secrets or sensitive personal information in project descriptions.
