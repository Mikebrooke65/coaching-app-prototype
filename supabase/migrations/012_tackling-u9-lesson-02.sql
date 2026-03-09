-- Migration 012: U9 Tackling Lesson 02
-- Second lesson focusing on timing and reading the game

-- ============================================================================
-- SESSIONS FOR U9 TACKLING LESSON 02
-- ============================================================================

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
  'session-shadow-defender-u9',
  'U9',
  'warmup',
  20,
  'Shadow Defender',
  'Set up a 20x20 meter square. Players work in pairs with one ball per pair. Attacker dribbles slowly around the area. Defender follows 1-2 meters behind without attempting to tackle, focusing on body position and reading the attacker''s movements. Switch roles every 90 seconds. Progression: Defender can attempt tackle when attacker makes a mistake.',
  ARRAY['Cones (8) for square boundary', 'Bibs (2 colors)', 'Balls (1 per pair)'],
  ARRAY['Stay close but not too close', 'Watch the ball and the attacker''s hips', 'Anticipate direction changes', 'Stay balanced and ready', 'Look for heavy touches'],
  ARRAY['Demonstrate shadowing technique: close distance, eyes on ball, ready position', 'Players practice shadowing without ball (1 minute)', 'Add ball: attacker dribbles at 50% speed, defender shadows (2 minutes)', 'Switch roles (2 minutes)', 'Increase to 70% speed (2 minutes each role)', 'Final progression: defender can tackle on heavy touches (3 minutes each role)'],
  ARRAY['Read attacker''s body language and movement', 'Maintain optimal defensive distance', 'Recognize moments of vulnerability'],
  '20x20 meter square marked with cones at corners. Multiple pairs spread throughout area. Attacker (orange bib) dribbles with football (soccer ball) at controlled pace. Defender (blue bib) without football (soccer ball) follows 1-2 meters behind, maintaining ready position. Arrows show attacker''s dribbling path and defender''s shadowing movement staying close behind.'
),
(
  'session-timing-the-tackle-u9',
  'U9',
  'skill_intro',
  15,
  'Timing the Tackle',
  'Set up five 10x10 meter grids. In each grid, attacker dribbles in a figure-8 pattern around two cones. Defender waits at the side and must time their entry to tackle when the ball is furthest from attacker''s body (at the turn). Coach calls "GO" initially, then defenders choose their own moment. Focus on patience and timing over speed.',
  ARRAY['Cones (20) for 5 grids plus markers', 'Balls (1 per pair)', 'Bibs (2 colors)'],
  ARRAY['Wait for the right moment', 'Tackle when ball is away from body', 'Be patient, don''t rush', 'Accelerate into the tackle', 'Stay low and balanced', 'Win the ball cleanly'],
  ARRAY['Set up grids with figure-8 cone pattern', 'Demonstrate the drill: attacker dribbles, defender times entry', 'First round: coach calls "GO" to signal tackle moment (3 minutes)', 'Second round: defenders choose their own moment (3 minutes)', 'Switch roles (repeat both rounds)', 'Emphasize: good timing beats speed'],
  ARRAY['Develop patience in defensive situations', 'Recognize optimal tackling moments', 'Execute tackles with proper timing'],
  'Five 10x10 meter grids arranged in a row. Each grid has two cones set 5 meters apart for figure-8 pattern. Attacker (orange bib) dribbles with football (soccer ball) in figure-8 around cones. Defender (blue bib) without football (soccer ball) waits at edge of grid. Diagram shows attacker''s figure-8 path with arrows, and defender''s timed entry with straight arrow toward the ball at the turn point. Emphasis circle shows optimal tackle moment when ball is furthest from attacker.'
),
(
  'session-pressure-and-tackle-u9',
  'U9',
  'progressive',
  15,
  'Pressure and Tackle',
  'Set up three 18x12 meter channels with end zones (3 meters deep) at each end. Attacker starts in one end zone with ball, must dribble through channel to opposite end zone. Defender starts in middle of channel. Defender must pressure, force to one side, and tackle before attacker reaches end zone. If attacker scores (reaches end zone), they get 1 point. If defender wins ball in middle third, they get 2 points. If defender wins ball in attacking third, they get 3 points.',
  ARRAY['Cones (18) for 3 channels and end zones', 'Balls (3)', 'Bibs (2 colors)', 'Markers for thirds'],
  ARRAY['Close down space quickly', 'Force attacker to weaker side', 'Show them one way only', 'Tackle in the middle or attacking third', 'Don''t dive in early', 'Recover if you miss'],
  ARRAY['Set up channels with marked thirds and end zones', 'Explain scoring system and tactical objective', 'Demonstrate: close down, force direction, tackle at right moment', 'First round: 60 seconds per attempt (4 attempts each)', 'Add pressure: attacker has only 10 seconds to score', 'Final round: best of 5 attempts, track points'],
  ARRAY['Apply pressure to force mistakes', 'Make tactical decisions about when and where to tackle', 'Understand defensive positioning and angles'],
  'Three 18x12 meter channels side by side. Each channel divided into thirds with markers. End zones (3 meters deep) marked at both ends. Attacker (orange bib) starts in one end zone with football (soccer ball), attempts to dribble to opposite end zone. Defender (blue bib) without football (soccer ball) starts in middle third. Arrows show attacker''s forward dribbling path and defender''s closing down movement. Emphasis zones show middle third (2 points) and attacking third (3 points) for winning ball. Dotted line shows forced direction to one side.'
),
(
  'session-transition-tackle-game-u9',
  'U9',
  'game',
  15,
  'Transition Tackle Game',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Special Rules: When a team loses possession, the player who lost it must sprint to touch their own goal line before they can defend. This creates 4v3 situations and emphasizes the importance of winning the ball quickly. Regular goals = 1 point. Winning ball with a clean tackle in opponent''s half = 1 bonus point.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)'],
  ARRAY['Win the ball quickly when you have numbers up', 'Recognize 4v3 situations', 'Tackle with confidence when you have advantage', 'Transition quickly from attack to defense', 'Support teammates in defensive situations'],
  ARRAY['Explain game rules and transition rule clearly', 'Demonstrate what happens when possession is lost', 'Play 2 x 6-minute halves with 3-minute break', 'During break, ask: "When is the best time to tackle in this game?"', 'Second half: continue game, highlight good transition defending', 'Cool down: discuss how numbers up/down affects tackling decisions'],
  ARRAY['Apply tackling in game situations with numerical advantage', 'Recognize and exploit defensive opportunities', 'Transition quickly between attack and defense'],
  '30x20 meter pitch with small goals at each end. Two teams of 4 players (orange vs blue bibs). Standard small-sided game setup. Diagram shows game situation with orange player having just lost football (soccer ball) and sprinting back to goal line (shown with dotted arrow). Blue team now has 4v3 advantage with one blue player pressuring the ball carrier (orange bib with ball). Emphasis circle shows the 4v3 situation. Arrows indicate ball movement and defensive pressure. Star icon shows bonus point zone in opponent''s half.'
);

-- ============================================================================
-- LESSON FOR U9 TACKLING LESSON 02
-- ============================================================================

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
  'Read and React: Timing Your Tackle',
  'Players develop the ability to read the game and choose the right moment to tackle. Focus on patience, timing, and recognizing when the attacker is vulnerable rather than rushing in.',
  'U9',
  'Tackling',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-shadow-defender-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-timing-the-tackle-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-pressure-and-tackle-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-transition-tackle-game-u9'),
  65,
  ARRAY['Read attacker''s body language and recognize vulnerable moments', 'Develop patience and timing rather than rushing into tackles', 'Apply pressure to force mistakes before tackling', 'Make smart decisions about when and where to tackle'],
  ARRAY['Patience over aggression', 'Timing is everything', 'Read the game', 'Tackle with purpose'];

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE sessions IS 'Session 2 for U9 Tackling focuses on timing and reading the game';
COMMENT ON TABLE lessons IS 'Lesson 2 for U9 Tackling emphasizes patience and decision-making';
