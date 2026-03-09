-- Migration 020: U9 Passing/Receiving Lessons 01 and 02
-- Both lessons for Passing/Receiving skill

-- ============================================================================
-- SESSIONS FOR U9 PASSING/RECEIVING LESSON 01
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
  'session-passing-basics-u9',
  'U9',
  'warmup',
  20,
  'Passing Basics',
  'Set up a 20x20 meter square. Players in pairs, one ball per pair, standing 8 meters apart. Practice passing back and forth using inside of foot. Focus on technique: approach ball at angle, plant foot beside ball, strike through center with inside of foot, follow through toward target. Progress from stationary to moving passes. Switch to weaker foot after 5 minutes.',
  ARRAY['Cones (8) for square boundary', 'Balls (1 per pair)', 'Bibs (optional)'],
  ARRAY['Use inside of foot', 'Plant foot beside ball', 'Strike through center of ball', 'Follow through to target', 'Keep ankle firm', 'Pass to feet, not space'],
  ARRAY['Demonstrate passing technique: approach, plant, strike, follow through', 'Practice stationary passes (4 minutes)', 'Progress to moving passes: pass and move (4 minutes)', 'Switch to weaker foot (4 minutes)', 'Add one-touch passing (4 minutes)', 'Emphasize technique over speed'],
  ARRAY['Execute proper passing technique', 'Pass accurately with inside of foot', 'Use both feet for passing'],
  '20x20 meter square marked with cones at corners. Multiple pairs of orange players positioned 8 meters apart. One player with football (soccer ball) passing to partner (without ball). Arrows show pass direction and player movement after pass. Large inset diagram showing passing technique in three stages: 1) approach at angle, 2) plant foot beside ball/strike with inside of foot, 3) follow through toward target. Emphasis on technique with checkmarks for correct form.'
),
(
  'session-receiving-first-touch-u9',
  'U9',
  'skill_intro',
  15,
  'Receiving and First Touch',
  'Set up five 9x9 meter grids. Players in pairs in each grid. One player passes, other receives and controls. Focus on first touch: cushion the ball, control into space, prepare for next action. Teach three receiving surfaces: inside of foot (most common), outside of foot (turn away), sole of foot (stop dead). Rotate roles every 2 minutes.',
  ARRAY['Cones (20) for 5 grids', 'Balls (5)', 'Bibs (optional)'],
  ARRAY['Get your body behind the ball', 'Cushion the ball on first touch', 'Control into space, not under your feet', 'Look before you receive', 'Use different surfaces', 'Prepare for next action'],
  ARRAY['Demonstrate receiving: body position, cushion, control into space', 'Practice inside of foot control (3 minutes)', 'Practice outside of foot control (3 minutes)', 'Practice sole of foot control (3 minutes)', 'Free practice: choose surface based on next action (4 minutes)', 'Discuss: When to use each surface?'],
  ARRAY['Receive ball with good first touch', 'Control ball into space', 'Use three different receiving surfaces'],
  'Five 9x9 meter grids arranged in a row. Focus on center grid showing three-stage sequence: 1) Orange player receiving with inside of foot (cushioning ball into space), 2) Same player receiving with outside of foot (turning away from pressure), 3) Same player receiving with sole of foot (stopping ball dead). Partner orange player with football (soccer ball) passing in each stage. Arrows show ball movement and control direction. Large annotation "3 SURFACES: INSIDE, OUTSIDE, SOLE". Small inset showing body position for receiving: sideways on, eyes on ball.'
),
(
  'session-passing-under-pressure-u9',
  'U9',
  'progressive',
  15,
  'Passing Under Pressure',
  'Set up three 15x12 meter areas. 3v1 in each area: three orange players keep possession, one blue defender tries to win ball. Orange players score 1 point for 5 consecutive passes. Defender scores 1 point for winning ball or forcing error. Play for 90 seconds then rotate defender. Emphasizes quick passing decisions, movement off ball, and receiving under pressure.',
  ARRAY['Cones (18) for 3 areas', 'Balls (3)', 'Bibs (2 colors)'],
  ARRAY['Pass and move', 'Create passing angles', 'Look before you receive', 'Pass quickly under pressure', 'Support the ball carrier', 'Communicate'],
  ARRAY['Set up areas, explain scoring: 5 passes = 1 pt, win ball = 1 pt', 'Demonstrate: quick passing, movement, support', 'First round: 3v1, 90 seconds each (5 minutes)', 'Switch defenders (5 minutes)', 'Track points, celebrate good passing sequences', 'Cool down: discuss importance of movement'],
  ARRAY['Pass accurately under defensive pressure', 'Move to create passing angles', 'Receive and pass quickly'],
  'Three 15x12 meter areas side by side. Focus on center area showing 3v1: 3 orange players (one with football (soccer ball), two without) vs 1 blue player (defender without ball). Dotted lines show passing options between orange players. Arrows show player movement to create angles. Blue defender pressuring ball carrier. Emphasis on quick passing with annotation "5 PASSES = 1 PT". Scoreboard showing point system. Small inset showing proper support positioning: create triangles.'
),
(
  'session-passing-game-u9',
  'U9',
  'game',
  15,
  'Passing Game',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Special Rule: Team must complete 3 passes before they can shoot. Passes reset after shot, tackle, or out of bounds. Encourages possession play and teamwork. Count passes loudly to help players track.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)'],
  ARRAY['Keep possession', 'Pass and move', 'Support teammates', 'Count your passes', 'Create space', 'Shoot after 3 passes'],
  ARRAY['Explain rules: must complete 3 passes before shooting', 'Demonstrate: pass, pass, pass, shoot', 'Play 2 x 6-minute halves with 3-minute break', 'Count passes loudly to help players', 'During break: ask "How do you create space for passes?"', 'Second half: continue, celebrate good passing sequences', 'Cool down: highlight best team passing'],
  ARRAY['Apply passing skills in game situations', 'Maintain possession through passing', 'Work as team to create shooting opportunities'],
  '30x20 meter pitch with small goals at each end. 4v4 game: 4 orange players vs 4 blue players. Show passing sequence: orange player with football (soccer ball) passing to teammate (dotted arrow), who passes to another teammate (dotted arrow), who shoots (solid arrow). Large annotation "3 PASSES BEFORE SHOOTING". Pass counter visible showing "1... 2... 3... SHOOT!". Multiple players spread across pitch in realistic game positions with emphasis on support and movement.'
);

