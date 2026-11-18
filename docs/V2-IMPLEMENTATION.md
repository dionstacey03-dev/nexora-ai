# NEXORA AI V2 implementation status

This branch is an incremental upgrade to the existing application. The original dashboard, local project workflow, Gemini endpoints, and exports remain in place.

## Phase 1 — Production foundation and identity
- Vercel serverless adapter, health endpoint, response security headers, request validation, and CI are retained.
- Added an OIDC/JWKS bearer-token verifier that accepts RS256 tokens only and validates issuer, audience, expiry, subject, and signature.
- Added `GET /api/auth/me`; it fails closed with `AUTH_NOT_CONFIGURED` until an identity provider is configured.
- Added optional shared Upstash Redis rate limiting. When configured, Redis errors fail closed with HTTP 503 rather than silently bypassing the shared limit.
- The existing local in-memory limiter remains a development fallback when Upstash credentials are absent. Configure Upstash before relying on distributed production limits.

### Identity provider setup
Choose an OIDC provider (for example Clerk or Auth0) and configure:
- `AUTH_JWKS_URL`: provider's JWKS endpoint.
- `AUTH_ISSUER`: exact issuer value from the provider.
- `AUTH_AUDIENCE`: API audience configured for NEXORA AI.

The API verifier is provider-neutral; hosted sign-in UI, callback routes, account recovery, organization membership, and role/permission management still need to be connected to the selected provider. Existing project endpoints are not globally protected yet, to avoid locking out current users before sign-in is configured.

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
1. Select and configure an OIDC provider, then wire sign-in UI and protect user-specific routes.
2. Provision Neon, apply migration 001, implement transactional owner-scoped CRUD, and add import/sync tests.
3. Configure Upstash and test concurrent-instance rate limiting.
4. Add model routing, usage quotas, cancellation, and provider-failure tests.
5. Select a dedicated sandbox service and complete an isolation/security review before enabling execution.
6. Run CI, preview regression tests, and a security review before merge or production deployment.
