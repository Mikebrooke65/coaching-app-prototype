-- Migration 010: Refactor Lessons and Sessions Architecture
-- This migration implements the correct architecture where:
-- 1. Sessions are standalone, globally reusable assets
-- 2. Lessons reference sessions (not own them)
-- 3. Sessions have unique names as natural identifiers

-- Drop existing tables in correct order (due to foreign keys)
DROP TABLE IF EXISTS session_deliveries CASCADE;
DROP TABLE IF EXISTS lesson_deliveries CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;

-- ============================================================================
-- SESSIONS TABLE (Standalone, Globally Reusable)
-- ============================================================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Unique identifier (natural key)
  session_name TEXT NOT NULL UNIQUE,
  
  -- Metadata
  age_group TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('warmup', 'skill_intro', 'progressive', 'game')),
  duration INTEGER NOT NULL CHECK (duration > 0),
  title TEXT NOT NULL,
  
  -- Content
  description TEXT,
  organisation TEXT NOT NULL,
  equipment TEXT[] NOT NULL DEFAULT '{}',
  coaching_points TEXT[] NOT NULL DEFAULT '{}',
  steps TEXT[] NOT NULL DEFAULT '{}',
  key_objectives TEXT[] NOT NULL DEFAULT '{}',
  
  -- Media
  pitch_layout_description TEXT NOT NULL,
  diagram_url TEXT,
  video_url TEXT,
  
  -- Audit
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LESSONS TABLE (References Sessions)
-- ============================================================================
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Metadata
  title TEXT NOT NULL,
  description TEXT,
  age_group TEXT NOT NULL,
  skill_category TEXT NOT NULL,
  level TEXT DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  
  -- Session References (4 required)
  session_1_id UUID NOT NULL REFERENCES sessions(id) ON DELETE RESTRICT,
  session_2_id UUID NOT NULL REFERENCES sessions(id) ON DELETE RESTRICT,
  session_3_id UUID NOT NULL REFERENCES sessions(id) ON DELETE RESTRICT,
  session_4_id UUID NOT NULL REFERENCES sessions(id) ON DELETE RESTRICT,
  
  -- Computed
  total_duration INTEGER,
  
  -- Learning
  objectives TEXT[] NOT NULL DEFAULT '{}',
  coaching_focus TEXT[] NOT NULL DEFAULT '{}',
  
  -- Audit
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LESSON DELIVERIES (Tracks when lessons are delivered to teams)
-- ============================================================================
CREATE TABLE lesson_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES users(id),
  delivery_date DATE NOT NULL,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SESSION DELIVERIES (Tracks individual session delivery and feedback)
-- ============================================================================
CREATE TABLE session_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_delivery_id UUID NOT NULL REFERENCES lesson_deliveries(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE RESTRICT,
  delivered BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_sessions_age_group ON sessions(age_group);
CREATE INDEX idx_sessions_session_type ON sessions(session_type);
CREATE INDEX idx_sessions_session_name ON sessions(session_name);

CREATE INDEX idx_lessons_age_group ON lessons(age_group);
CREATE INDEX idx_lessons_skill_category ON lessons(skill_category);
CREATE INDEX idx_lessons_session_1 ON lessons(session_1_id);
CREATE INDEX idx_lessons_session_2 ON lessons(session_2_id);
CREATE INDEX idx_lessons_session_3 ON lessons(session_3_id);
CREATE INDEX idx_lessons_session_4 ON lessons(session_4_id);

CREATE INDEX idx_lesson_deliveries_team_id ON lesson_deliveries(team_id);
CREATE INDEX idx_lesson_deliveries_coach_id ON lesson_deliveries(coach_id);
CREATE INDEX idx_lesson_deliveries_date ON lesson_deliveries(delivery_date);

CREATE INDEX idx_session_deliveries_lesson_delivery_id ON session_deliveries(lesson_delivery_id);
CREATE INDEX idx_session_deliveries_session_id ON session_deliveries(session_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_deliveries ENABLE ROW LEVEL SECURITY;

-- Sessions: All authenticated users can read, admins can manage
CREATE POLICY "Anyone can view sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage sessions"
  ON sessions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Lessons: All authenticated users can read, admins can manage
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage lessons"
  ON lessons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Lesson Deliveries: Coaches see their own, admins see all
CREATE POLICY "Users can view their team's lesson deliveries"
  ON lesson_deliveries FOR SELECT
  TO authenticated
  USING (
    coach_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Coaches and admins can create lesson deliveries"
  ON lesson_deliveries FOR INSERT
  TO authenticated
  WITH CHECK (
    coach_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Coaches and admins can update lesson deliveries"
  ON lesson_deliveries FOR UPDATE
  TO authenticated
  USING (
    coach_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

-- Session Deliveries: Coaches see their own, admins see all
CREATE POLICY "Users can view their session deliveries"
  ON session_deliveries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lesson_deliveries
      WHERE lesson_deliveries.id = session_deliveries.lesson_delivery_id
      AND (
        lesson_deliveries.coach_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.role IN ('admin', 'manager')
        )
      )
    )
  );

CREATE POLICY "Coaches can manage their session deliveries"
  ON session_deliveries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lesson_deliveries
      WHERE lesson_deliveries.id = session_deliveries.lesson_delivery_id
      AND (
        lesson_deliveries.coach_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.role IN ('admin', 'manager')
        )
      )
    )
  );

