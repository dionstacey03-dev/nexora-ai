-- Neon PostgreSQL foundation. Apply only after connecting a verified identity provider.
CREATE TABLE IF NOT EXISTS app_users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 auth_provider TEXT NOT NULL,
 auth_subject TEXT NOT NULL,
 email TEXT,
 display_name TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 UNIQUE (auth_provider, auth_subject)
);
CREATE TABLE IF NOT EXISTS projects (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 owner_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
 name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 160),
 description TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'draft',
 project_data JSONB NOT NULL DEFAULT '{}'::jsonb,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS projects_owner_updated_idx ON projects (owner_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS projects_data_gin_idx ON projects USING GIN (project_data);
CREATE TABLE IF NOT EXISTS user_preferences (
 owner_id UUID PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
 preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Resolve owner_id from a verified server-side session, never from client JSON.
-- Use parameterized SQL for every query. This migration is not auto-applied.
