-- Bulk Lesson Loader
-- Instructions:
-- 1. Copy this template for each lesson you want to add
-- 2. Fill in the details
-- 3. Run the entire file in Supabase SQL Editor

-- TEMPLATE (copy this block for each lesson):
/*
DO $$
DECLARE
  new_lesson_id UUID;
BEGIN
  -- Insert lesson
  INSERT INTO lessons (title, description, age_group, skill_category, level, total_duration, objectives)
  VALUES (
    'LESSON_TITLE_HERE',
    'LESSON_DESCRIPTION_HERE',
    'U9', -- Change to: U4, U5, U6, U7, U8, U9, U10, U11, U12, U13, U14, U15, U16, U17
    'Shooting', -- Change to: Shooting, Passing, Attacking, Defending, Technical
    'Beginner', -- Change to: Beginner, Intermediate, Advanced
    60, -- Duration in minutes
    ARRAY['Objective 1', 'Objective 2', 'Objective 3']
  )
  RETURNING id INTO new_lesson_id;

  -- Create 4 sessions for this lesson
  INSERT INTO sessions (lesson_id, session_number, name, duration, description, equipment, coaching_points) VALUES
  (new_lesson_id, 1, 'Warm-Up & Technical Fundamentals', 15, 'Session 1 description here', 
   ARRAY['Cones (20)', 'Balls (1 per player)', 'Bibs (2 colors)'], 
   ARRAY['Coaching point 1', 'Coaching point 2', 'Coaching point 3', 'Coaching point 4']),
  
  (new_lesson_id, 2, 'Skill Introduction', 15, 'Session 2 description here', 
   ARRAY['Cones (12)', 'Balls (1 per pair)', 'Small goals (4)'], 
   ARRAY['Coaching point 1', 'Coaching point 2', 'Coaching point 3', 'Coaching point 4']),
  
  (new_lesson_id, 3, 'Progressive Skill Development', 15, 'Session 3 description here', 
   ARRAY['Cones (16)', 'Balls (4)', 'Bibs (3 colors)', 'Small goals (4)'], 
   ARRAY['Coaching point 1', 'Coaching point 2', 'Coaching point 3', 'Coaching point 4']),
  
  (new_lesson_id, 4, 'Small-Sided Game Application', 15, 'Session 4 description here', 
   ARRAY['Cones (8)', 'Balls (2)', 'Bibs (2 colors)', 'Goals (2)'], 
   ARRAY['Coaching point 1', 'Coaching point 2', 'Coaching point 3', 'Coaching point 4']);
END $$;
*/

-- ============================================
-- EXAMPLE LESSONS (ready to use)
-- ============================================

-- Lesson 1: Dribbling in Tight Spaces
DO $$
DECLARE
  new_lesson_id UUID;
BEGIN
  INSERT INTO lessons (title, description, age_group, skill_category, level, total_duration, objectives)
  VALUES (
    'Dribbling in Tight Spaces',
    'Develop close control and ability to dribble effectively in congested areas',
    'U9',
    'Technical',
    'Beginner',
    60,
    ARRAY['Master close ball control', 'Use both feet effectively', 'Keep head up while dribbling', 'Change direction quickly']
  )
  RETURNING id INTO new_lesson_id;

  INSERT INTO sessions (lesson_id, session_number, name, duration, description, equipment, coaching_points) VALUES
  (new_lesson_id, 1, 'Warm-Up & Technical Fundamentals', 15, 'Ball mastery exercises focusing on different parts of the foot', 
   ARRAY['Balls (1 per player)', 'Cones (20)'], 
   ARRAY['Use all parts of foot', 'Keep ball close', 'Small touches', 'Stay on toes']),
  
  (new_lesson_id, 2, 'Skill Introduction', 15, 'Dribbling through cone gates with increasing difficulty', 
   ARRAY['Cones (30)', 'Balls (1 per player)'], 
   ARRAY['Look up between touches', 'Accelerate through gates', 'Use both feet', 'Body feints to change direction']),
  
  (new_lesson_id, 3, 'Progressive Skill Development', 15, 'Dribbling in tight grid with defenders', 
   ARRAY['Cones (20)', 'Balls (6)', 'Bibs (2 colors)'], 
   ARRAY['Protect ball with body', 'Quick changes of direction', 'Recognize space', 'Be confident']),
  
  (new_lesson_id, 4, 'Small-Sided Game Application', 15, 'Small-sided games in tight spaces', 
   ARRAY['Cones (12)', 'Balls (2)', 'Bibs (2 colors)', 'Small goals (4)'], 
   ARRAY['Dribble when space is available', 'Take on defenders', 'Keep possession', 'Support teammates']);
