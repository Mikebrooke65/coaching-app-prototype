-- Migration 027: Add division and team_type to lessons table
-- Supports Academy vs Community programme distinction
-- and team type tagging (First Kicks, Fun Football, Junior Football, Youth Football, Senior)

-- ============================================================================
-- ADD DIVISION COLUMN
-- ============================================================================
-- Values: 'Community' or 'Academy'
-- Existing 16 U9 lessons are all Community programme
-- Bailey's lessons will be Academy programme

ALTER TABLE lessons ADD COLUMN division TEXT NOT NULL DEFAULT 'Community'
  CHECK (division IN ('Community', 'Academy'));

-- ============================================================================
-- ADD TEAM_TYPE COLUMN
-- ============================================================================
-- Maps to age group ranges:
--   First Kicks  = U4–U6
--   Fun Football = U7–U8
--   Junior Football = U9–U12
--   Youth Football  = U13–U17
--   Senior = Adult

ALTER TABLE lessons ADD COLUMN team_type TEXT
  CHECK (team_type IN ('First Kicks', 'Fun Football', 'Junior Football', 'Youth Football', 'Senior'));

-- ============================================================================
-- UPDATE EXISTING LESSONS
-- ============================================================================
-- All existing U9 lessons are Community / Junior Football
UPDATE lessons SET division = 'Community', team_type = 'Junior Football' WHERE age_group = 'U9';

-- ============================================================================
-- ADD INDEX FOR FILTERING
-- ============================================================================
CREATE INDEX idx_lessons_division ON lessons(division);
CREATE INDEX idx_lessons_team_type ON lessons(team_type);

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON COLUMN lessons.division IS 'Programme division: Community or Academy';
COMMENT ON COLUMN lessons.team_type IS 'Team type: First Kicks (U4-U6), Fun Football (U7-U8), Junior Football (U9-U12), Youth Football (U13-U17), Senior (Adult)';
