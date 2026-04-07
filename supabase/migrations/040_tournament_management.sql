-- Migration 040: Tournament Management Schema Extensions
-- Extends competitions, events tables and creates competition_standings table
-- for round-robin tournament support (Phase 1 MVP).
--
-- Changes:
-- 1. ALTER competitions: add format, points_for_win, points_for_draw, points_for_loss, tiebreaker_rules
-- 2. ALTER events: add competition_id (FK), round_number, match_number, pitch
-- 3. CREATE competition_standings table with unique(competition_id, team_id)
-- 4. CREATE indexes on events.competition_id, competition_standings.competition_id, competition_standings.team_id
-- 5. ENABLE RLS on competition_standings with read (all authenticated) and write (admin only) policies
--
-- Idempotent: uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS throughout.

-- ============================================================
-- Step 1: Extend competitions table with tournament config
-- ============================================================

ALTER TABLE public.competitions
  ADD COLUMN IF NOT EXISTS format TEXT DEFAULT 'single_round_robin'
    CHECK (format IN ('single_round_robin', 'double_round_robin'));

ALTER TABLE public.competitions
  ADD COLUMN IF NOT EXISTS points_for_win INTEGER DEFAULT 3;

ALTER TABLE public.competitions
  ADD COLUMN IF NOT EXISTS points_for_draw INTEGER DEFAULT 1;

ALTER TABLE public.competitions
  ADD COLUMN IF NOT EXISTS points_for_loss INTEGER DEFAULT 0;

ALTER TABLE public.competitions
  ADD COLUMN IF NOT EXISTS tiebreaker_rules TEXT[] DEFAULT ARRAY['goal_difference', 'goals_scored', 'head_to_head'];

-- ============================================================
-- Step 2: Extend events table with tournament fixture metadata
-- ============================================================

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS round_number INTEGER;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS match_number INTEGER;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS pitch TEXT;

-- ============================================================
-- Step 3: Create competition_standings table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.competition_standings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  played INTEGER NOT NULL DEFAULT 0,
  won INTEGER NOT NULL DEFAULT 0,
  drawn INTEGER NOT NULL DEFAULT 0,
  lost INTEGER NOT NULL DEFAULT 0,
  goals_for INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  goal_difference INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  UNIQUE(competition_id, team_id)
);

-- ============================================================
-- Step 4: Create indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_events_competition_id
  ON public.events(competition_id)
  WHERE competition_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_competition_standings_competition_id
  ON public.competition_standings(competition_id);

CREATE INDEX IF NOT EXISTS idx_competition_standings_team_id
  ON public.competition_standings(team_id);

-- ============================================================
-- Step 5: Row Level Security on competition_standings
-- ============================================================

ALTER TABLE public.competition_standings ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read standings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'competition_standings' AND policyname = 'standings_read'
  ) THEN
    CREATE POLICY "standings_read" ON public.competition_standings
      FOR SELECT TO authenticated USING (true);
  END IF;
END
$$;

-- Only admin users can insert/update/delete standings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'competition_standings' AND policyname = 'standings_admin_write'
  ) THEN
    CREATE POLICY "standings_admin_write" ON public.competition_standings
      FOR ALL TO authenticated
      USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END
$$;

-- Note: This migration is safe to run multiple times (idempotent)
-- ADD COLUMN IF NOT EXISTS prevents duplicate column errors
-- CREATE TABLE/INDEX IF NOT EXISTS prevents duplicate object errors
-- DO $$ blocks check for existing policies before creating them
