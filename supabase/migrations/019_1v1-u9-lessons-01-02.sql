-- Migration 019: U9 1v1 Lessons 01 and 02
-- Both lessons for 1v1 skill

-- ============================================================================
-- SESSIONS FOR U9 1v1 LESSON 01
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
  'session-1v1-basics-u9',
  'U9',
  'warmup',
  20,
  '1v1 Basics',
  'Set up a 20x20 meter square. Players in pairs, one ball per pair. One player (attacker) starts with ball, other player (defender) stands 3 meters away. Attacker tries to dribble past defender to opposite side of square. Defender tries to delay and channel attacker. Switch roles after each attempt. Focus on attacker: change of pace, change of direction, protect the ball. Defender: stay on feet, jockey, force to side.',
  ARRAY['Cones (8) for square boundary', 'Balls (1 per pair)', 'Bibs (2 colors)'],
  ARRAY['Attacker: change pace and direction', 'Use your body to protect ball', 'Accelerate past defender', 'Defender: stay on your feet', 'Jockey and delay', 'Force attacker to one side'],
  ARRAY['Demonstrate 1v1: attacker vs defender basics', 'Practice: attacker tries to beat defender (3 minutes)', 'Switch roles (3 minutes)', 'Add challenge: attacker must reach opposite line (4 minutes)', 'Switch roles again (4 minutes)', 'Emphasize change of pace and direction'],
  ARRAY['Execute change of pace in 1v1', 'Use body to protect ball', 'Beat defender with acceleration'],
  '20x20 meter square marked with cones at corners. Multiple pairs spread across square. Focus on one pair: orange player (attacker) with football (soccer ball) facing blue player (defender without ball) 3 meters away. Arrows show attacker movement: change of direction with curved arrow, then acceleration past defender with solid arrow. Blue defender in jockey stance. Emphasis on change of pace with annotation "CHANGE PACE + DIRECTION". Small inset showing body positioning: attacker between ball and defender.'
),
(
  'session-1v1-moves-u9',
  'U9',
  'skill_intro',
  15,
  '1v1 Moves',
  'Set up five 9x9 meter grids. In each grid, one attacker with ball faces one defender. Teach three simple moves: 1) Step-over (fake one way, go other way), 2) Drag-back (pull ball back, turn), 3) Chop (inside of foot, change direction). Attackers practice each move 3 times, then switch roles. Emphasize selling the fake and explosive change of direction.',
  ARRAY['Cones (20) for 5 grids', 'Balls (5)', 'Bibs (2 colors)'],
  ARRAY['Sell the fake with your body', 'Make defender believe you', 'Explosive change after fake', 'Keep ball close during move', 'Accelerate away after move', 'Practice all three moves'],
  ARRAY['Demonstrate step-over: fake, go opposite (2 minutes)', 'Practice step-over in grids (2 minutes)', 'Demonstrate drag-back: pull, turn (2 minutes)', 'Practice drag-back (2 minutes)', 'Demonstrate chop: inside foot, change direction (2 minutes)', 'Practice chop (2 minutes)', 'Free practice: choose your move (3 minutes)'],
  ARRAY['Execute step-over move', 'Execute drag-back move', 'Execute chop move'],
  'Five 9x9 meter grids arranged in a row. Focus on center grid showing three-stage sequence: 1) Orange player with football (soccer ball) performing step-over (foot over ball, body fake left), 2) Same player performing drag-back (pulling ball back with sole), 3) Same player performing chop (inside foot cutting ball right). Blue defender in each stage reacting to fake. Arrows show ball movement and direction changes. Large annotation "3 MOVES: STEP-OVER, DRAG-BACK, CHOP". Small inset showing foot positioning for each move.'
),
(
  'session-1v1-pressure-u9',
  'U9',
  'progressive',
  15,
  '1v1 Under Pressure',
  'Set up three 12x9 meter channels with small goals at both ends. 1v1 in each channel: attacker tries to score, defender tries to win ball and score in opposite goal. Play for 60 seconds then switch. Add pressure: if attacker doesn''t shoot within 10 seconds, defender gets bonus point. Emphasizes quick decision-making and attacking with purpose.',
  ARRAY['Cones (12) for 3 channels', 'Small goals (6)', 'Balls (3)', 'Bibs (2 colors)'],
  ARRAY['Attack with purpose', 'Make quick decisions', 'Don''t dribble too long', 'Shoot when you have chance', 'If defender wins ball, attack quickly', 'Be positive and brave'],
  ARRAY['Set up channels with goals at both ends', 'Explain rules: score in opponent goal, 10-second rule', 'Demonstrate: attack quickly, shoot early', 'First round: 1v1, 60 seconds each (5 minutes)', 'Switch roles (5 minutes)', 'Track points, celebrate decisive play', 'Cool down: discuss when to shoot vs dribble'],
  ARRAY['Make quick 1v1 decisions', 'Attack with purpose under pressure', 'Balance dribbling and shooting'],
  'Three 12x9 meter channels side by side. Each channel has small goals at both ends. Focus on center channel showing 1v1: orange player (attacker) with football (soccer ball) taking on blue player (defender without ball). Arrow shows attacker movement toward goal. Timer icon showing "10 SEC" with emphasis. Scoreboard showing point system. Both goals visible showing two-way play. Emphasis on quick decision-making with annotation "ATTACK WITH PURPOSE".'
),
(
  'session-1v1-game-u9',
  'U9',
  'game',
  15,
  '1v1 Game',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Special Rule: Bonus point awarded for successfully beating a defender 1v1 before scoring (coach or players call it out). Encourages players to take on defenders rather than always passing. Celebrate all 1v1 attempts, successful or not.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)'],
  ARRAY['Look for 1v1 opportunities', 'Be brave and take players on', 'Use your moves', 'Change pace and direction', 'If you beat defender, attack goal', 'Support teammates who try 1v1'],
  ARRAY['Explain rules: bonus point for beating defender 1v1 before scoring', 'Demonstrate: recognize 1v1 moment, attack', 'Play 2 x 6-minute halves with 3-minute break', 'Loudly celebrate all 1v1 attempts', 'During break: ask "When should you try 1v1?"', 'Second half: continue, track 1v1 bonus points', 'Cool down: highlight best 1v1 moments'],
  ARRAY['Recognize 1v1 opportunities in games', 'Execute 1v1 skills in game situations', 'Be confident taking on defenders'],
  '30x20 meter pitch with small goals at each end. 4v4 game: 4 orange players vs 4 blue players. Highlight one 1v1 situation with emphasis circle: orange player with football (soccer ball) taking on blue defender (without ball). Arrows show attacker beating defender with move, then attacking goal. Large annotation "+1 BONUS PT FOR 1v1 BEAT". Show multiple players spread across pitch in realistic game positions. Small inset showing successful 1v1: before (attacker facing defender) and after (attacker past defender).'
);