-- ============================================================================
-- LESSON FOR U9 PASSING/RECEIVING LESSON 01
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
  'Pass and Move: Introduction to Passing/Receiving',
  'Players learn fundamental passing and receiving skills: proper passing technique with inside of foot, first touch control using three surfaces, passing under pressure in 3v1, and maintaining possession in games.',
  'U9',
  'Passing/Receiving',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-passing-basics-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-receiving-first-touch-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-passing-under-pressure-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-passing-game-u9'),
  65,
  ARRAY['Execute proper passing technique with inside of foot', 'Control ball with good first touch using three surfaces', 'Pass accurately under defensive pressure', 'Maintain possession through passing in games'],
  ARRAY['Inside of foot', 'Cushion and control', 'Pass and move', 'Keep possession'];

-- ============================================================================
-- SESSIONS FOR U9 PASSING/RECEIVING LESSON 02
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
  'session-passing-patterns-u9',
  'U9',
  'warmup',
  20,
  'Passing Patterns',
  'Set up a 20x20 meter square with cones in center forming a diamond. Groups of 4 players, one ball per group. Practice three passing patterns: 1) Square pattern (pass and follow), 2) Diamond pattern (pass to opposite corner), 3) Triangle pattern (pass and rotate). Each pattern for 5 minutes. Focus on timing, weight of pass, and movement after passing.',
  ARRAY['Cones (12) for square and patterns', 'Balls (1 per group of 4)', 'Bibs (optional)'],
  ARRAY['Pass with correct weight', 'Time your movement', 'Follow your pass', 'Communicate', 'Keep the pattern flowing', 'Look up before passing'],
  ARRAY['Demonstrate square pattern: pass and follow to next position', 'Practice square pattern (5 minutes)', 'Demonstrate diamond pattern: pass to opposite corner', 'Practice diamond pattern (5 minutes)', 'Demonstrate triangle pattern: pass and rotate', 'Practice triangle pattern (5 minutes)', 'Free practice: choose pattern (3 minutes)'],
  ARRAY['Execute passing patterns with timing', 'Weight passes appropriately', 'Move after passing'],
  '20x20 meter square marked with cones. Center area shows three different passing patterns side by side: 1) Square pattern with 4 orange players at corners (one with football (soccer ball)), arrows showing pass and follow movement, 2) Diamond pattern with 4 orange players (one with football (soccer ball)), arrows showing diagonal passes, 3) Triangle pattern with 3 orange players (one with football (soccer ball)), arrows showing pass and rotate. Large annotation "3 PATTERNS: SQUARE, DIAMOND, TRIANGLE". Emphasis on movement after pass with curved arrows.'
),
(
  'session-receiving-on-the-move-u9',
  'U9',
  'skill_intro',
  15,
  'Receiving on the Move',
  'Set up five 12x12 meter grids. Players in pairs, one ball per pair. Passer stays stationary, receiver moves continuously. Receiver must receive ball while moving, control, and pass back, then move to different position. Focus on receiving on the move: check away, check to ball, open body position, first touch forward. Switch roles every 3 minutes.',
  ARRAY['Cones (20) for 5 grids', 'Balls (5)', 'Bibs (optional)'],
  ARRAY['Check away from ball first', 'Then check to ball', 'Open your body to see field', 'First touch forward into space', 'Receive on the move, not standing still', 'Create space with movement'],
  ARRAY['Demonstrate receiving on move: check away, check to, open body', 'Practice: receiver moving, passer stationary (3 minutes)', 'Switch roles (3 minutes)', 'Add defender: passive pressure (3 minutes)', 'Switch roles with pressure (3 minutes)', 'Discuss: Why check away first?'],
  ARRAY['Receive ball while moving', 'Check away then check to ball', 'Control with open body position'],
  'Five 12x12 meter grids arranged in a row. Focus on center grid showing sequence: 1) Orange receiver (without ball) checking away from orange passer (with football (soccer ball)) shown with dotted arrow, 2) Same receiver checking back to ball shown with solid arrow, 3) Receiver controlling ball with open body position (sideways on) and first touch forward. Arrows show movement pattern: away, to, control forward. Large annotation "CHECK AWAY → CHECK TO → OPEN BODY". Small inset showing open body position: sideways on, can see passer and field.'
),
(
  'session-combination-passing-u9',
  'U9',
  'progressive',
  15,
  'Combination Passing',
  'Set up three 18x12 meter areas with small goals at one end. 3v2 in each area: three attackers try to score, two defenders try to win ball. Attackers must use combination play: one-twos, overlaps, third-man runs. Score 2 points for goal after combination play, 1 point for regular goal. Play for 90 seconds then rotate. Emphasizes creative passing and movement.',
  ARRAY['Cones (18) for 3 areas', 'Small goals (3)', 'Balls (3)', 'Bibs (2 colors)'],
  ARRAY['Play one-twos: pass and move', 'Make overlapping runs', 'Use third-man runs', 'Pass and move into space', 'Create 2v1 situations', 'Be creative'],
  ARRAY['Set up areas with goals, explain combination play and scoring', 'Demonstrate one-two: pass, move, receive back', 'Demonstrate overlap: pass, run around, receive', 'First round: 3v2, 90 seconds each (5 minutes)', 'Switch roles (5 minutes)', 'Track combination goals, celebrate creativity', 'Cool down: discuss best combinations'],
  ARRAY['Execute one-two combinations', 'Make overlapping runs', 'Create scoring chances through passing'],
  'Three 18x12 meter areas side by side. Each area has small goal at one end. Focus on center area showing 3v2: 3 orange players (one with football (soccer ball), two without) vs 2 blue players (both without ball). Show two combination examples: 1) One-two combination with curved arrows (pass, move, receive back), 2) Overlap run with player running around ball carrier. Large annotation "2 PTS COMBINATION GOAL, 1 PT REGULAR". Emphasis on creative movement and passing. Scoreboard visible.'
),
(
  'session-possession-game-u9',
  'U9',
  'game',
  15,
  'Possession Game',
  '4v4 game on a 30x20 meter pitch with four small goals (two at each end). Teams can score in either goal at their attacking end. Special Rule: Bonus point for scoring after 5+ consecutive passes. Encourages possession, switching play, and finding open goals. Multiple scoring options create more passing opportunities.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (4)', 'Balls (2)', 'Bibs (2 colors)'],
  ARRAY['Keep possession', 'Switch play to open goal', 'Pass and move constantly', 'Count your passes', 'Look for open goal', 'Support from all angles'],
  ARRAY['Explain rules: score in either goal, bonus for 5+ passes', 'Demonstrate: keep possession, switch to open goal', 'Play 2 x 6-minute halves with 3-minute break', 'Count passes loudly, celebrate 5+ sequences', 'During break: ask "How do you switch play?"', 'Second half: continue, track bonus points', 'Cool down: highlight best possession sequences'],
  ARRAY['Maintain possession through passing', 'Switch play to find space', 'Create scoring opportunities as team'],
  '30x20 meter pitch with four small goals (two at each end, one on each side). 4v4 game: 4 orange players vs 4 blue players. Orange player with football (soccer ball) in center. Dotted lines show passing options to teammates. Arrows show potential switches of play to open goals. Large annotation "SCORE IN EITHER GOAL + BONUS FOR 5+ PASSES". Pass counter visible. Multiple players spread across pitch with emphasis on support angles and switching play. Show both goals at one end to emphasize options.'
);

-- ============================================================================
-- LESSON FOR U9 PASSING/RECEIVING LESSON 02
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
  'Keep It Moving: Advanced Passing/Receiving',
  'Players develop advanced passing and receiving skills: executing passing patterns with timing, receiving on the move with checking movements, combination passing (one-twos and overlaps), and maintaining possession with switching play.',
  'U9',
  'Passing/Receiving',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-passing-patterns-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-receiving-on-the-move-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-combination-passing-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-possession-game-u9'),
  65,
  ARRAY['Execute passing patterns with proper timing and weight', 'Receive ball while moving with checking movements', 'Use combination passing (one-twos and overlaps)', 'Maintain possession and switch play in games'],
  ARRAY['Weight and timing', 'Check away and to', 'Combinations', 'Switch play'];

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE sessions IS 'Sessions for U9 Passing/Receiving Lessons 01 and 02';
COMMENT ON TABLE lessons IS 'Lessons 01 and 02 for U9 Passing/Receiving skill';
