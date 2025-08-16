DROP SCHEMA IF EXISTS auth CASCADE;
CREATE SCHEMA IF NOT EXISTS auth;

DROP TABLE IF EXISTS auth.sessions;
DROP INDEX IF EXISTS users_user_name;
DROP TABLE IF EXISTS auth.users;

CREATE TABLE IF NOT EXISTS auth.users (
	"user" uuid DEFAULT gen_random_uuid(),
	user_name text NOT NULL,
	password_hash text NOT NULL,
	roles text[],
	first_name text,
	last_name text,
	PRIMARY KEY("user")
);
CREATE UNIQUE INDEX IF NOT EXISTS users_user_name ON auth.users(LOWER(user_name));

CREATE TABLE IF NOT EXISTS auth.sessions (
	session uuid DEFAULT gen_random_uuid(),
	"user" uuid NOT NULL REFERENCES auth.users("user"),
	created_at timestamptz NOT NULL DEFAULT now(),
	valid_until timestamptz DEFAULT now() + interval '30 days',
	meta jsonb,
	PRIMARY KEY(session)
);
--CREATE INDEX auth.user_sessions ON auth.sessions ("user") WHERE;
--DROP TABLE IF EXISTS sessions;