-- ============================================================================
-- LESSON FOR U9 1v1 LESSON 01
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
  'Take Them On: Introduction to 1v1',
  'Players learn fundamental 1v1 attacking skills: change of pace and direction, three basic moves (step-over, drag-back, chop), making quick decisions under pressure, and recognizing 1v1 opportunities in games.',
  'U9',
  '1v1',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-1v1-basics-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-1v1-moves-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-1v1-pressure-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-1v1-game-u9'),
  65,
  ARRAY['Use change of pace and direction to beat defenders', 'Execute three basic 1v1 moves', 'Make quick decisions in 1v1 situations', 'Recognize and attack 1v1 opportunities in games'],
  ARRAY['Change pace', 'Sell the fake', 'Attack with purpose', 'Be brave'];

-- ============================================================================
-- SESSIONS FOR U9 1v1 LESSON 02
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
  'session-1v1-space-creation-u9',
  'U9',
  'warmup',
  20,
  '1v1 Space Creation',
  'Set up a 20x20 meter square with four small zones (5x5 meters) in each corner. Players in pairs, one ball per pair. Attacker must dribble into any corner zone while defender tries to prevent it. Once in zone, attacker exits and attacks different zone. Focus on creating space: fake one direction, go another. Use body feints and changes of direction to manipulate defender position.',
  ARRAY['Cones (24) for square and corner zones', 'Balls (1 per pair)', 'Bibs (2 colors)'],
  ARRAY['Fake one way, go another', 'Use body feints to move defender', 'Create space with movement', 'Accelerate into space', 'Keep your head up', 'Read defender position'],
  ARRAY['Demonstrate space creation: fake, create gap, accelerate', 'Practice: attack corner zones (4 minutes)', 'Switch roles (4 minutes)', 'Add challenge: must enter 3 different zones (4 minutes)', 'Switch roles (4 minutes)', 'Emphasize body feints and reading defender'],
  ARRAY['Create space with body feints', 'Manipulate defender position', 'Accelerate into created space'],
  '20x20 meter square marked with cones. Four 5x5 meter zones in each corner marked with different colored cones. Multiple pairs spread across square. Focus on one pair: orange player (attacker) with football (soccer ball) using body feint (shown with dotted arrow) to fake left, then accelerating right (solid arrow) into corner zone. Blue defender (without ball) reacting to fake. Emphasis on space creation with annotation "FAKE → CREATE SPACE → ACCELERATE". Small inset showing body feint technique: shoulders drop one way, hips turn other way.'
),
(
  'session-1v1-advanced-moves-u9',
  'U9',
  'skill_intro',
  15,
  '1v1 Advanced Moves',
  'Set up five 9x9 meter grids. Teach three advanced moves: 1) Scissors (double step-over), 2) Cruyff turn (fake kick, pull behind standing leg), 3) Elastico (outside-inside quick touch). Attackers practice each move against passive defender, then active defender. Emphasizes timing, selling the fake, and explosive exit.',
  ARRAY['Cones (20) for 5 grids', 'Balls (5)', 'Bibs (2 colors)'],
  ARRAY['Timing is everything', 'Sell the fake completely', 'Explosive exit after move', 'Practice slowly first', 'Speed comes with repetition', 'Choose right move for situation'],
  ARRAY['Demonstrate scissors: double step-over, explosive exit (2 minutes)', 'Practice scissors vs passive defender (2 minutes)', 'Demonstrate Cruyff turn: fake kick, pull behind leg (2 minutes)', 'Practice Cruyff turn (2 minutes)', 'Demonstrate elastico: outside-inside touch (2 minutes)', 'Practice elastico (2 minutes)', 'Free practice vs active defender (3 minutes)'],
  ARRAY['Execute scissors move', 'Execute Cruyff turn', 'Execute elastico move'],
  'Five 9x9 meter grids arranged in a row. Focus on center grid showing three-stage sequence: 1) Orange player with football (soccer ball) performing scissors (both feet over ball in circular motion), 2) Same player performing Cruyff turn (fake kick, pull ball behind standing leg), 3) Same player performing elastico (outside foot push, inside foot flick). Blue defender in each stage. Arrows show ball movement and foot paths. Large annotation "ADVANCED: SCISSORS, CRUYFF, ELASTICO". Small inset showing detailed foot positioning for each move with numbered steps.'
),
(
  'session-1v1-combination-play-u9',
  'U9',
  'progressive',
  15,
  '1v1 Combination Play',
  'Set up three 15x12 meter areas with small goals at one end. 2v2 in each area, but special rule: before shooting, one player must beat defender 1v1. Encourages combination play (pass to create 1v1 opportunity) then individual skill. Defender who gets beaten can recover. Play for 90 seconds then rotate.',
  ARRAY['Cones (18) for 3 areas', 'Small goals (3)', 'Balls (3)', 'Bibs (2 colors)'],
  ARRAY['Pass to create 1v1 opportunity', 'Support teammate in 1v1', 'After beating defender, shoot or pass', 'Defenders: recover if beaten', 'Work together to create chances', 'Combine team play with individual skill'],
  ARRAY['Set up areas with goals, explain 1v1 rule before shooting', 'Demonstrate: pass, receive, beat defender 1v1, shoot', 'First round: 2v2, 90 seconds each (5 minutes)', 'Switch roles (5 minutes)', 'Track successful 1v1 beats and goals', 'Cool down: discuss how passing creates 1v1 chances'],
  ARRAY['Combine passing with 1v1 skills', 'Create 1v1 opportunities through teamwork', 'Execute 1v1 moves in combination play'],
  'Three 15x12 meter areas side by side. Each area has small goal at one end. Focus on center area showing 2v2: 2 orange players (one with football (soccer ball), one without) vs 2 blue players (both without ball). Sequence shown: 1) Orange player passes to teammate (dotted arrow), 2) Receiving orange player beats blue defender 1v1 (curved arrow with emphasis), 3) Shot on goal (solid arrow). Large annotation "PASS → 1v1 → SHOOT". Emphasis on combination creating 1v1 opportunity. Scoreboard visible.'
),
(
  'session-1v1-tournament-u9',
  'U9',
  'game',
  15,
  '1v1 Tournament',
  'Set up six 12x9 meter channels with small goals at both ends. Pure 1v1 tournament: each player plays 3 x 2-minute games against different opponents. Winner stays, loser rotates to next channel. Track wins. Two-way play: score in opponent goal. Celebrates individual skill and competitive spirit.',
  ARRAY['Cones (24) for 6 channels', 'Small goals (12)', 'Balls (6)', 'Bibs (optional)', 'Scoreboard or paper for tracking'],
  ARRAY['Use all your moves', 'Be creative and confident', 'Attack and defend', 'Learn from each game', 'Respect your opponent', 'Enjoy the challenge'],
  ARRAY['Set up channels with goals at both ends', 'Explain tournament format: 3 games, 2 minutes each', 'Demonstrate: two-way 1v1, score in opponent goal', 'Round 1: first matchups (2 minutes)', 'Rotate: winners stay, others move (30 seconds)', 'Round 2: new matchups (2 minutes)', 'Rotate again (30 seconds)', 'Round 3: final matchups (2 minutes)', 'Announce winners, celebrate all players', 'Cool down: discuss favorite moves used'],
  ARRAY['Apply all 1v1 skills in competitive setting', 'Demonstrate creativity and confidence', 'Compete with positive spirit'],
  'Six 12x9 meter channels arranged in two rows. Each channel has small goals at both ends. Focus on two channels showing 1v1 matchups: orange player with football (soccer ball) vs blue player (without ball) in each. Arrows show two-way play with both goals as targets. Large tournament bracket or scoreboard visible showing matchups and wins. Emphasis on competitive format with annotation "1v1 TOURNAMENT - 3 GAMES". Show multiple channels with different players competing. Celebration icons for winners.'
);

-- ============================================================================
-- LESSON FOR U9 1v1 LESSON 02
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
  'Master the Moves: Advanced 1v1',
  'Players develop advanced 1v1 skills: creating space with body feints, three advanced moves (scissors, Cruyff turn, elastico), combining passing with 1v1 play, and competing in 1v1 tournament format.',
  'U9',
  '1v1',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-1v1-space-creation-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-1v1-advanced-moves-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-1v1-combination-play-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-1v1-tournament-u9'),
  65,
  ARRAY['Create space using body feints and movement', 'Execute three advanced 1v1 moves', 'Combine passing with 1v1 skills', 'Compete confidently in 1v1 situations'],
  ARRAY['Create space first', 'Timing and selling', 'Combine with teammates', 'Be creative'];

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE sessions IS 'Sessions for U9 1v1 Lessons 01 and 02';
COMMENT ON TABLE lessons IS 'Lessons 01 and 02 for U9 1v1 skill';
