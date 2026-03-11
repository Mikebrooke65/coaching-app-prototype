-- Migration 028: Academy Shielding Lesson 01
-- Source: Bailey Junior Academy Slide 1 (10.1.25, #8-12 players)
-- Division: Academy | Team Type: Junior Football
-- Bailey's coaching points, objectives, focus and durations preserved exactly.
-- Additional coaching points generated to meet 5-6 per session standard.
-- Organisation, equipment, steps, and pitch layout generated from his content.

-- ============================================================================
-- SESSION 1: Ball Mastery & Juggling (Warmup) — 15 minutes
-- ============================================================================
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-shielding-ball-mastery-junior',
  'U9',
  'warmup',
  15,
  'Ball Mastery & Juggling',
  'Set up a 20x20 metre grid. Each player has a ball. Players dribble freely within the area performing ball mastery skills on the coach''s call: toe taps, sole rolls, inside-outside, Cruyff turns, drag-backs. After each skill burst (30 seconds), players juggle for 20 seconds. Finish with max speed dribbling races across the grid. Keep intensity high with short, sharp bursts.',
  ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours for later sessions)'],
  ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to move', 'Acceleration with turns and fakes', 'Keep ball close to feet during mastery work', 'Quick feet — short sharp touches', 'Use all parts of the foot'],
  ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate first ball mastery skill (toe taps), players copy for 30 seconds', 'Call out turns: Cruyff, drag-back, inside-outside — 30 seconds each with 20 seconds juggling between', 'Progress to max speed dribbling: sprint to far cone and back', 'Add competition: first to complete 3 laps wins', 'Cool down with free juggling — count personal best'],
  ARRAY['Build intensity and engagement through short sharp bursts', 'Develop close ball control and turning technique', 'Improve juggling confidence and variations'],
  '20x20 metre grid marked with cones at corners and midpoints. 8-12 players each with a football (soccer ball) (orange bibs) spread throughout the area. Arrows show random dribbling patterns with sharp turns. Players performing ball mastery skills in space. No defenders in this session.'
);


-- ============================================================================
-- SESSION 2: Shark Attack (Skill Intro) — 10 minutes
-- ============================================================================
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-shielding-shark-attack-junior',
  'U9',
  'skill_intro',
  10,
  'Shark Attack',
  'Use the same 20x20 metre grid. All players dribble with a ball. Select 2-3 players as "sharks" (no ball, wearing different bibs). Sharks try to kick dribblers'' balls out of the grid. If your ball is kicked out, you become a shark. Last player with a ball wins. Emphasise shielding the ball away from sharks — body between ball and defender. Reset and play multiple rounds.',
  ARRAY['Cones (8) for grid boundary', 'Balls (1 per player minus sharks)', 'Bibs (different colour for sharks)'],
  ARRAY['Body between ball and shark at all times', 'Shield with your arm out for balance', 'Scan — know where the sharks are before they arrive', 'Use quick reactions to turn away from pressure', 'Keep the ball on the foot furthest from the shark', 'Stay low and balanced when shielding'],
  ARRAY['Explain Shark Attack rules: sharks kick balls out, last player wins', 'Select 2 sharks, remaining players dribble with a ball', 'Play first round — observe who naturally shields', 'Pause and demonstrate shielding technique: body sideways, ball on far foot', 'Play second round — coach calls out "shield!" when shark approaches', 'Play final round — add extra shark for more pressure'],
  ARRAY['Introduce shielding concept in a fun, competitive game', 'Create pressure and awareness of defenders approaching', 'Prepare players for structured 1v1 shielding drill'],
  '20x20 metre grid. Most players (orange bibs) dribbling with a football (soccer ball). 2-3 sharks (blue bibs) without balls chasing and trying to kick balls out. Arrows show sharks closing down dribblers. Highlighted player demonstrating shielding position: body between ball and approaching shark.'
);

