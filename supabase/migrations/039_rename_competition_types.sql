-- Migration 039: Rename Competition Types
-- Changes 'wcr' to 'external_league' and 'other' to 'club_tournament'
-- 
-- Rationale:
-- - 'wcr' was club-specific and not descriptive
-- - 'other' was vague
-- - New names clearly describe purpose:
--   - external_league: Regular season leagues (NZ Football, etc.)
--   - club_tournament: Tournaments run BY the club (summer comps) - triggers lite user workflows

-- Step 1: Drop the old check constraint FIRST
ALTER TABLE public.competitions 
DROP CONSTRAINT IF EXISTS competitions_competition_type_check;

-- Step 2: Update existing data
UPDATE public.competitions 
SET competition_type = 'external_league' 
WHERE competition_type = 'wcr';

UPDATE public.competitions 
SET competition_type = 'club_tournament' 
WHERE competition_type = 'other';

-- Step 3: Add new check constraint
ALTER TABLE public.competitions 
ADD CONSTRAINT competitions_competition_type_check 
CHECK (competition_type IN ('external_league', 'club_tournament'));

-- Note: This migration is safe to run multiple times (idempotent)
-- The UPDATE statements will have no effect if data already migrated
