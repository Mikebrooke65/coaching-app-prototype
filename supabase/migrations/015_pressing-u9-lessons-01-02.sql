-- Migration 015: U9 Pressing Lessons 01 and 02
-- Both lessons for Pressing skill

-- ============================================================================
-- SESSIONS FOR U9 PRESSING LESSON 01
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
  'session-close-down-speed-u9',
  'U9',
  'warmup',
  20,
  'Close Down Speed',
  'Set up a 20x20 meter square. Players work in pairs: one attacker with ball standing still, one defender 10 meters away. On coach signal, defender sprints to close down attacker, slowing down in final 2 meters to arrive in balanced position. Attacker cannot move initially. Progress to attacker taking one touch as defender arrives. Switch roles every 60 seconds. Focus on sprint speed then control.',
  ARRAY['Cones (8) for square boundary', 'Bibs (2 colors)', 'Balls (1 per pair)'],
  ARRAY['Sprint at full speed initially', 'Slow down in last 2 meters', 'Arrive in balanced stance', 'Get low and wide', 'Don''t overrun the ball', 'Be ready to react'],
  ARRAY['Demonstrate close down: fast approach, controlled arrival', 'Practice without ball movement (2 minutes)', 'Add attacker touch as defender arrives (3 minutes)', 'Switch roles (repeat both)', 'Increase distance to 15 meters (3 minutes each role)', 'Emphasize speed with control'],
  ARRAY['Close down space quickly', 'Arrive in balanced defensive position', 'Control approach speed'],
  '20x20 meter square marked with cones at corners. Multiple pairs spread throughout: orange player (attacker) with football (soccer ball) standing in center, blue player (defender) without football (soccer ball) positioned 10 meters away. Solid arrow shows defender''s sprint toward attacker. Dashed line shows final 2 meters where defender slows down. Emphasis circle shows balanced arrival position. Small inset showing correct body position: low, wide, balanced.'
),
(
  'session-pressing-angles-u9',
  'U9',
  'skill_intro',
  15,
  'Pressing Angles',
  'Set up five 12x12 meter grids with small goal at one end of each. Attacker with ball tries to dribble to goal. Defender starts at side of grid and must press at an angle to force attacker away from goal. Defender cannot tackle, only press and guide. Key concept: Press from the side to show attacker one direction. Start at 50% speed.',
  ARRAY['Cones (20) for 5 grids', 'Small goals (5)', 'Balls (1 per pair)', 'Bibs (2 colors)'],
  ARRAY['Approach from the side, not straight on', 'Show attacker away from goal', 'Force them to one side', 'Stay on your toes', 'Adjust angle as they move', 'Don''t dive in'],
  ARRAY['Set up grids, demonstrate pressing angle concept', 'Show correct angle: force attacker wide, away from goal', 'Practice at 50% speed (3 minutes)', 'Switch roles (3 minutes)', 'Increase to 70% speed (2 minutes each role)', 'Discuss: Why press from the side?'],
  ARRAY['Understand pressing angles', 'Force attackers into less dangerous areas', 'Control direction of play'],
  'Five 12x12 meter grids arranged in a row. Each grid has small goal at one end. Focus on center grid: orange player (attacker) with football (soccer ball) in center, blue player (defender) without football (soccer ball) approaching from side at angle. Curved arrow shows defender''s angled approach. Dotted line shows forced direction away from goal. Small goal at top. Emphasis on angle of approach with annotation "PRESS FROM SIDE". Inset showing incorrect straight-on approach with X mark.'
),
(
  'session-pressing-triggers-u9',
  'U9',
  'progressive',
  15,
  'Pressing Triggers',
  'Set up three 18x12 meter channels. 2v1 in each channel (2 attackers vs 1 defender). Attackers pass between themselves. Defender presses when: 1) Bad touch, 2) Pass is played, 3) Attacker faces own goal. Coach calls out trigger moments. Defender scores 1 point for winning ball, attackers score 1 point for 5 consecutive passes. Emphasizes recognizing when to press.',
  ARRAY['Cones (18) for 3 channels', 'Balls (3)', 'Bibs (2 colors)'],
  ARRAY['Watch for heavy touches', 'Press when pass is played', 'Press when attacker turns away', 'Sprint to the trigger moment', 'Stay patient between triggers', 'Recover if you miss'],
  ARRAY['Set up channels, explain three pressing triggers', 'Demonstrate each trigger: bad touch, pass, facing away', 'First round: coach calls out triggers (5 minutes)', 'Second round: defender identifies triggers themselves (5 minutes)', 'Track points, celebrate good pressing decisions', 'Cool down: discuss which trigger is easiest to spot'],
  ARRAY['Recognize pressing trigger moments', 'Time pressing runs effectively', 'Make decisions about when to press'],
  'Three 18x12 meter channels side by side. Focus on center channel showing 2v1: 2 orange players (one with football (soccer ball), one without) vs 1 blue player (defender without ball). Three emphasis zones marked: 1) "HEAVY TOUCH" near ball with starburst, 2) "PASS MOMENT" showing pass between attackers, 3) "FACING AWAY" showing attacker turned. Arrows show defender''s pressing runs to each trigger. Small legend explaining three triggers. Scoreboard showing point system.'
),
(
  'session-pressing-game-u9',
  'U9',
  'game',
  15,
  'Pressing Game',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Special Rule: Defending team gets 1 bonus point if they win the ball in opponent''s half within 5 seconds of losing possession. Regular goals = 1 point. This encourages immediate pressing after losing the ball (counter-pressing).',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)', 'Stopwatch'],
  ARRAY['Press immediately when you lose the ball', 'Work together to press', 'Force mistakes in their half', 'Sprint to close down', 'Don''t give them time'],
  ARRAY['Explain rules and bonus point system clearly', 'Demonstrate counter-pressing: lose ball, immediate pressure', 'Play 2 x 6-minute halves with 3-minute break', 'Coach counts 5 seconds loudly when ball is lost', 'During break: ask "When is the best time to press?"', 'Second half: continue, track bonus points', 'Cool down: celebrate good pressing examples'],
  ARRAY['Apply pressing in game situations', 'Counter-press after losing possession', 'Work as a team to win ball back quickly'],
  '30x20 meter pitch with small goals at each end. 4v4 game: 4 orange players vs 4 blue players. Pitch divided in half with dotted line. Orange player just lost football (soccer ball) to blue player in orange half (opponent''s half). Show orange players immediately pressing blue player with ball. Large "5 SECONDS!" timer annotation. Emphasis on pressing in opponent''s half with shaded zone. Small annotation showing "+1 bonus pt for winning ball in 5 sec". Arrows show pressing movements from multiple orange players.'
);