-- ============================================================================
-- SAMPLE DATA: U9 Tackling Lesson 01
-- ============================================================================

-- Insert 4 sessions for U9 Tackling Lesson 01
INSERT INTO sessions (
  session_name,
  age_group,
  session_type,
  duration,
  title,
  organisation,
  equipment,
  coaching_points,
  steps,
  key_objectives,
  pitch_layout_description
) VALUES
(
  'session-mirror-jockey-u9',
  'U9',
  'warmup',
  20,
  'Mirror Jockey',
  'Set up a 20x20 yard square. Players work in pairs without a ball initially. One player (attacker) moves around the area using changes of direction and speed. The partner (defender) mirrors their movement staying 2-3 yards away, maintaining a side-on jockey position. Switch roles every 60 seconds. Progression: Add a ball to the attacker.',
  ARRAY['Cones (8) for square boundary', 'Bibs (2 colors)', 'Balls (1 per pair for progression)'],
  ARRAY['Stay on your toes, knees bent', 'Side-on body shape, never square', 'Keep 2-3 yards distance', 'Watch the ball, not the feet', 'Small quick steps, don''t cross feet'],
  ARRAY['Demonstrate correct jockey stance: side-on, knees bent, arms out for balance', 'Players practice jockey footwork without partner (30 seconds)', 'Pairs begin mirroring exercise without ball (2 minutes)', 'Switch roles (2 minutes)', 'Add ball to attacker, defender continues jockeying (3 minutes each role)', 'Emphasize staying patient and not diving in'],
  ARRAY['Master defensive stance and footwork', 'Maintain proper distance from attacker', 'Develop patience in defensive situations'],
  '20x20 yard square marked with cones at corners. Pairs spread throughout the area. Attacker (orange bib) moves freely within square. Defender (blue bib) mirrors movement staying 2-3 yards away, maintaining side-on position. Arrows show attacker''s random movement patterns and defender''s mirroring response.'
),
(
  'session-block-tackle-intro-u9',
  'U9',
  'skill_intro',
  15,
  'Block Tackle Introduction',
  'Set up multiple 10x10 yard grids. In each grid, one attacker with a ball, one defender. Attacker dribbles slowly in the grid. Defender jockeys and when coach calls "NOW", defender executes a block tackle. Start at 50% speed, gradually increase. Key Rule: Defender must be side-on before attempting tackle.',
  ARRAY['Cones (20) for 5 grids', 'Balls (1 per pair)', 'Bibs (2 colors)'],
  ARRAY['Approach side-on, not head-on', 'Plant non-tackling foot beside the ball', 'Lock ankle of tackling foot', 'Strike through the middle of the ball', 'Keep body weight forward over the ball', 'Stay on your feet after contact'],
  ARRAY['Demonstrate block tackle technique slowly (coach demo)', 'Players practice tackle motion without ball (shadow practice)', 'Static practice: ball on ground, players take turns executing tackle', 'Slow-motion pairs: attacker dribbles at 30% speed, defender tackles on command', 'Increase to 50% speed', 'Increase to 70% speed with defender choosing moment to tackle'],
  ARRAY['Execute safe block tackle with correct technique', 'Understand importance of body position before tackling', 'Develop confidence in physical contact'],
  'Five 10x10 yard grids arranged in a line. Each grid contains one attacker (orange bib) with ball and one defender (blue bib). Attacker dribbles within grid boundaries. Defender jockeys using side-on stance, then executes block tackle when appropriate. Diagram shows defender''s approach angle (45 degrees, not straight on) and tackle execution with planted foot beside ball.'
),
(
  'session-1v1-tackle-pressure-u9',
  'U9',
  'progressive',
  15,
  '1v1 Tackle Under Pressure',
  'Set up 15x10 yard channels with a small goal at each end. 1v1 battles. Attacker starts with ball at one end, tries to dribble through and score. Defender must jockey, delay, and choose the right moment to tackle. If defender wins ball, they can counter-attack the opposite goal. Scoring: Goal = 1 point, winning ball with clean tackle = 1 point.',
  ARRAY['Cones (12) for 3 channels', 'Small goals (6)', 'Balls (3)', 'Bibs (2 colors)'],
  ARRAY['Jockey first, tackle second', 'Force attacker to one side', 'Tackle when attacker''s touch is heavy', 'Use poke tackle if ball is far from attacker''s body', 'Use block tackle when ball is close', 'Recover quickly if you miss'],
  ARRAY['Explain the game rules and scoring system', 'Demonstrate good defending: jockey, force direction, tackle at right moment', 'First round: 60 seconds per battle, then switch', 'Add condition: defender must win ball 3 times to win the round', 'Increase pressure: attacker has 10 seconds to score', 'Final round: best of 3 battles'],
  ARRAY['Apply tackling technique in realistic 1v1 situations', 'Develop decision-making: when to tackle vs when to delay', 'Build confidence under pressure'],
  'Three 15x10 yard channels side by side. Each channel has small goal at both ends. Attacker (orange bib) starts at one end with ball, attempts to dribble through and score. Defender (blue bib) starts at opposite end, jockeys backward, forces attacker to one side, and tackles when opportunity arises. Arrows show attacker''s forward movement and defender''s backward jockey, then forward tackle. Dotted line shows defender''s counter-attack if ball is won.'
),
(
  'session-tackle-game-u9',
  'U9',
  'game',
  15,
  'Tackle Game Application',
  '4v4 game on a 30x20 yard pitch with small goals at each end. No goalkeepers. Special Rule: Team earns 1 bonus point for winning the ball with a clean tackle (coach''s judgment). Regular goals = 1 point.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)'],
  ARRAY['Minimal coaching - let the game teach', 'Highlight good examples of jockeying and tackling', 'Encourage players to stay on feet', 'Praise safe, controlled tackles', 'Remind players: tackle the ball, not the player'],
  ARRAY['Explain game rules and bonus point system', 'Play 2 x 6-minute halves with 3-minute break', 'During break, ask players: "When is the best time to tackle?"', 'Second half: continue game', 'Cool down: players share one thing they learned about tackling'],
  ARRAY['Apply tackling skills in game context', 'Make decisions about when to tackle', 'Experience success with safe tackling technique'],
  '30x20 yard pitch with small goals at each end. Two teams of 4 players (orange vs blue bibs). Standard small-sided game setup. Diagram shows typical game situation with players spread across pitch, highlighting a defending player using correct jockey position before attempting tackle. Arrows indicate ball movement and defensive pressure.'
);

