-- =============================================================
-- ATS AI Pro — Neon PostgreSQL Schema
-- Run this once against your Neon database to create the tables.
-- You can paste this into the Neon SQL Editor or run via psql.
-- =============================================================

-- Users table (mirrors the AppUser interface)
CREATE TABLE IF NOT EXISTS users (
  uid            TEXT PRIMARY KEY,
  email          TEXT NOT NULL UNIQUE,
  display_name   TEXT NOT NULL DEFAULT 'Unnamed User',
  provider_id    TEXT NOT NULL DEFAULT 'password',
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  credits        INTEGER NOT NULL DEFAULT 3
);

-- Shared reports table
CREATE TABLE IF NOT EXISTS shared_reports (
  id         TEXT PRIMARY KEY,
  data       JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for looking up users by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
