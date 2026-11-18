# NEXORA AI V2 implementation notes

## Phase 1 — Production foundation
- Added a Vercel serverless adapter that reuses the current Express API.
- Added a health endpoint and baseline response security headers.
- Extracted request validation primitives and added unit tests.
- Added CI for type-checking, unit tests, and production build.
- Removed fictional default profile details without changing existing users' saved local settings.
- The current API rate limiter remains process-local; configure a shared store before relying on limits across Vercel instances.

## Phase 2 — Persistence and accounts
- Added a Neon-compatible schema for users, owner-scoped projects, and preferences.
- Existing browser-local storage remains the active persistence mechanism for backward compatibility.
- Authentication and cloud CRUD are not activated: select an identity provider, provision Neon, apply the migration, and implement verified session ownership before enabling sync.

## Phase 3 — AI capabilities
- Preserved the existing Gemini endpoints and deterministic fallback behavior.
- Kept Gemini credentials server-side and documented environment setup.
- Streaming, multi-model orchestration, and generated-code sandbox execution remain release-gated until cancellation, quotas, and execution isolation are implemented.

## Phase 4 — Launch preparation
- Added setup, deployment, environment, data model, and security documentation.
- Added CI workflow for pushes and pull requests.
- No production deployment is performed by this branch.

## Remaining release gates
1. Configure a shared Upstash rate-limit store and verify concurrent-instance behavior.
2. Choose an identity provider and implement session lifecycle and account recovery.
3. Provision Neon, apply migration 001, and implement owner-scoped CRUD with integration tests.
4. Run CI and a Vercel preview, then manually test all existing modules.
5. Complete a security review before merge or production deployment.