-- ============================================================================
-- SESSION 3: 1 v 1 Shielding (Progressive) — 15 minutes
-- ============================================================================
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-shielding-1v1-junior',
  'U9',
  'progressive',
  15,
  '1 v 1 Shielding',
  'Set up 8x8 metre boxes, one pair per box. Attacker starts with the ball, defender tries to win it. Attacker''s goal is to keep possession for 30 seconds using shielding technique. If defender wins the ball, roles swap immediately. Coach times rounds and calls switches. Progress by reducing box size to 6x6 metres to increase pressure. Focus on body position, open shape, and switching the ball to the safe foot.',
  ARRAY['Cones (16) for 4 boxes', 'Balls (1 per pair)', 'Bibs (2 colours)'],
  ARRAY['Shield by getting your body between the ball and defender', 'Open body shape — see both ball and player', 'Adjust and switch ball to other foot when defender comes ball-side', 'Use your arm for balance and to feel the defender', 'Stay strong and low — bend your knees', 'Move the ball constantly — don''t stand still'],
  ARRAY['Set up 8x8m boxes, one pair per box with one ball', 'Demonstrate shielding: body between ball and defender, open body shape', 'Round 1: attacker shields for 30 seconds, defender applies light pressure', 'Round 2: increase defender pressure to 75%', 'Round 3: shrink box to 6x6m — full pressure', 'Competition: who can shield longest without losing the ball?'],
  ARRAY['Teach correct shielding technique with body positioning', 'Build physicality and ball protection habits', 'Develop ability to switch ball to safe foot under pressure'],
  '4 boxes of 8x8 metres marked with cones. Each box has one attacker (orange bib) with football (soccer ball) and one defender (blue bib). Attacker shown in shielding position: body sideways between ball and defender, arm out for balance, ball on far foot. Arrows show defender''s pressure direction and attacker switching ball to opposite foot.'
);

-- ============================================================================
-- SESSION 4: Shielding Game (Game Application) — 20 minutes
-- ============================================================================
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-shielding-game-junior',
  'U9',
  'game',
  20,
  'Shielding Game',
  'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Special rule: entire team must be over the halfway line before they can score. This encourages team movement, support play, and creates natural shielding situations as players hold the ball waiting for teammates to push up. Play 2 x 8-minute halves with a 4-minute break. Minimal coaching — let the game teach.',
  ARRAY['Cones (8) for pitch boundary and halfway line', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
  ARRAY['Movement — get forward to support the ball carrier', 'Support angles — give the shielder passing options', 'Decision making — when to shield, when to pass, when to dribble', 'Hold the ball up and wait for teammates to push up', 'Communicate — call for the ball or tell teammates to push up', 'Transition quickly when you win the ball'],
  ARRAY['Explain the halfway rule: whole team over halfway before you can score', 'Play first half (8 minutes) — observe shielding in game context', 'Half-time: ask players when they needed to shield and why', 'Play second half (8 minutes) — encourage shielding when under pressure', 'Cool down: players share one shielding moment from the game'],
  ARRAY['Apply shielding technique in a real game context', 'Encourage team movement and transitions', 'Develop decision making around when to shield vs pass'],
  '40x30 metre pitch with goals at each end. Halfway line marked with cones. Two teams (orange vs blue bibs), 4-6 per side. Dotted line shows halfway mark. Arrows show team pushing forward together. Highlighted player near halfway line shielding football (soccer ball) while waiting for teammates to advance.'
);

-- ============================================================================
-- LESSON: Academy Shielding Lesson 01
-- ============================================================================
INSERT INTO lessons (
  title, description, age_group, skill_category, level,
  session_1_id, session_2_id, session_3_id, session_4_id,
  total_duration, objectives, coaching_focus,
  division, team_type
)
SELECT
  'Shielding',
  'Players learn how to protect the ball under pressure using correct body positioning, open body shape, and switching the ball to the safe foot. Progresses from fun warm-up games through structured 1v1 practice to full game application with a halfway rule that creates natural shielding situations.',
  'U9',
  'Shielding',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-academy-shielding-ball-mastery-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-shielding-shark-attack-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-shielding-1v1-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-shielding-game-junior'),
  60,
  ARRAY['Introduce shielding technique and body positioning', 'Build ball protection habits under pressure', 'Develop scanning and awareness of approaching defenders', 'Apply shielding in game situations with team movement'],
  ARRAY['Body between ball and defender', 'Open body shape — see ball and player', 'Switch ball to safe foot', 'Movement and support angles'],
  'Academy',
  'Junior Football';
