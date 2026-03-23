-- Migration 038: Add indexes for reporting queries
-- Purpose: Optimize performance for admin reporting dashboard queries

-- Lesson deliveries indexes
CREATE INDEX IF NOT EXISTS idx_lesson_deliveries_delivery_date 
  ON lesson_deliveries(delivery_date);

CREATE INDEX IF NOT EXISTS idx_lesson_deliveries_team_id 
  ON lesson_deliveries(team_id);

CREATE INDEX IF NOT EXISTS idx_lesson_deliveries_coach_id 
  ON lesson_deliveries(coach_id);

-- Lesson feedback indexes
CREATE INDEX IF NOT EXISTS idx_lesson_feedback_lesson_id 
  ON lesson_feedback(lesson_id);

CREATE INDEX IF NOT EXISTS idx_lesson_feedback_created_at 
  ON lesson_feedback(created_at);

-- Session feedback indexes
CREATE INDEX IF NOT EXISTS idx_session_feedback_session_id 
  ON session_feedback(session_id);

CREATE INDEX IF NOT EXISTS idx_session_feedback_created_at 
  ON session_feedback(created_at);

-- Game feedback indexes
CREATE INDEX IF NOT EXISTS idx_game_feedback_created_at 
  ON game_feedback(created_at);

CREATE INDEX IF NOT EXISTS idx_game_feedback_team_id 
  ON game_feedback(team_id);

CREATE INDEX IF NOT EXISTS idx_game_feedback_created_by 
  ON game_feedback(created_by);

-- Lessons indexes
CREATE INDEX IF NOT EXISTS idx_lessons_age_group 
  ON lessons(age_group);

CREATE INDEX IF NOT EXISTS idx_lessons_skill_category 
  ON lessons(skill_category);

-- Teams indexes
CREATE INDEX IF NOT EXISTS idx_teams_age_group 
  ON teams(age_group);

-- Comment explaining the indexes
COMMENT ON INDEX idx_lesson_deliveries_delivery_date IS 'Optimize date range filtering in reports';
COMMENT ON INDEX idx_lesson_deliveries_team_id IS 'Optimize team filtering in reports';
COMMENT ON INDEX idx_lesson_deliveries_coach_id IS 'Optimize coach filtering in reports';