-- Insert lesson that references the 4 sessions
INSERT INTO lessons (
  title,
  description,
  age_group,
  skill_category,
  level,
  session_1_id,
  session_2_id,
  session_3_id,
  session_4_id,
  total_duration,
  objectives,
  coaching_focus
)
SELECT
  'Win It Safely: Block & Poke',
  'Players learn how to regain possession safely by using correct body shape, controlled close-down, and choosing the right moment to block tackle or poke the ball away instead of diving in.',
  'U9',
  'Tackling',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-mirror-jockey-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-block-tackle-intro-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-1v1-tackle-pressure-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-tackle-game-u9'),
  65,
  ARRAY['Understand when to tackle and when to delay', 'Execute safe block tackles with correct body shape', 'Use poke tackles to win the ball in tight spaces', 'Maintain balance and control when defending'],
  ARRAY['Safety first - no diving in', 'Side-on body shape', 'Timing over aggression', 'Stay on your feet'];

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE sessions IS 'Standalone, globally reusable training sessions';
COMMENT ON TABLE lessons IS 'Lessons that reference 4 sessions';
COMMENT ON TABLE lesson_deliveries IS 'Tracks when lessons are delivered to teams';
COMMENT ON TABLE session_deliveries IS 'Tracks individual session delivery and coach feedback';

COMMENT ON COLUMN sessions.session_name IS 'Unique identifier following naming convention: session-<name>-<age-group>';
COMMENT ON COLUMN sessions.session_type IS 'Type of session: warmup, skill_intro, progressive, or game';
COMMENT ON COLUMN lessons.session_1_id IS 'Reference to warmup session';
COMMENT ON COLUMN lessons.session_2_id IS 'Reference to skill introduction session';
COMMENT ON COLUMN lessons.session_3_id IS 'Reference to progressive development session';
COMMENT ON COLUMN lessons.session_4_id IS 'Reference to game application session';