-- ============================================================================
-- LESSON FOR U9 PRESSING LESSON 01
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
  'Press to Win: Introduction to Pressing',
  'Players learn the fundamentals of pressing: closing down space quickly, approaching at angles to force direction, and recognizing trigger moments to press. Focus on speed, positioning, and timing.',
  'U9',
  'Pressing',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-close-down-speed-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-pressing-angles-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-pressing-triggers-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-pressing-game-u9'),
  65,
  ARRAY['Close down opponents quickly with controlled approach', 'Use pressing angles to force attackers into less dangerous areas', 'Recognize trigger moments to initiate pressing', 'Apply immediate pressure after losing possession'],
  ARRAY['Sprint then control', 'Angle over straight line', 'Press the trigger', 'Win it back fast'];

-- ============================================================================
-- SESSIONS FOR U9 PRESSING LESSON 02
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
  'session-pressing-pairs-u9',
  'U9',
  'warmup',
  20,
  'Pressing in Pairs',
  'Set up a 20x20 meter square. Groups of 3: one attacker with ball, two defenders without ball. Attacker dribbles slowly. First defender presses ball carrier, second defender covers space behind (cover press). Defenders communicate: "Press!" and "Cover!". Attacker tries to dribble past. Switch roles every 90 seconds. Progress to attacker passing to coach and receiving return pass.',
  ARRAY['Cones (8) for square boundary', 'Bibs (3 colors)', 'Balls (1 per group)', 'Coaches at edges'],
  ARRAY['First defender: press the ball', 'Second defender: cover behind', 'Communicate clearly', 'Work together as a pair', 'Don''t both press at once', 'Adjust positions constantly'],
  ARRAY['Demonstrate pressing pair: one presses, one covers', 'Practice communication: "Press!" "Cover!"', 'First round: slow pace, emphasize roles (3 minutes)', 'Second round: increase pace (3 minutes)', 'Switch roles (repeat both rounds)', 'Add pass and return: defenders adjust positions (4 minutes)'],
  ARRAY['Work in pairs to press effectively', 'Understand press and cover roles', 'Communicate defensive responsibilities'],
  '20x20 meter square marked with cones at corners. Groups of 3: orange player (attacker) with football (soccer ball) dribbling, two blue players (defenders without football (soccer balls)) working together. First blue defender pressing ball carrier closely. Second blue defender positioned 3-4 meters behind providing cover. Speech bubbles showing "Press!" and "Cover!". Arrows show coordinated movement. Emphasis on partnership with dotted line connecting two defenders.'
),
(
  'session-pressing-traps-u9',
  'U9',
  'skill_intro',
  15,
  'Pressing Traps',
  'Set up five 15x10 meter channels. 3v2 in each channel (3 attackers vs 2 defenders). Attackers try to dribble or pass through channel. Defenders work together to trap attackers near sideline or corner. One defender forces attacker toward sideline, partner closes trap. Start at 60% speed. Key concept: Use the line as an extra defender.',
  ARRAY['Cones (20) for 5 channels', 'Balls (5)', 'Bibs (2 colors)'],
  ARRAY['Force attacker to the line', 'Use the line as extra defender', 'Close the trap together', 'Communicate: "Force left!" "I''m closing!"', 'Time your trap carefully', 'Don''t let them escape back inside'],
  ARRAY['Set up channels, demonstrate pressing trap concept', 'Show how to force toward line and close trap', 'Practice at 60% speed (4 minutes)', 'Switch roles (4 minutes)', 'Increase to 80% speed (2 minutes each role)', 'Discuss: Why is the line helpful?'],
  ARRAY['Use boundaries to create pressing traps', 'Coordinate with teammates to close space', 'Force opponents into difficult positions'],
  'Five 15x10 meter channels arranged in a row. Focus on center channel showing 3v2: 3 orange players (one with football (soccer ball), two without) vs 2 blue players (both without football (soccer balls)). Show first blue defender forcing orange attacker toward sideline with angled approach. Second blue defender closing trap from other side. Emphasis zone near sideline showing "TRAP ZONE". Arrows show forcing direction and trap closure. Small annotation "LINE = EXTRA DEFENDER".'
),
(
  'session-team-pressing-shape-u9',
  'U9',
  'progressive',
  15,
  'Team Pressing Shape',
  'Set up three 20x15 meter areas. 4v4 in each area with small goals at ends. When defending team presses, they must maintain compact shape (stay close together). If team is too spread out (more than 10 meters between players), coach stops play. Defending team gets 1 bonus point for winning ball while maintaining good shape. Regular goals = 1 point.',
  ARRAY['Cones (18) for 3 areas', 'Small goals (6)', 'Balls (3)', 'Bibs (2 colors)', 'Measuring tape or markers'],
  ARRAY['Stay close together when pressing', 'Maximum 10 meters between players', 'Press as a unit, not individuals', 'Communicate constantly', 'Adjust shape as ball moves', 'Compact is strong'],
  ARRAY['Set up areas, explain compact shape rule (10-meter maximum)', 'Demonstrate good shape: team stays close while pressing', 'First round: coach stops play when shape is poor (5 minutes)', 'Second round: teams self-monitor shape (5 minutes)', 'Track bonus points for good shape', 'Cool down: discuss why staying close is important'],
  ARRAY['Maintain compact defensive shape while pressing', 'Press as a coordinated unit', 'Understand team pressing principles'],
  'Three 20x15 meter areas side by side. Each area has small goals at both ends. Focus on center area showing 4v4: 4 orange players vs 4 blue players. One orange player has football (soccer ball). Blue team pressing with compact shape. Dotted lines connecting blue players showing maximum 10-meter distances. Emphasis on tight unit with shaded zone around blue team. Small annotation "MAX 10m BETWEEN PLAYERS". Contrast with small inset showing poor shape (spread out) with X mark.'
),
(
  'session-high-press-game-u9',
  'U9',
  'game',
  15,
  'High Press Game',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Pitch divided into thirds. Special Rule: If defending team wins the ball in attacking third (opponent''s defensive third), they get 2 bonus points. Regular goals = 1 point. This encourages pressing high up the pitch to win ball in dangerous areas.',
  ARRAY['Cones (8) for pitch boundaries', 'Markers for thirds', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)'],
  ARRAY['Press high up the pitch', 'Win the ball in their third', 'Work together to press', 'Force them into mistakes', 'Counter-attack quickly after winning ball'],
  ARRAY['Divide pitch into thirds, explain bonus point system', 'Demonstrate high pressing: win ball in attacking third', 'Play 2 x 6-minute halves with 3-minute break', 'Track where ball is won (which third)', 'During break: ask "How can we win the ball higher?"', 'Second half: continue, celebrate high pressing wins', 'Cool down: discuss benefits of winning ball high'],
  ARRAY['Apply pressing in attacking areas', 'Win possession in dangerous zones', 'Transition quickly from pressing to attacking'],
  '30x20 meter pitch with small goals at each end. Pitch divided into three equal thirds with dotted lines. 4v4 game: 4 orange players vs 4 blue players. Focus on attacking third (opponent''s defensive third) with emphasis shading. Show blue team pressing orange players in this zone. One orange player has football (soccer ball) near their own goal. Blue players pressing high. Large annotation "+2 BONUS PTS" in attacking third zone. Arrows show pressing movements and quick counter-attack after winning ball.'
);

-- ============================================================================
-- LESSON FOR U9 PRESSING LESSON 02
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
  'Press Together: Team Pressing',
  'Players develop team pressing skills: working in pairs, creating pressing traps, maintaining compact shape, and pressing high up the pitch. Focus on coordination, communication, and pressing as a unit.',
  'U9',
  'Pressing',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-pressing-pairs-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-pressing-traps-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-team-pressing-shape-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-high-press-game-u9'),
  65,
  ARRAY['Work in pairs with press and cover roles', 'Create and execute pressing traps using boundaries', 'Maintain compact team shape while pressing', 'Press high to win ball in dangerous areas'],
  ARRAY['Press together, not alone', 'Use the line', 'Stay compact', 'Win it high'];

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE sessions IS 'Sessions for U9 Pressing Lessons 01 and 02';
COMMENT ON TABLE lessons IS 'Lessons 01 and 02 for U9 Pressing skill';
