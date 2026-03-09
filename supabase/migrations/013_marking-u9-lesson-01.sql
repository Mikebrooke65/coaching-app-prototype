-- Migration 013: U9 Marking Lesson 01
-- First lesson focusing on staying close and denying space

-- ============================================================================
-- SESSIONS FOR U9 MARKING LESSON 01
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
  'session-stick-like-glue-u9',
  'U9',
  'warmup',
  20,
  'Stick Like Glue',
  'Set up a 20x20 meter square. Players work in pairs without a ball. One player (attacker) moves around the area at walking pace, then jogging pace. Partner (defender) must stay within 1 meter, maintaining close distance without physical contact. Attacker tries to lose defender with changes of direction. Switch roles every 90 seconds. Progression: Add a ball to attacker, defender maintains marking distance.',
  ARRAY['Cones (8) for square boundary', 'Bibs (2 colors)', 'Balls (1 per pair for progression)'],
  ARRAY['Stay within 1 meter of your player', 'Keep your body between player and goal', 'Stay on your toes, ready to move', 'Watch the player and the ball', 'Don''t get too close - maintain space'],
  ARRAY['Demonstrate marking position: close but not touching, side-on stance', 'Players practice without ball: walking pace (2 minutes)', 'Increase to jogging pace (2 minutes)', 'Switch roles (repeat both speeds)', 'Add ball to attacker: defender maintains marking distance (3 minutes each role)', 'Emphasize staying close without fouling'],
  ARRAY['Maintain close distance to opponent', 'Develop awareness of player movement', 'Understand concept of denying space'],
  '20x20 meter square marked with cones at corners. Multiple pairs spread throughout area. Attacker (orange bib) without football (soccer ball) moving around space. Defender (blue bib) without football (soccer ball) staying within 1 meter, maintaining close marking position. Arrows show attacker''s movement with changes of direction and defender''s matching movements staying close. Dotted circle around each pair shows 1-meter marking distance.'
),
(
  'session-goal-side-marking-u9',
  'U9',
  'skill_intro',
  15,
  'Goal Side Marking',
  'Set up five 12x12 meter grids, each with a small goal at one end. In each grid, one attacker with ball, one defender. Attacker dribbles slowly trying to score. Defender must position between attacker and goal (goal side), staying close. Start at 50% speed. Key concept: Always be between your player and the goal. Defender cannot tackle, only mark and block.',
  ARRAY['Cones (20) for 5 grids', 'Small goals (5)', 'Balls (1 per pair)', 'Bibs (2 colors)'],
  ARRAY['Position between player and goal', 'Stay goal side at all times', 'Adjust position as attacker moves', 'Keep low and balanced', 'Use your body to block the path', 'Don''t dive in or reach'],
  ARRAY['Set up grids with goals, demonstrate goal-side positioning', 'Show correct position: between attacker and goal', 'Practice at 50% speed: attacker dribbles, defender marks (3 minutes)', 'Switch roles (3 minutes)', 'Increase to 70% speed (2 minutes each role)', 'Discuss: Why is goal-side position important?'],
  ARRAY['Understand goal-side positioning concept', 'Maintain position between attacker and goal', 'Adjust marking position as play develops'],
  'Five 12x12 meter grids arranged in a row. Each grid has small goal at one end. Attacker (orange bib) with football (soccer ball) dribbling toward goal. Defender (blue bib) without football (soccer ball) positioned between attacker and goal in goal-side position. Diagram shows imaginary line from ball to goal center, with defender on that line. Arrows show attacker''s movement toward goal and defender''s adjustment to maintain goal-side position. Emphasis on correct positioning with checkmark, incorrect positioning (behind attacker) with X mark.'
),
(
  'session-marking-under-pressure-u9',
  'U9',
  'progressive',
  15,
  'Marking Under Pressure',
  'Set up three 18x12 meter channels with small goals at each end. 2v2 in each channel. One team attacks one goal, other team defends and can counter-attack. Defenders must mark their assigned player closely. Coach calls out player numbers to switch marking assignments. Focus on maintaining close marking even when ball moves. First team to 3 goals wins.',
  ARRAY['Cones (18) for 3 channels', 'Small goals (6)', 'Balls (3)', 'Bibs (2 colors)', 'Numbered bibs (1-4)'],
  ARRAY['Stay with your assigned player', 'Communicate with your partner', 'Adjust position when ball moves', 'Stay goal side when defending', 'Mark tightly when ball is near', 'Drop off slightly when ball is far'],
  ARRAY['Set up channels, assign player numbers and marking assignments', 'Explain rules: mark your assigned player, switch on coach call', 'First round: play 2v2, coach calls switches every 60 seconds', 'Second round: players choose when to switch marking', 'Third round: best of 3 goals, emphasize marking discipline', 'Cool down: discuss when marking is most important'],
  ARRAY['Apply marking in game-like situations', 'Maintain marking discipline under pressure', 'Communicate and coordinate with teammates'],
  'Three 18x12 meter channels side by side. Each channel has small goals at both ends. 2v2 game in center channel: 2 orange players (one with football (soccer ball), one without) vs 2 blue players (both without football (soccer ball)). Dotted lines connect each blue defender to their assigned orange attacker showing marking assignments. Arrows show ball movement and player movements. Emphasis circles show tight marking when ball is near, slightly looser marking when ball is far. Numbers on bibs (1-4) visible.'
),
(
  'session-marking-game-u9',
  'U9',
  'game',
  15,
  'Marking Game',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Special Rule: Each player is assigned a specific opponent to mark for the entire game. If your assigned player scores, your team loses 2 points (but scoring team still gets 1 point). This emphasizes marking responsibility. Regular goals = 1 point. Bonus: If you prevent your assigned player from touching the ball for 60 seconds, your team gets 1 bonus point.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)', 'Numbered bibs (1-8)'],
  ARRAY['Know who you are marking', 'Stay close to your assigned player', 'Don''t get distracted by the ball', 'Communicate with teammates', 'Take responsibility for your player'],
  ARRAY['Assign marking partners (1 marks 5, 2 marks 6, etc.)', 'Explain special rules and scoring system clearly', 'Play 2 x 6-minute halves with 3-minute break', 'During break: ask "How can you stop your player getting the ball?"', 'Second half: continue game, track bonus points', 'Cool down: discuss importance of marking discipline'],
  ARRAY['Apply marking principles in full game context', 'Take personal responsibility for assigned opponent', 'Balance marking duties with team play'],
  '30x20 meter pitch with small goals at each end. 4v4 game: 4 orange players vs 4 blue players. Each player has number on bib (1-8). Dotted lines connect marking pairs (orange 1 to blue 5, orange 2 to blue 6, etc.). One orange player has football (soccer ball) in center. Diagram shows all 8 players spread across pitch with marking assignments clearly visible. Emphasis on one marking pair with tight marking distance. Small annotation showing "-2 pts if assigned player scores" near one goal.'
);

-- ============================================================================
-- LESSON FOR U9 MARKING LESSON 01
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
  'Stay Close: Introduction to Marking',
  'Players learn the fundamental principles of marking: staying close to opponents, maintaining goal-side position, and denying space. Focus on individual defensive responsibility and awareness.',
  'U9',
  'Marking',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-stick-like-glue-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-goal-side-marking-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-marking-under-pressure-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-marking-game-u9'),
  65,
  ARRAY['Maintain close distance to assigned opponent', 'Understand and apply goal-side positioning', 'Deny space and limit opponent''s options', 'Take personal responsibility for marking assignment'],
  ARRAY['Stay close, stay goal side', 'Your player, your responsibility', 'Position over aggression', 'Communicate constantly'];

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE sessions IS 'Session 1 for U9 Marking focuses on staying close and goal-side positioning';
COMMENT ON TABLE lessons IS 'Lesson 1 for U9 Marking introduces fundamental marking principles';
