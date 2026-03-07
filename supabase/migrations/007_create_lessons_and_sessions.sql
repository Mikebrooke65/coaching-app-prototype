-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS session_deliveries CASCADE;
DROP TABLE IF EXISTS lesson_deliveries CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;

-- Create lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  age_group TEXT NOT NULL,
  skill_category TEXT NOT NULL, -- 'Shooting', 'Passing', 'Attacking', 'Defending', 'Technical'
  level TEXT DEFAULT 'Beginner', -- 'Beginner', 'Intermediate', 'Advanced'
  total_duration INTEGER DEFAULT 60, -- in minutes
  objectives TEXT[], -- array of learning objectives
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table (4 sessions per lesson)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL, -- 1, 2, 3, or 4
  name TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  description TEXT,
  equipment TEXT[], -- array of equipment items
  coaching_points TEXT[], -- array of coaching points
  instructions TEXT, -- detailed instructions
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, session_number)
);

-- Create lesson_deliveries table (tracks when lessons are delivered to teams)
CREATE TABLE lesson_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES users(id),
  delivery_date DATE NOT NULL,
  is_locked BOOLEAN DEFAULT FALSE, -- once locked, date cannot be changed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create session_deliveries table (tracks individual session delivery and feedback)
CREATE TABLE session_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_delivery_id UUID REFERENCES lesson_deliveries(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  delivered BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1-5 stars
  feedback TEXT,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_lessons_age_group ON lessons(age_group);
CREATE INDEX idx_lessons_skill_category ON lessons(skill_category);
CREATE INDEX idx_sessions_lesson_id ON sessions(lesson_id);
CREATE INDEX idx_lesson_deliveries_team_id ON lesson_deliveries(team_id);
CREATE INDEX idx_lesson_deliveries_coach_id ON lesson_deliveries(coach_id);
CREATE INDEX idx_lesson_deliveries_date ON lesson_deliveries(delivery_date);
CREATE INDEX idx_session_deliveries_lesson_delivery_id ON session_deliveries(lesson_delivery_id);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_deliveries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lessons (all authenticated users can read)
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

-- RLS Policies for sessions (all authenticated users can read)
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

-- RLS Policies for lesson_deliveries
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

-- RLS Policies for session_deliveries
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

-- Insert sample lesson data and create sessions for each
DO $$
DECLARE
  lesson1_id UUID;
  lesson2_id UUID;
  lesson3_id UUID;
  lesson4_id UUID;
  lesson5_id UUID;
  lesson6_id UUID;
  lesson7_id UUID;
  lesson8_id UUID;
BEGIN
  -- Insert lessons and capture their IDs
  INSERT INTO lessons (title, description, age_group, skill_category, level, total_duration, objectives)
  VALUES ('Finishing Under Pressure', 'Develop composure and accuracy when shooting under defensive pressure', 'U9', 'Shooting', 'Intermediate', 60, ARRAY['Improve shooting accuracy under pressure', 'Develop quick decision-making in the box', 'Build confidence in 1v1 situations'])
  RETURNING id INTO lesson1_id;

  INSERT INTO lessons (title, description, age_group, skill_category, level, total_duration, objectives)
  VALUES ('Final Third Passing', 'Master passing combinations in the attacking third to create goal-scoring opportunities', 'U10', 'Passing', 'Intermediate', 60, ARRAY['Execute accurate passes in tight spaces', 'Recognize passing opportunities', 'Create goal-scoring chances through combination play'])
  RETURNING id INTO lesson2_id;

  INSERT INTO lessons (title, description, age_group, skill_category, level, total_duration, objectives)
  VALUES ('Defensive Shape', 'Understand and maintain defensive organization as a unit', 'U12', 'Defending', 'Advanced', 60, ARRAY['Maintain compact defensive shape', 'Communicate effectively with teammates', 'Understand pressing triggers'])
  RETURNING id INTO lesson3_id;

  INSERT INTO lessons (title, description, age_group, skill_category, level, total_duration, objectives)
  VALUES ('Attacking Movement', 'Create space and make intelligent runs to support attacking play', 'U11', 'Attacking', 'Intermediate', 60, ARRAY['Make runs to create space', 'Time runs to beat offside trap', 'Support ball carrier with movement'])
  RETURNING id INTO lesson4_id;

  INSERT INTO lessons (title, description, age_group, skill_category, level, total_duration, objectives)
  VALUES ('Ball Control Basics', 'Develop fundamental ball control skills with all parts of the foot', 'U8', 'Technical', 'Beginner', 45, ARRAY['Control ball with inside and outside of foot', 'Develop first touch technique', 'Improve close control in tight spaces'])
  RETURNING id INTO lesson5_id;

  INSERT INTO lessons (title, description, age_group, skill_category, level, total_duration, objectives)
  VALUES ('Counter Attack Play', 'Transition quickly from defense to attack with speed and precision', 'U13', 'Attacking', 'Advanced', 60, ARRAY['Recognize counter-attack opportunities', 'Execute quick transitions', 'Make forward runs at pace'])
  RETURNING id INTO lesson6_id;

  INSERT INTO lessons (title, description, age_group, skill_category, level, total_duration, objectives)
  VALUES ('1v1 Defending', 'Master individual defending techniques in 1v1 situations', 'U10', 'Defending', 'Intermediate', 60, ARRAY['Proper defensive stance and positioning', 'Delay attacker effectively', 'Win ball without fouling'])
  RETURNING id INTO lesson7_id;

  INSERT INTO lessons (title, description, age_group, skill_category, level, total_duration, objectives)
  VALUES ('Crossing & Finishing', 'Deliver accurate crosses and finish from wide positions', 'U12', 'Shooting', 'Advanced', 60, ARRAY['Execute different types of crosses', 'Finish from crosses with headers and volleys', 'Time runs into the box'])
  RETURNING id INTO lesson8_id;

  -- Create 4 sessions for each lesson
  -- Lesson 1 sessions
  INSERT INTO sessions (lesson_id, session_number, name, duration, description, equipment, coaching_points) VALUES
  (lesson1_id, 1, 'Warm-Up & Technical Fundamentals', 15, 'Dynamic warm-up focusing on ball mastery and technical skills', ARRAY['Cones (20)', 'Balls (1 per player)', 'Bibs (2 colors)'], ARRAY['Focus on proper technique', 'Keep intensity high', 'Encourage communication', 'Demonstrate correct form']),
  (lesson1_id, 2, 'Skill Introduction', 15, 'Introduce and practice the core skill in a controlled environment', ARRAY['Cones (12)', 'Balls (1 per pair)', 'Small goals (4)'], ARRAY['Break down the skill into steps', 'Provide individual feedback', 'Progress from simple to complex', 'Celebrate success']),
  (lesson1_id, 3, 'Progressive Skill Development', 15, 'Apply the skill in more challenging scenarios with opposition', ARRAY['Cones (16)', 'Balls (4)', 'Bibs (3 colors)', 'Small goals (4)'], ARRAY['Add pressure gradually', 'Encourage decision-making', 'Reinforce key coaching points', 'Allow players to problem-solve']),
  (lesson1_id, 4, 'Small-Sided Game Application', 15, 'Apply learned skills in game-realistic situations', ARRAY['Cones (8)', 'Balls (2)', 'Bibs (2 colors)', 'Goals (2)'], ARRAY['Let the game be the teacher', 'Minimal stoppages', 'Highlight successful application', 'Encourage positive play']);

  -- Lesson 2 sessions
  INSERT INTO sessions (lesson_id, session_number, name, duration, description, equipment, coaching_points) VALUES
  (lesson2_id, 1, 'Warm-Up & Technical Fundamentals', 15, 'Dynamic warm-up focusing on ball mastery and technical skills', ARRAY['Cones (20)', 'Balls (1 per player)', 'Bibs (2 colors)'], ARRAY['Focus on proper technique', 'Keep intensity high', 'Encourage communication', 'Demonstrate correct form']),
  (lesson2_id, 2, 'Skill Introduction', 15, 'Introduce and practice the core skill in a controlled environment', ARRAY['Cones (12)', 'Balls (1 per pair)', 'Small goals (4)'], ARRAY['Break down the skill into steps', 'Provide individual feedback', 'Progress from simple to complex', 'Celebrate success']),
  (lesson2_id, 3, 'Progressive Skill Development', 15, 'Apply the skill in more challenging scenarios with opposition', ARRAY['Cones (16)', 'Balls (4)', 'Bibs (3 colors)', 'Small goals (4)'], ARRAY['Add pressure gradually', 'Encourage decision-making', 'Reinforce key coaching points', 'Allow players to problem-solve']),
  (lesson2_id, 4, 'Small-Sided Game Application', 15, 'Apply learned skills in game-realistic situations', ARRAY['Cones (8)', 'Balls (2)', 'Bibs (2 colors)', 'Goals (2)'], ARRAY['Let the game be the teacher', 'Minimal stoppages', 'Highlight successful application', 'Encourage positive play']);

  -- Lesson 3 sessions
  INSERT INTO sessions (lesson_id, session_number, name, duration, description, equipment, coaching_points) VALUES
  (lesson3_id, 1, 'Warm-Up & Technical Fundamentals', 15, 'Dynamic warm-up focusing on ball mastery and technical skills', ARRAY['Cones (20)', 'Balls (1 per player)', 'Bibs (2 colors)'], ARRAY['Focus on proper technique', 'Keep intensity high', 'Encourage communication', 'Demonstrate correct form']),
  (lesson3_id, 2, 'Skill Introduction', 15, 'Introduce and practice the core skill in a controlled environment', ARRAY['Cones (12)', 'Balls (1 per pair)', 'Small goals (4)'], ARRAY['Break down the skill into steps', 'Provide individual feedback', 'Progress from simple to complex', 'Celebrate success']),
  (lesson3_id, 3, 'Progressive Skill Development', 15, 'Apply the skill in more challenging scenarios with opposition', ARRAY['Cones (16)', 'Balls (4)', 'Bibs (3 colors)', 'Small goals (4)'], ARRAY['Add pressure gradually', 'Encourage decision-making', 'Reinforce key coaching points', 'Allow players to problem-solve']),
  (lesson3_id, 4, 'Small-Sided Game Application', 15, 'Apply learned skills in game-realistic situations', ARRAY['Cones (8)', 'Balls (2)', 'Bibs (2 colors)', 'Goals (2)'], ARRAY['Let the game be the teacher', 'Minimal stoppages', 'Highlight successful application', 'Encourage positive play']);

  -- Lesson 4 sessions
  INSERT INTO sessions (lesson_id, session_number, name, duration, description, equipment, coaching_points) VALUES
  (lesson4_id, 1, 'Warm-Up & Technical Fundamentals', 15, 'Dynamic warm-up focusing on ball mastery and technical skills', ARRAY['Cones (20)', 'Balls (1 per player)', 'Bibs (2 colors)'], ARRAY['Focus on proper technique', 'Keep intensity high', 'Encourage communication', 'Demonstrate correct form']),
  (lesson4_id, 2, 'Skill Introduction', 15, 'Introduce and practice the core skill in a controlled environment', ARRAY['Cones (12)', 'Balls (1 per pair)', 'Small goals (4)'], ARRAY['Break down the skill into steps', 'Provide individual feedback', 'Progress from simple to complex', 'Celebrate success']),
  (lesson4_id, 3, 'Progressive Skill Development', 15, 'Apply the skill in more challenging scenarios with opposition', ARRAY['Cones (16)', 'Balls (4)', 'Bibs (3 colors)', 'Small goals (4)'], ARRAY['Add pressure gradually', 'Encourage decision-making', 'Reinforce key coaching points', 'Allow players to problem-solve']),
  (lesson4_id, 4, 'Small-Sided Game Application', 15, 'Apply learned skills in game-realistic situations', ARRAY['Cones (8)', 'Balls (2)', 'Bibs (2 colors)', 'Goals (2)'], ARRAY['Let the game be the teacher', 'Minimal stoppages', 'Highlight successful application', 'Encourage positive play']);

  -- Lesson 5 sessions
  INSERT INTO sessions (lesson_id, session_number, name, duration, description, equipment, coaching_points) VALUES
  (lesson5_id, 1, 'Warm-Up & Technical Fundamentals', 15, 'Dynamic warm-up focusing on ball mastery and technical skills', ARRAY['Cones (20)', 'Balls (1 per player)', 'Bibs (2 colors)'], ARRAY['Focus on proper technique', 'Keep intensity high', 'Encourage communication', 'Demonstrate correct form']),
  (lesson5_id, 2, 'Skill Introduction', 15, 'Introduce and practice the core skill in a controlled environment', ARRAY['Cones (12)', 'Balls (1 per pair)', 'Small goals (4)'], ARRAY['Break down the skill into steps', 'Provide individual feedback', 'Progress from simple to complex', 'Celebrate success']),
  (lesson5_id, 3, 'Progressive Skill Development', 15, 'Apply the skill in more challenging scenarios with opposition', ARRAY['Cones (16)', 'Balls (4)', 'Bibs (3 colors)', 'Small goals (4)'], ARRAY['Add pressure gradually', 'Encourage decision-making', 'Reinforce key coaching points', 'Allow players to problem-solve']),
  (lesson5_id, 4, 'Small-Sided Game Application', 15, 'Apply learned skills in game-realistic situations', ARRAY['Cones (8)', 'Balls (2)', 'Bibs (2 colors)', 'Goals (2)'], ARRAY['Let the game be the teacher', 'Minimal stoppages', 'Highlight successful application', 'Encourage positive play']);

  -- Lesson 6 sessions
  INSERT INTO sessions (lesson_id, session_number, name, duration, description, equipment, coaching_points) VALUES
  (lesson6_id, 1, 'Warm-Up & Technical Fundamentals', 15, 'Dynamic warm-up focusing on ball mastery and technical skills', ARRAY['Cones (20)', 'Balls (1 per player)', 'Bibs (2 colors)'], ARRAY['Focus on proper technique', 'Keep intensity high', 'Encourage communication', 'Demonstrate correct form']),
  (lesson6_id, 2, 'Skill Introduction', 15, 'Introduce and practice the core skill in a controlled environment', ARRAY['Cones (12)', 'Balls (1 per pair)', 'Small goals (4)'], ARRAY['Break down the skill into steps', 'Provide individual feedback', 'Progress from simple to complex', 'Celebrate success']),
  (lesson6_id, 3, 'Progressive Skill Development', 15, 'Apply the skill in more challenging scenarios with opposition', ARRAY['Cones (16)', 'Balls (4)', 'Bibs (3 colors)', 'Small goals (4)'], ARRAY['Add pressure gradually', 'Encourage decision-making', 'Reinforce key coaching points', 'Allow players to problem-solve']),
  (lesson6_id, 4, 'Small-Sided Game Application', 15, 'Apply learned skills in game-realistic situations', ARRAY['Cones (8)', 'Balls (2)', 'Bibs (2 colors)', 'Goals (2)'], ARRAY['Let the game be the teacher', 'Minimal stoppages', 'Highlight successful application', 'Encourage positive play']);

  -- Lesson 7 sessions
  INSERT INTO sessions (lesson_id, session_number, name, duration, description, equipment, coaching_points) VALUES
  (lesson7_id, 1, 'Warm-Up & Technical Fundamentals', 15, 'Dynamic warm-up focusing on ball mastery and technical skills', ARRAY['Cones (20)', 'Balls (1 per player)', 'Bibs (2 colors)'], ARRAY['Focus on proper technique', 'Keep intensity high', 'Encourage communication', 'Demonstrate correct form']),
  (lesson7_id, 2, 'Skill Introduction', 15, 'Introduce and practice the core skill in a controlled environment', ARRAY['Cones (12)', 'Balls (1 per pair)', 'Small goals (4)'], ARRAY['Break down the skill into steps', 'Provide individual feedback', 'Progress from simple to complex', 'Celebrate success']),
  (lesson7_id, 3, 'Progressive Skill Development', 15, 'Apply the skill in more challenging scenarios with opposition', ARRAY['Cones (16)', 'Balls (4)', 'Bibs (3 colors)', 'Small goals (4)'], ARRAY['Add pressure gradually', 'Encourage decision-making', 'Reinforce key coaching points', 'Allow players to problem-solve']),
  (lesson7_id, 4, 'Small-Sided Game Application', 15, 'Apply learned skills in game-realistic situations', ARRAY['Cones (8)', 'Balls (2)', 'Bibs (2 colors)', 'Goals (2)'], ARRAY['Let the game be the teacher', 'Minimal stoppages', 'Highlight successful application', 'Encourage positive play']);

  -- Lesson 8 sessions
  INSERT INTO sessions (lesson_id, session_number, name, duration, description, equipment, coaching_points) VALUES
  (lesson8_id, 1, 'Warm-Up & Technical Fundamentals', 15, 'Dynamic warm-up focusing on ball mastery and technical skills', ARRAY['Cones (20)', 'Balls (1 per player)', 'Bibs (2 colors)'], ARRAY['Focus on proper technique', 'Keep intensity high', 'Encourage communication', 'Demonstrate correct form']),
  (lesson8_id, 2, 'Skill Introduction', 15, 'Introduce and practice the core skill in a controlled environment', ARRAY['Cones (12)', 'Balls (1 per pair)', 'Small goals (4)'], ARRAY['Break down the skill into steps', 'Provide individual feedback', 'Progress from simple to complex', 'Celebrate success']),
  (lesson8_id, 3, 'Progressive Skill Development', 15, 'Apply the skill in more challenging scenarios with opposition', ARRAY['Cones (16)', 'Balls (4)', 'Bibs (3 colors)', 'Small goals (4)'], ARRAY['Add pressure gradually', 'Encourage decision-making', 'Reinforce key coaching points', 'Allow players to problem-solve']),
  (lesson8_id, 4, 'Small-Sided Game Application', 15, 'Apply learned skills in game-realistic situations', ARRAY['Cones (8)', 'Balls (2)', 'Bibs (2 colors)', 'Goals (2)'], ARRAY['Let the game be the teacher', 'Minimal stoppages', 'Highlight successful application', 'Encourage positive play']);
END $$;

COMMENT ON TABLE lessons IS 'Stores coaching lesson plans';
COMMENT ON TABLE sessions IS 'Stores the 4 session blocks for each lesson';
COMMENT ON TABLE lesson_deliveries IS 'Tracks when lessons are delivered to teams';
COMMENT ON TABLE session_deliveries IS 'Tracks individual session delivery and coach feedback';
