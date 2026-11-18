# NEXORA AI V2 implementation status

This branch is an incremental upgrade to the existing application. The original dashboard, local project workflow, Gemini endpoints, and exports remain in place.

## Phase 1 — Production foundation and identity
- Vercel serverless adapter, health endpoint, response security headers, request validation, and CI are retained.
- Added Clerk React provider, sign-in/sign-up modal controls, and user profile menu for desktop and mobile navigation.
- Added Clerk Express middleware to verify session cookies or bearer tokens on the server.
- All API routes except `/api/health` require a verified Clerk session; missing configuration fails closed with `CLERK_NOT_CONFIGURED`.
- Added `GET /api/auth/me` to return the verified Clerk user and session identifiers.
- Added optional shared Upstash Redis rate limiting. When configured, Redis errors fail closed with HTTP 503 rather than silently bypassing the shared limit.
- The existing local in-memory limiter remains a development fallback when Upstash credentials are absent. Configure Upstash before relying on distributed production limits.

### Clerk setup required
Create or select the NEXORA AI application in the Clerk Dashboard, then configure:
- `VITE_CLERK_PUBLISHABLE_KEY` in Vercel Preview and Production (browser key).
- `CLERK_PUBLISHABLE_KEY` in Vercel Preview and Production (server key).
- `CLERK_SECRET_KEY` in Vercel Preview and Production (server-only secret).

The application intentionally fails closed until these keys are configured. The API health endpoint remains public; all other API endpoints require a verified Clerk session. Configure allowed origins/redirect URLs for the Vercel preview domain and production domain in Clerk. Production Clerk keys must come from a claimed, production-ready Clerk application. Do not use development keys in production.

## Phase 2 — Neon persistence
- Migration `database/migrations/001_initial_schema.sql` defines users, owner-scoped projects, and preferences.
- The application still uses browser localStorage for projects and settings.
- Neon CRUD, migration execution, authenticated owner resolution, data import/sync, and integration tests are not activated yet. Do not set `DATABASE_URL` expecting cloud persistence to work until the data adapter and migration are implemented.
- The database adapter must resolve the internal owner ID from the verified identity on the server. Never accept owner IDs from client payloads.

## Phase 3 — Streaming and model orchestration
- Added `POST /api/generate-code/stream` using server-side Gemini streaming and Server-Sent Events.
- Code Studio now consumes streamed deltas and parses the completed JSON response. It falls back to the existing non-streaming endpoint when streaming is unavailable.
- The existing project generation endpoint retains its model fallback sequence.
- Multi-provider/model routing, usage metering, cancellation propagation, and per-user quotas remain outstanding.
- Streaming requires the existing server-only `GEMINI_API_KEY`.

## Phase 4 — Secure code execution and launch hardening
- No arbitrary code is executed inside the NEXORA Vercel function or application process.
- A dedicated sandbox provider/adapter is still required before code execution can be enabled. It must provide ephemeral isolated containers, outbound network restrictions, CPU/memory/time quotas, filesystem isolation, and automatic teardown.
- `CODE_SANDBOX_URL` and `CODE_SANDBOX_TOKEN` are reserved configuration names only; they do not enable execution.
- Complete end-to-end tests, dependency/secret configuration, security review, and manual regression testing before merge or production release.

## Release gates
1. Configure Clerk keys and allowed origins for Preview and Production; verify sign-in, sign-up, sign-out, and protected API requests.
2. Provision Neon, apply migration 001, implement transactional owner-scoped CRUD, and add import/sync tests.
3. Configure Upstash and test concurrent-instance rate limiting.
4. Add model routing, usage quotas, cancellation, and provider-failure tests.
5. Select a dedicated sandbox service and complete an isolation/security review before enabling execution.
6. Run CI, preview regression tests, and a security review before merge or production deployment.