END $$;

-- Lesson 2: First Touch Control
DO $$
DECLARE
  new_lesson_id UUID;
BEGIN
  INSERT INTO lessons (title, description, age_group, skill_category, level, total_duration, objectives)
  VALUES (
    'First Touch Control',
    'Master receiving the ball and setting up the next action with a quality first touch',
    'U10',
    'Technical',
    'Beginner',
    60,
    ARRAY['Cushion the ball on first touch', 'Receive across the body', 'Set up next action', 'Use different surfaces of foot']
  )
  RETURNING id INTO new_lesson_id;

  INSERT INTO sessions (lesson_id, session_number, name, duration, description, equipment, coaching_points) VALUES
  (new_lesson_id, 1, 'Warm-Up & Technical Fundamentals', 15, 'Static receiving practice with different surfaces', 
   ARRAY['Balls (1 per pair)', 'Cones (10)'], 
   ARRAY['Soft first touch', 'Receive on back foot', 'Body shape open', 'Eyes on ball']),
  
  (new_lesson_id, 2, 'Skill Introduction', 15, 'Receiving and turning in pairs', 
   ARRAY['Balls (1 per pair)', 'Cones (20)'], 
   ARRAY['Check shoulder before receiving', 'Touch away from pressure', 'Use inside and outside of foot', 'Accelerate after touch']),
  
  (new_lesson_id, 3, 'Progressive Skill Development', 15, 'Receiving under pressure from defender', 
   ARRAY['Balls (6)', 'Cones (16)', 'Bibs (2 colors)'], 
   ARRAY['Protect the ball', 'First touch into space', 'Be aware of defender', 'Quick decision making']),
  
  (new_lesson_id, 4, 'Small-Sided Game Application', 15, 'Game with bonus points for quality first touches', 
   ARRAY['Balls (2)', 'Cones (8)', 'Bibs (2 colors)', 'Goals (2)'], 
   ARRAY['Receive and play forward', 'Create space with movement', 'Support ball carrier', 'Communicate']);
END $$;

-- Lesson 3: Passing Accuracy
DO $$
DECLARE
  new_lesson_id UUID;
BEGIN
  INSERT INTO lessons (title, description, age_group, skill_category, level, total_duration, objectives)
  VALUES (
    'Passing Accuracy',
    'Develop accurate passing technique over various distances',
    'U11',
    'Passing',
    'Intermediate',
    60,
    ARRAY['Pass with inside of foot accurately', 'Weight passes correctly', 'Pass to correct foot', 'Communicate before passing']
  )
  RETURNING id INTO new_lesson_id;

  INSERT INTO sessions (lesson_id, session_number, name, duration, description, equipment, coaching_points) VALUES
  (new_lesson_id, 1, 'Warm-Up & Technical Fundamentals', 15, 'Passing in pairs at increasing distances', 
   ARRAY['Balls (1 per pair)', 'Cones (10)'], 
   ARRAY['Inside of foot', 'Non-kicking foot beside ball', 'Follow through to target', 'Strike through center of ball']),
  
  (new_lesson_id, 2, 'Skill Introduction', 15, 'Passing through gates to targets', 
   ARRAY['Balls (1 per pair)', 'Cones (30)', 'Small goals (8)'], 
   ARRAY['Accuracy over power', 'Pass to feet or space', 'Weight of pass', 'Look before you pass']),
  
  (new_lesson_id, 3, 'Progressive Skill Development', 15, 'Passing patterns with movement', 
   ARRAY['Balls (4)', 'Cones (20)', 'Bibs (2 colors)'], 
   ARRAY['Pass and move', 'Create passing angles', 'Time your runs', 'One-touch when possible']),
  
  (new_lesson_id, 4, 'Small-Sided Game Application', 15, 'Possession game with passing targets', 
   ARRAY['Balls (2)', 'Cones (8)', 'Bibs (2 colors)'], 
   ARRAY['Keep possession', 'Play forward when possible', 'Support in triangles', 'Switch play']);
END $$;

-- ============================================
-- ADD YOUR LESSONS BELOW THIS LINE
-- Copy the template from the top and fill in your details
-- ============================================

