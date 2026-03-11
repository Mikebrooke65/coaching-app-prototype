-- Migration 029: Academy Lessons Batch
-- All remaining Bailey Junior Academy lessons (slides 2-40, excluding duplicates)
-- Source: Bailey's Google Slides, scraped content in bailey-lessons-raw.md
-- Division: Academy | Team Type: Junior Football
-- Bailey's coaching points, objectives, focus and durations preserved exactly.
-- Additional coaching points generated to meet 5-6 per session standard.
-- Organisation, equipment, steps, and pitch layout generated from his content.

BEGIN;

-- ============================================================================
-- SLIDE 2: 2 v 2s / Games
-- Header: Junior Academy ID | 2 v 2s / Games | 12.1.25 | #8-12 players
-- ============================================================================

-- Session 1: Passing in 2s (Warmup — 5 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-2v2-passing-in-2s-junior',
  'U9',
  'warmup',
  5,
  'Passing in 2s',
  'Players pair up, one ball per pair, spread across a 20x20 metre grid. Partners stand 8-10 metres apart and pass back and forth using inside foot (punch pass). Focus on firm, accurate passes with no spin or bobble. Make it competitive: first pair to 20 passes wins. Rotate partners after each round.',
  ARRAY['Cones (8) for grid boundary', 'Balls (1 per pair)', 'Bibs (2 colours)'],
  ARRAY['Inside foot — strike through the middle of the ball', 'Strong pass — firm enough to reach partner cleanly', 'No spin — punch through the ball, don''t wrap around it', 'First to 20 passes — keep intensity high', 'Lock your ankle on contact', 'Follow through toward your target'],
  ARRAY['Pair up, one ball per pair, 8-10 metres apart', 'Demonstrate punch pass: inside foot, firm, no spin', 'Round 1: pass back and forth, first to 20 wins', 'Round 2: rotate partners, repeat', 'Round 3: increase distance to 12 metres', 'Highlight best technique — who has the cleanest pass?'],
  ARRAY['Develop firm, accurate inside foot passing', 'Build competitive intensity from the start', 'Observe and correct passing technique'],
  '20x20 metre grid. Multiple pairs (orange bibs) spread throughout, each with a football (soccer ball). Partners face each other 8-10 metres apart. Arrows show ball travelling back and forth between partners. Clean passing lines emphasised.'
);

-- Session 2: Passing Interference (Skill Intro — 5 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-2v2-passing-interference-junior',
  'U9',
  'skill_intro',
  5,
  'Passing Interference',
  'Same 20x20 metre grid. Pairs continue passing but now 2-3 defenders roam the area trying to intercept. Passers must scan, move off their marker, and find space to receive. Encourage one-twos, receive and turn, and skill moves to accelerate away after receiving. Switch defenders every 90 seconds.',
  ARRAY['Cones (8) for grid boundary', 'Balls (1 per pair)', 'Bibs (3 colours — passers, partners, defenders)'],
  ARRAY['Body shape — open up to see the whole area', 'First touch — control away from pressure', 'Movement — don''t stand still, create passing angles', 'Scan before receiving — know where defenders are', 'Play one-twos to beat the interference', 'Accelerate after receiving to create space'],
  ARRAY['Explain rules: defenders try to intercept, passers keep possession', 'Select 2-3 defenders, remaining players pass in pairs', 'Play first round — observe scanning and movement', 'Pause: demonstrate receive and turn technique', 'Play second round — encourage one-twos', 'Switch defenders every 90 seconds'],
  ARRAY['Add pressure and decision making to passing', 'Encourage scanning before receiving', 'Develop receive and turn under pressure'],
  '20x20 metre grid. Pairs (orange bibs) passing with a football (soccer ball). 2-3 defenders (blue bibs) roaming and trying to intercept. Arrows show passing lines and defender movement. Highlighted player showing open body shape receiving the ball.'
);

-- Session 3: 2 v 2s (Progressive — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-2v2-battles-junior',
  'U9',
  'progressive',
  15,
  '2 v 2s',
  'Set up multiple 15x12 metre pitches with small goals at each end. 2v2 games in each pitch. Ball starts with coach who plays it in — both pairs react and compete. If a goal is scored or ball goes out, coach plays a new ball in immediately to keep transitions fast. Rotate opponents every 3 minutes. Focus on reaction, aggression to score, and ideas to break through.',
  ARRAY['Cones (16) for 4 mini pitches', 'Small goals (8)', 'Balls (6)', 'Bibs (2 colours)'],
  ARRAY['Reaction and transition — be first to the ball', 'Aggression to score — attack the goal with intent', 'Ideas to break through: 1v1, one-two, D-run, overlap', 'Defend as a pair — communicate and cover', 'Win the ball back quickly when you lose it', 'Celebrate goals — keep energy high'],
  ARRAY['Set up 2v2 pitches with small goals', 'Explain rules: coach plays ball in, react and compete', 'Play first round — 3 minutes per opponent', 'Rotate opponents', 'Play second round — emphasise transition speed', 'Final round — tournament: track goals scored'],
  ARRAY['Build attacking and defending habits in small groups', 'Encourage fast transitions between attack and defence', 'Develop ideas to break through defensive shape'],
  'Four 15x12 metre mini pitches with small goals at each end. 2v2 in each pitch: 2 orange vs 2 blue players. One pair attacking with football (soccer ball), other defending. Arrows show attacking movement and passing options. Coach positioned at the side with spare balls.'
);

-- Session 4: Games (Game — 45 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-2v2-games-junior',
  'U9',
  'game',
  45,
  'Games',
  'Age-appropriate game formats on full-size pitches for the age group. U9: 2 x 7v7 games. U10/U11: 4 x 6v6 half-field games. U12: 2 x 7v7 games. Rotate teams between games so everyone plays different opponents. Keep it competitive with a league table or tournament format. Minimal coaching — let the game be the teacher.',
  ARRAY['Cones (16) for pitch boundaries', 'Goals (4)', 'Balls (4)', 'Bibs (3-4 colours for team rotation)'],
  ARRAY['Rotate teams — everyone plays different opponents', 'Make it competitive — track scores, create a league', 'Let the game teach — minimal stoppages', 'Encourage players to use skills from earlier sessions', 'Praise good examples of 2v2 play in the game', 'Keep energy and intensity high throughout'],
  ARRAY['Set up pitches for age-appropriate format', 'Organise teams and explain rotation/tournament format', 'Game 1: 8-10 minutes, then rotate', 'Game 2: 8-10 minutes, then rotate', 'Continue rotation until all teams have played', 'Announce results, celebrate effort and skill'],
  ARRAY['Apply 2v2 concepts in full game situations', 'Experience competitive game formats', 'Develop game understanding through play'],
  'Full-size pitch for age group. 7v7 game: orange vs blue bibs. Standard game setup with goals at each end. Players spread across the pitch in game positions. Football (soccer ball) in play. Scoreboard showing tournament format.'
);

-- LESSON: 2 v 2s / Games
INSERT INTO lessons (
  title, description, age_group, skill_category, level,
  session_1_id, session_2_id, session_3_id, session_4_id,
  total_duration, objectives, coaching_focus,
  division, team_type
)
SELECT
  '2 v 2s / Games',
  'Players develop passing technique, scanning, and decision making through paired passing drills before progressing to competitive 2v2 battles. Finishes with extended game time in age-appropriate formats to apply concepts learned.',
  'U9',
  '1v1',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-academy-2v2-passing-in-2s-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-2v2-passing-interference-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-2v2-battles-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-2v2-games-junior'),
  70,
  ARRAY['Develop firm, accurate punch pass technique', 'Scan and move to create passing angles under pressure', 'Build attacking and defending habits in 2v2 situations', 'Apply concepts in competitive game formats'],
  ARRAY['Punch pass quality', 'Scan before receiving', 'React and transition', 'Be competitive'],
  'Academy',
  'Junior Football';


-- ============================================================================
-- SLIDE 3: 1 v 1 – Defending
-- Header: Junior Academy ID | 1 v 1 – Defending | 17.1.25 | #8-12 players
-- ============================================================================

-- Session 1: Ball Mastery & Juggling (Warmup — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-1v1defending-ball-mastery-junior',
  'U9',
  'warmup',
  15,
  'Ball Mastery & Juggling',
  'Set up a 20x20 metre grid. Each player has a ball. Players dribble freely performing ball mastery skills on the coach''s call: toe taps, sole rolls, inside-outside, turns, drag-backs. Alternate between skill bursts (30 seconds) and juggling (20 seconds). Finish with short sharp dribbling races. Keep intensity high throughout.',
  ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours for later sessions)'],
  ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to move', 'Acceleration with turns and fakes', 'Keep ball close to feet during mastery work', 'Quick feet — short sharp touches', 'Use both feet for all skills'],
  ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate ball mastery skills: toe taps, sole rolls', 'Skill bursts: 30 seconds each with 20 seconds juggling between', 'Progress to turns: Cruyff, drag-back, inside-outside', 'Add max speed dribbling races across the grid', 'Cool down with free juggling — count personal best'],
  ARRAY['Build intensity and engagement through short sharp bursts', 'Develop close ball control and turning technique', 'Improve juggling confidence'],
  '20x20 metre grid marked with cones at corners and midpoints. 8-12 players each with a football (soccer ball) (orange bibs) spread throughout the area. Arrows show random dribbling patterns with sharp turns.'
);

-- Session 2: 1 v 1 Line Football (Skill Intro — 10 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-1v1defending-line-football-junior',
  'U9',
  'skill_intro',
  10,
  '1 v 1 Line Football',
  'Set up 10x8 metre channels with a line at each end. 1v1: attacker tries to dribble over the defender''s end line to score. Defender must close down, adopt correct body shape, force the attacker to their weaker foot, and wait for a big touch before attempting to win the ball. If defender wins it, they counter-attack the opposite line. 45 seconds per go, then switch roles.',
  ARRAY['Cones (12) for 3 channels', 'Balls (3)', 'Bibs (2 colours)'],
  ARRAY['Get out quick — close the space fast', 'Slow down — don''t dive in when you arrive', 'Posture and body shape — side-on, on toes, knees bent', 'Force weaker foot — show them one way', 'Wait for the big touch — then pounce', 'Stay on your feet — be patient'],
  ARRAY['Set up channels with end lines marked', 'Demonstrate defensive approach: close down, slow down, body shape', 'Round 1: attacker at 50% speed, defender practises approach', 'Round 2: full speed, defender must force direction', 'Round 3: add counter-attack — defender scores if they win ball', 'Switch partners and repeat'],
  ARRAY['Build defensive habits and discipline', 'Learn correct body shape for 1v1 defending', 'Develop patience — don''t dive in'],
  'Three 10x8 metre channels side by side. Each channel has end lines marked with cones. Attacker (orange bib) with football (soccer ball) at one end, defender (blue bib) at the other. Arrows show defender closing down and attacker trying to dribble past. Defender shown in side-on stance.'
);

-- Session 3: 1 v 1 with Goals/Gates (Progressive — 10 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-1v1defending-goals-gates-junior',
  'U9',
  'progressive',
  10,
  '1 v 1 with Goals/Gates',
  'Set up 12x10 metre areas with one large goal at one end and two small gates at the other. Attacker starts with ball and tries to score in the big goal (3 points). Defender tries to win the ball and dribble through either small gate (1 point each). Defender must steer the attacker away from the high-value goal toward the lower-value gates. 45 seconds per go, then switch.',
  ARRAY['Cones (16) for areas and gates', 'Small goals (2)', 'Large goal (1) or cones', 'Balls (3)', 'Bibs (2 colours)'],
  ARRAY['Repeat all previous defending points', 'Lead attacker away from the high-value goal', 'Body position — angle your approach to force direction', 'Be patient — don''t commit too early', 'Win the ball and counter quickly', 'Communicate — tell yourself where to force them'],
  ARRAY['Set up areas with big goal and two small gates', 'Explain scoring: big goal = 3 pts, small gates = 1 pt each', 'Demonstrate steering attacker away from big goal', 'Round 1: 45 seconds per go, track points', 'Round 2: switch roles', 'Final round: best of 3 — who gets most points?'],
  ARRAY['Add direction and decision making to defending', 'Learn to steer attackers away from danger', 'Apply all 1v1 defending principles with purpose'],
  'Three 12x10 metre areas. Each has one large goal at one end and two small cone gates at the other. Attacker (orange bib) with football (soccer ball) attacks the big goal. Defender (blue bib) tries to steer attacker toward small gates. Arrows show defender''s angled approach forcing attacker wide.'
);

-- Session 4: Game (Game — 30 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-1v1defending-game-junior',
  'U9',
  'game',
  30,
  '1 v 1 Defending Game',
  'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Special rule: entire team must be over the halfway line before they can score (halfway rule). This creates natural 1v1 defending situations as teams push up. Play 2 x 12-minute halves with a 6-minute break. Focus on defensive shape and press triggers. Minimal coaching — let the game teach.',
  ARRAY['Cones (8) for pitch boundary and halfway line', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
  ARRAY['Defensive shape — stay organised as a team', 'Press triggers — when to press and when to hold', 'Apply 1v1 defending when isolated', 'Force attackers away from goal', 'Transition — win the ball and attack quickly', 'Communicate with teammates'],
  ARRAY['Explain the halfway rule: whole team over halfway before scoring', 'Play first half (12 minutes) — observe 1v1 defending in game', 'Half-time: ask "When did you need to defend 1v1?"', 'Play second half (12 minutes) — encourage press triggers', 'Cool down: players share one defending moment from the game'],
  ARRAY['Apply 1v1 defending principles in a real game', 'Develop defensive shape and press triggers', 'Experience defending in game situations'],
  '40x30 metre pitch with goals at each end. Halfway line marked with cones. Two teams (orange vs blue bibs), 4-6 per side. Highlighted defender in 1v1 situation showing correct body shape. Football (soccer ball) with attacking team.'
);

-- LESSON: 1 v 1 – Defending
INSERT INTO lessons (
  title, description, age_group, skill_category, level,
  session_1_id, session_2_id, session_3_id, session_4_id,
  total_duration, objectives, coaching_focus,
  division, team_type
)
SELECT
  '1 v 1 – Defending',
  'Players learn the fundamentals of 1v1 defending: closing down, body shape, forcing direction, and patience. Progresses from line football through directional defending with goals/gates to full game application with defensive shape and press triggers.',
  'U9',
  '1v1',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-academy-1v1defending-ball-mastery-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-1v1defending-line-football-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-1v1defending-goals-gates-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-1v1defending-game-junior'),
  65,
  ARRAY['Close down quickly and adopt correct body shape', 'Force attacker to weaker foot with patient defending', 'Steer attackers away from high-value scoring areas', 'Apply 1v1 defending principles in game situations'],
  ARRAY['Get out quick, slow down', 'Side-on body shape', 'Force weaker foot', 'Wait for the big touch'],
  'Academy',
  'Junior Football';


-- ============================================================================
-- SLIDE 4: Pass & Control / Games
-- Header: Junior Academy ID | Pass & Control / Games | 19.1.25 | #8-12 players
-- NOTE: Bailey only had 3 sessions (Passing, Games, Speed Relays).
-- Reordered to fit 4-session framework: warmup, skill_intro, progressive, game.
-- ============================================================================

-- Session 1: Passing (Warmup — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-passcontrol-games-passing-junior',
  'U9',
  'warmup',
  15,
  'Passing',
  'Players pair up, one ball per pair, spread across a 20x20 metre grid. Start with punch pass practice: inside foot, firm pass, back foot control. Partners stand 10 metres apart. Progress to movement off a cone: player passes, then moves to a new cone before receiving the return. Add touch limits (2-touch, then 1-touch). Make competitive: first pair to complete 30 passes wins.',
  ARRAY['Cones (12) for grid and movement markers', 'Balls (1 per pair)', 'Bibs (2 colours)'],
  ARRAY['Movement off cone — don''t stand still after passing', 'Punch pass — firm, inside foot, no spin', 'Back foot control — receive across your body', 'Quick ball speed — pass and move immediately', 'Lock ankle on contact for a clean strike', 'Open body shape to see the field while receiving'],
  ARRAY['Pair up, 10 metres apart, demonstrate punch pass', 'Static passing: 2 minutes, focus on technique', 'Add movement off cone: pass, move to new cone, receive', 'Add touch limits: 2-touch for 2 minutes, then 1-touch', 'Competition: first pair to 30 passes wins', 'Highlight best technique and movement'],
  ARRAY['Develop punch pass technique with back foot control', 'Build movement habits after passing', 'Increase ball speed and passing quality'],
  '20x20 metre grid with cones at corners and additional cones scattered inside as movement markers. Pairs (orange bibs) passing with a football (soccer ball). Arrows show pass-and-move pattern: player passes then runs to a new cone.'
);

-- Session 2: Speed Relays (Skill Intro — 5 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-passcontrol-games-relays-junior',
  'U9',
  'skill_intro',
  5,
  'Speed Relays',
  'Set up relay lanes 20 metres long. Teams of 3-4 line up at one end. Player dribbles to the far cone and passes back to the next player, who controls and goes. Variations: right foot only, left foot only, pass at the top cone. Finish with sprint races (no ball). Keep it fast and competitive.',
  ARRAY['Cones (8) for 4 relay lanes', 'Balls (1 per team)', 'Bibs (4 colours for teams)'],
  ARRAY['Dribbling technique — close control at speed', 'Punch pass reminder — firm pass back to teammate', 'Right foot only — develop weaker foot', 'Left foot only — build confidence on both sides', 'Sprint with purpose — compete to win', 'Clean first touch — control and go immediately'],
  ARRAY['Set up relay lanes, organise teams of 3-4', 'Round 1: dribble to cone and back, pass to next player', 'Round 2: right foot only', 'Round 3: left foot only', 'Round 4: dribble to cone, pass back from the top', 'Final round: sprint races — no ball, pure speed'],
  ARRAY['Build speed and dribbling technique under pressure', 'Reinforce punch pass in a competitive relay format', 'Develop both feet through foot-specific challenges'],
  'Four 20-metre relay lanes side by side. Teams of 3-4 (different coloured bibs) lined up at one end. Lead player dribbling with football (soccer ball) toward far cone. Arrows show dribble path and pass back to next player.'
);

-- Session 3: Passing Possession (Progressive — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-passcontrol-games-possession-junior',
  'U9',
  'progressive',
  15,
  'Passing Possession',
  'Set up 15x15 metre grids. 4v2 possession: 4 attackers try to keep the ball, 2 defenders try to win it. Attackers score 1 point for 5 consecutive passes. If defenders win the ball, the player who lost it swaps in. Progress to 4v3 to increase pressure. Focus on passing quality, movement, and decision making under pressure.',
  ARRAY['Cones (12) for 3 grids', 'Balls (3)', 'Bibs (3 colours)'],
  ARRAY['Quality of pass — firm, accurate, to the correct foot', 'Movement after passing — find a new angle', 'Back foot control — open body to see options', 'Play quick and simple — don''t overcomplicate', 'Scan before receiving — know your options early', 'Support the ball carrier — give passing angles'],
  ARRAY['Set up grids, explain 4v2 rules and scoring', 'Demonstrate: pass, move, find new angle', 'Play 4v2 for 5 minutes — track points', 'Progress to 4v3 — increase defensive pressure', 'Play 4v3 for 5 minutes', 'Cool down: which team kept possession longest?'],
  ARRAY['Improve passing quality under defensive pressure', 'Develop movement and support play habits', 'Build decision making in possession'],
  'Three 15x15 metre grids. Each grid has 4v2: 4 attackers (orange bibs) keeping possession of football (soccer ball), 2 defenders (blue bibs) pressing. Arrows show passing lines and movement after passing.'
);

-- Session 4: Games (Game — 45 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-passcontrol-games-game-junior',
  'U9',
  'game',
  45,
  'Games',
  'Age-appropriate game formats. U9: 2 x 7v7 games. U10/U11: 4 x 6v6 half-field games. U12: 2 x 7v7 games. Rotate teams between games so everyone plays different opponents. Keep it competitive with a league table. Minimal coaching — let the game be the teacher. Encourage players to use punch pass and movement habits from earlier sessions.',
  ARRAY['Cones (16) for pitch boundaries', 'Goals (4)', 'Balls (4)', 'Bibs (3-4 colours for team rotation)'],
  ARRAY['Rotate teams — play different opponents each game', 'Make competitive — track scores', 'Encourage punch pass habits in the game', 'Movement after passing — don''t stand and watch', 'Let the game teach — minimal stoppages', 'Praise good passing and movement examples'],
  ARRAY['Set up pitches for age-appropriate format', 'Organise teams and explain rotation', 'Game 1: 8-10 minutes, then rotate', 'Game 2: 8-10 minutes, then rotate', 'Continue rotation until all teams have played', 'Announce results, celebrate effort'],
  ARRAY['Apply passing concepts in full game situations', 'Experience competitive game formats', 'Develop game understanding through play'],
  'Full-size pitch for age group. 7v7 game: orange vs blue bibs. Standard game setup with goals at each end. Football (soccer ball) in play. Players spread across pitch.'
);

-- LESSON: Pass & Control / Games
INSERT INTO lessons (
  title, description, age_group, skill_category, level,
  session_1_id, session_2_id, session_3_id, session_4_id,
  total_duration, objectives, coaching_focus,
  division, team_type
)
SELECT
  'Pass & Control / Games',
  'Players develop punch pass technique, back foot control, and movement after passing. Progresses through paired passing, speed relays, and possession games before extended competitive game time in age-appropriate formats.',
  'U9',
  'Passing/Receiving',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-academy-passcontrol-games-passing-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-passcontrol-games-relays-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-passcontrol-games-possession-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-passcontrol-games-game-junior'),
  80,
  ARRAY['Develop firm punch pass technique with back foot control', 'Build movement habits after passing', 'Maintain possession under pressure in small-sided games', 'Apply passing concepts in competitive game formats'],
  ARRAY['Punch pass quality', 'Back foot control', 'Move after you pass', 'Quick ball speed'],
  'Academy',
  'Junior Football';


-- ============================================================================
-- SLIDE 5: 1 v 1 – 50/50 Contest
-- Header: Junior Academy | 1 v 1 – 50/50 Contest | 26.2.25
-- ============================================================================

-- Session 1: Brazil Skills & Juggling (Warmup — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-5050-brazil-skills-junior',
  'U9',
  'warmup',
  15,
  'Brazil Skills & Juggling',
  'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills freely: toe taps, sole rolls, step-overs, scissors, Cruyff turns. Alternate between skill bursts and juggling challenges. Add competitive elements: juggling records, skill races. Keep intensity high with short sharp bursts.',
  ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (optional)'],
  ARRAY['Eyes up — scan while performing skills', 'On toes — stay light and balanced', 'Acceleration after fakes and turns', 'Keep ball close during mastery work', 'Challenge yourself — try new skills', 'Both feet — don''t just use your strong foot'],
  ARRAY['Set up grid, distribute balls', 'Free ball mastery: toe taps, sole rolls (3 minutes)', 'Add turns: Cruyff, step-over, scissors (3 minutes)', 'Juggling challenge: count personal best (3 minutes)', 'Skill races: first to complete sequence wins (3 minutes)', 'Cool down with free juggling'],
  ARRAY['Build intensity and improve ball control', 'Develop confidence with ball mastery skills', 'Improve juggling technique and consistency'],
  '20x20 metre grid. 8-12 players (orange bibs) each with a football (soccer ball) performing ball mastery skills. Arrows show various skill movements. No defenders.'
);

-- Session 2: Knockout (Skill Intro — 5 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-5050-knockout-junior',
  'U9',
  'skill_intro',
  5,
  'Knockout',
  'All players dribble in a 15x15 metre grid, each with a ball. While protecting their own ball, players try to kick other players'' balls out of the grid. If your ball is kicked out, you do 5 toe taps on the sideline then rejoin. Last player standing wins the round. Emphasise shielding and awareness — keep your body between the ball and opponents.',
  ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (optional)'],
  ARRAY['Keep body between ball and opponent at all times', 'Shield with arm out for balance', 'Scan — know where opponents are approaching from', 'Quick reactions — turn away from pressure', 'Attack others while protecting your own ball', 'Stay low and balanced'],
  ARRAY['Explain rules: kick others'' balls out while keeping yours', 'Play round 1 — observe who shields naturally', 'Pause: demonstrate shielding technique', 'Play round 2 — shrink grid to 12x12m', 'Play round 3 — last player standing wins', 'Celebrate the winner, reset and repeat'],
  ARRAY['Develop fun competitiveness and ball protection', 'Build shielding and awareness habits', 'Encourage scanning and quick reactions'],
  '15x15 metre grid. Multiple players (orange bibs) each dribbling a football (soccer ball). Some players attempting to kick others'' balls out. Highlighted player shielding ball with body between ball and approaching opponent.'
);

-- Session 3: 1 v 1 (Progressive — 10 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-5050-1v1-junior',
  'U9',
  'progressive',
  10,
  '1 v 1 Contest',
  'Set up 10x8 metre channels. 1v1: ball is played into the middle, both players race to win it (50/50 contest). Whoever wins possession attacks the opponent''s end line. Focus on shielding, acceleration, winning mentality, and using your shoulder to hold off the opponent. Dribble across the defender''s path to protect the ball. 30 seconds per go, then reset.',
  ARRAY['Cones (12) for 3 channels', 'Balls (6)', 'Bibs (2 colours)'],
  ARRAY['Body between ball and player — shield immediately', 'Dribble across defender''s path to protect the ball', 'Use your shoulder — be physical and strong', 'Winning mentality — want the ball more than your opponent', 'Accelerate away once you win possession', 'Stay low and balanced in the contest'],
  ARRAY['Set up channels, explain 50/50 contest rules', 'Demonstrate: race to ball, shield, accelerate away', 'Round 1: coach rolls ball in, players contest (3 minutes)', 'Round 2: increase intensity — winner stays on', 'Round 3: tournament — track wins per player', 'Celebrate the most competitive players'],
  ARRAY['Build 1v1 attacking and defending habits', 'Develop shielding and acceleration in contests', 'Foster a winning mentality and competitiveness'],
  'Three 10x8 metre channels. Ball placed in the middle of each channel. Two players (orange and blue bibs) racing from opposite ends to win the football (soccer ball). Arrows show both players converging on the ball. Highlighted player winning the contest and shielding.'
);

-- Session 4: 1 v 1 with Goals (Game — 10 min + 25 min tournament)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-5050-1v1-goals-junior',
  'U9',
  'game',
  35,
  '1 v 1 with Goals & Tournament',
  'Set up 12x10 metre pitches with small goals at each end. 1v1 with goals: ball played in, players contest, winner attacks goal. Add body feints and acceleration to beat the defender. After 10 minutes of structured 1v1s, transition to tournament-style games (25 minutes): 3v3 or 4v4 round-robin with short games. Keep it competitive and high energy throughout.',
  ARRAY['Cones (16) for pitches', 'Small goals (4)', 'Balls (6)', 'Bibs (3-4 colours)'],
  ARRAY['Body feints — sell the fake to create space', 'Acceleration — burst past the defender after the move', 'All previous 1v1 defending points apply', 'Shoot early when you see the goal', 'Be brave — take players on with confidence', 'Transition quickly — attack or defend immediately'],
  ARRAY['Set up 1v1 pitches with small goals', '1v1 with goals: 10 minutes, rotate opponents', 'Transition to tournament: organise 3v3 or 4v4 teams', 'Play round-robin: 4-minute games, rotate', 'Track scores — create a league table', 'Announce winners, celebrate effort and skill'],
  ARRAY['Add finishing decisions to 1v1 contests', 'Apply 50/50 contest skills in game situations', 'Experience competitive tournament format'],
  'Multiple 12x10 metre pitches with small goals. 1v1: orange vs blue player contesting for football (soccer ball). Arrows show body feint and acceleration past defender toward goal. Tournament bracket shown to the side.'
);

-- LESSON: 1 v 1 – 50/50 Contest
INSERT INTO lessons (
  title, description, age_group, skill_category, level,
  session_1_id, session_2_id, session_3_id, session_4_id,
  total_duration, objectives, coaching_focus,
  division, team_type
)
SELECT
  '1 v 1 – 50/50 Contest',
  'Players develop competitiveness, ball protection, and winning mentality through 50/50 contests. Progresses from knockout games through structured 1v1 battles to tournament-style games with goals.',
  'U9',
  '1v1',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-academy-5050-brazil-skills-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-5050-knockout-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-5050-1v1-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-5050-1v1-goals-junior'),
  65,
  ARRAY['Win 50/50 contests with physicality and determination', 'Shield the ball effectively after winning possession', 'Use body feints and acceleration to beat defenders', 'Apply contest skills in competitive game situations'],
  ARRAY['Winning mentality', 'Body between ball and opponent', 'Accelerate after winning', 'Be brave and competitive'],
  'Academy',
  'Junior Football';


-- ============================================================================
-- SLIDE 6: Pass & Control
-- Header: Junior Academy | Pass & Control | 3.2.25
-- NOTE: Slide 10 is content-duplicate of this — skipped.
-- ============================================================================

-- Session 1: Passing (Warmup — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-passcontrol-passing-junior',
  'U9',
  'warmup',
  15,
  'Passing',
  'Players pair up, one ball per pair, in a 20x20 metre grid. Start with punch pass practice at 10 metres. Progress to movement off a cone: pass, move to new position, receive. Add competition: first pair to 20 clean passes wins. Focus on back foot control, movement intensity, and passing quality.',
  ARRAY['Cones (12) for grid and movement markers', 'Balls (1 per pair)', 'Bibs (2 colours)'],
  ARRAY['Movement off cone — create a new passing angle', 'Punch pass — firm, inside foot, through the middle', 'Back foot control — receive across your body', 'Quick ball speed — don''t let the ball slow down', 'Open body shape — see the field while receiving', 'Compete — first to 20 passes wins'],
  ARRAY['Pair up, 10 metres apart, demonstrate punch pass', 'Static passing: focus on technique (3 minutes)', 'Add movement off cone: pass, move, receive (3 minutes)', 'Add competition: first to 20 passes (3 minutes)', 'Increase distance to 12 metres (3 minutes)', 'Highlight best technique and movement'],
  ARRAY['Develop punch pass technique and back foot control', 'Build movement habits after passing', 'Increase passing quality and ball speed'],
  '20x20 metre grid with cones. Pairs (orange bibs) passing a football (soccer ball). Arrows show pass-and-move pattern.'
);

-- Session 2: Rondo 3v1 or 4v1 (Skill Intro — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-passcontrol-rondo-junior',
  'U9',
  'skill_intro',
  15,
  'Rondo (3v1 or 4v1)',
  'Set up 8x8 metre squares. 3v1 or 4v1 rondo: attackers keep possession around the outside, defender in the middle tries to win the ball. If defender wins it, the player who lost it swaps in. Focus on quality of pass, back foot touch, direction and weight of first touch, and movement intensity. Progress from 4v1 to 3v1 to increase pressure.',
  ARRAY['Cones (16) for 4 rondo squares', 'Balls (4)', 'Bibs (2 colours)'],
  ARRAY['Quality of pass — firm, accurate, to the correct foot', 'Back foot touch — receive across your body', 'Direction and weight of touch — set yourself for the next pass', 'Movement intensity — don''t stand still, adjust your angle', 'Play with your head up — scan before receiving', 'Keep the ball moving — don''t hold it too long'],
  ARRAY['Set up rondo squares, explain rules', 'Demonstrate: pass quality, back foot touch, movement', '4v1 rondo: 5 minutes — focus on technique', 'Progress to 3v1: 5 minutes — more pressure', 'Competition: which group keeps possession longest?', 'Cool down: discuss what made it easier to keep the ball'],
  ARRAY['Improve passing under pressure in tight spaces', 'Develop back foot control and first touch quality', 'Build movement intensity and passing rhythm'],
  'Four 8x8 metre rondo squares. Each has 3-4 attackers (orange bibs) around the outside with football (soccer ball) and 1 defender (blue bib) in the middle. Arrows show passing lines around the square.'
);

-- Session 3: Possession (Progressive — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-passcontrol-possession-junior',
  'U9',
  'progressive',
  15,
  'Possession',
  'Set up 20x15 metre grids. 4v4 or 5v5 possession: team with ball tries to keep it, other team presses. Score 1 point for 5 consecutive passes. Focus on balance (team shape), quick and simple play, and scanning before receiving. Progress by adding directional targets or end zones to score in.',
  ARRAY['Cones (12) for 3 grids', 'Balls (3)', 'Bibs (2 colours)'],
  ARRAY['Balance — maintain team shape, spread out', 'Play quick and simple — don''t overcomplicate', 'Scan before receiving — know your options', 'Support the ball carrier — give passing angles', 'First touch sets up the next pass', 'Communicate — call for the ball'],
  ARRAY['Set up grids, explain possession rules and scoring', 'Demonstrate: balance, scanning, quick play', 'Play 4v4 possession: 5 minutes, track points', 'Add directional targets: score by passing into end zone', 'Play with end zones: 5 minutes', 'Cool down: which team kept the best shape?'],
  ARRAY['Develop possession structure and team shape', 'Build scanning and decision making habits', 'Maintain possession under pressure'],
  '20x15 metre grid. 4v4 possession: 4 orange vs 4 blue players. Orange team with football (soccer ball) keeping possession. Arrows show passing lines and player movement. Team shape emphasised with dotted lines connecting players.'
);

-- Session 4: Games (Game — 25 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-passcontrol-games-junior',
  'U9',
  'game',
  25,
  'Games',
  'Set up 30x20 metre pitches with small goals. Play 3 games of 7-8 minutes each with different opponents. Special rule varies: Game 1 — free play. Game 2 — 5 passes before scoring. Game 3 — coach''s choice based on what needs reinforcing. Focus on punch pass habits and movement in game context. Minimal coaching.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (3 colours for rotation)'],
  ARRAY['Punch pass habits — use what you practised', 'Movement after passing — don''t stand and watch', 'Play with confidence — try things', 'Support teammates — give passing options', 'Transition quickly when you win or lose the ball', 'Enjoy the game — have fun competing'],
  ARRAY['Explain game format: 3 games, different opponents', 'Game 1: free play (7 minutes)', 'Game 2: 5 passes before scoring (7 minutes)', 'Game 3: coach''s choice rule (7 minutes)', 'Track scores across all 3 games', 'Announce overall winners, celebrate effort'],
  ARRAY['Apply passing habits in game situations', 'Experience different game conditions and rules', 'Develop game understanding through varied formats'],
  '30x20 metre pitch with small goals at each end. 4v4 game: orange vs blue bibs. Football (soccer ball) in play. Players spread across pitch showing passing movement.'
);

-- LESSON: Pass & Control
INSERT INTO lessons (
  title, description, age_group, skill_category, level,
  session_1_id, session_2_id, session_3_id, session_4_id,
  total_duration, objectives, coaching_focus,
  division, team_type
)
SELECT
  'Pass & Control',
  'Players develop punch pass technique, back foot control, and passing under pressure through rondos and possession games. Progresses from paired passing through rondo and possession to game application with passing conditions.',
  'U9',
  'Passing/Receiving',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-academy-passcontrol-passing-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-passcontrol-rondo-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-passcontrol-possession-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-passcontrol-games-junior'),
  70,
  ARRAY['Develop firm punch pass with back foot control', 'Pass accurately under pressure in rondo situations', 'Maintain team shape and balance in possession', 'Apply passing habits in competitive game formats'],
  ARRAY['Punch pass quality', 'Back foot control', 'Scan before receiving', 'Balance and shape'],
  'Academy',
  'Junior Football';


-- ============================================================================
-- SLIDE 7: Shooting Technique – Laces
-- Header: Junior Academy | Shooting Technique – Laces | 5.3.25
-- ============================================================================

-- Session 1: Brazil Skills & Juggling (Warmup — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-shooting-laces-brazil-junior',
  'U9',
  'warmup',
  15,
  'Brazil Skills & Juggling',
  'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills and turns on the coach''s call. Alternate between skill bursts and juggling. Focus on building intensity and improving ball control. Keep it high energy with short sharp bursts.',
  ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (optional)'],
  ARRAY['Eyes up — scan while performing skills', 'On toes — stay light and balanced', 'Acceleration after turns and fakes', 'Keep ball close during mastery work', 'Use both feet for all skills', 'Challenge yourself — beat your juggling record'],
  ARRAY['Set up grid, distribute balls', 'Ball mastery skills: toe taps, sole rolls (3 minutes)', 'Add turns: Cruyff, drag-back, step-over (3 minutes)', 'Juggling challenge: personal best (3 minutes)', 'Speed dribbling races (3 minutes)', 'Cool down with free juggling'],
  ARRAY['Build intensity and improve ball control', 'Develop confidence with ball mastery skills', 'Prepare physically for shooting session'],
  '20x20 metre grid. 8-12 players (orange bibs) each with a football (soccer ball) performing ball mastery skills. No defenders.'
);

-- Session 2: Shooting Drill (Skill Intro — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-shooting-laces-drill-junior',
  'U9',
  'skill_intro',
  15,
  'Shooting Drill',
  'Set up shooting stations 15-18 metres from goal. Players work in pairs: one feeds, one shoots. Feeder plays ball to the side, shooter takes a touch to set and strikes with laces. Focus on timing of movement to meet the ball, quality of the feed, first touch to set the shot, and hitting corners. Rotate feeder/shooter every 5 shots. Progress to shooting first time (no touch).',
  ARRAY['Cones (8) for shooting stations', 'Goals (2)', 'Balls (6)', 'Bibs (2 colours)'],
  ARRAY['Timing of movement — arrive as the ball arrives', 'Quality of pass — firm feed to the shooter''s path', 'First touch — set the ball out of your feet for the strike', 'Hit corners — aim low and to the sides', 'Laces technique — toe down, ankle locked, strike through middle', 'Follow through toward the target'],
  ARRAY['Set up shooting stations, demonstrate laces technique', 'Demonstrate: movement, touch, strike sequence', 'Round 1: touch and shoot, 5 shots each (5 minutes)', 'Round 2: first-time finish, 5 shots each (5 minutes)', 'Competition: who can hit the most corners? (5 minutes)', 'Highlight best technique — clean strikes'],
  ARRAY['Teach laces shooting technique', 'Develop timing of movement to meet the ball', 'Improve finishing accuracy — hit corners'],
  'Shooting stations 15-18 metres from goal. Feeder (blue bib) plays ball to the side. Shooter (orange bib) takes touch and strikes with laces toward goal. Arrows show feed, touch, and shot direction. Target zones highlighted in goal corners.'
);

-- Session 3: 1 v 1 Transition Drill (Progressive — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-shooting-laces-transition-junior',
  'U9',
  'progressive',
  15,
  '1 v 1 Transition Drill',
  'Set up 20x15 metre areas with a goal at one end. Attacker starts with ball 20 metres from goal, defender starts on the goal line. Coach calls "go" — attacker drives toward goal, defender closes down. Attacker must recognise GK position, create an angle to shoot, and finish early before the defender arrives. If defender wins ball, they counter to a mini goal at the other end.',
  ARRAY['Cones (8) for area boundaries', 'Goals (2 — 1 large, 1 small)', 'Balls (4)', 'Bibs (2 colours)'],
  ARRAY['Recognise GK position — where is the space?', 'Shoot early — don''t wait for the defender to arrive', 'Create angle — move the ball to open up the goal', 'Laces technique — strike clean and low', 'Decision making — shoot or take on the defender?', 'If you beat the defender, finish with composure'],
  ARRAY['Set up areas with goal and counter-goal', 'Demonstrate: drive, recognise space, shoot early', 'Round 1: attacker has 5 seconds to shoot (5 minutes)', 'Round 2: defender starts closer — more pressure (5 minutes)', 'Round 3: add counter-attack for defender (5 minutes)', 'Track goals scored — who is the top finisher?'],
  ARRAY['Improve decision making around when to shoot', 'Develop ability to recognise GK position and create angles', 'Encourage early shooting under pressure'],
  '20x15 metre area with large goal at one end and small counter-goal at the other. Attacker (orange bib) driving with football (soccer ball) toward goal. Defender (blue bib) closing down from goal line. Arrows show attacker''s run and shooting angle. GK position highlighted.'
);

-- Session 4: 3 Team Game (Game — 20 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-shooting-laces-3team-junior',
  'U9',
  'game',
  20,
  '3 Team Game',
  'Set up a 30x20 metre pitch with goals at each end. Three teams: two play, one rests. Winning team stays on, losing team rotates off. 5-minute games. Focus on movement to create shooting opportunities and finishing decisions. Encourage players to shoot when they see the goal. Keep it competitive — track which team wins the most games.',
  ARRAY['Cones (8) for pitch boundaries', 'Goals (2)', 'Balls (2)', 'Bibs (3 colours)'],
  ARRAY['Movement — create space to receive and shoot', 'Finishing decisions — shoot when you see the goal', 'Use laces technique from earlier sessions', 'Support the shooter — follow up for rebounds', 'Transition quickly — attack when you win the ball', 'Be competitive — every game matters'],
  ARRAY['Organise 3 teams, explain rotation: winner stays on', 'Game 1: 5 minutes (Team A vs Team B, Team C rests)', 'Game 2: 5 minutes (winner vs Team C)', 'Game 3: 5 minutes (continue rotation)', 'Game 4: 5 minutes (final round)', 'Announce which team won the most games'],
  ARRAY['Apply shooting habits in competitive game situations', 'Develop movement to create shooting opportunities', 'Experience competitive rotation format'],
  '30x20 metre pitch with goals at each end. 4v4 game: orange vs blue bibs. Third team (green bibs) resting on the sideline. Football (soccer ball) in play. Arrows show shooting opportunities.'
);

-- LESSON: Shooting Technique – Laces
INSERT INTO lessons (
  title, description, age_group, skill_category, level,
  session_1_id, session_2_id, session_3_id, session_4_id,
  total_duration, objectives, coaching_focus,
  division, team_type
)
SELECT
  'Shooting Technique – Laces',
  'Players learn laces shooting technique with focus on timing, first touch, and hitting corners. Progresses from structured shooting drills through 1v1 transition finishing to competitive 3-team games.',
  'U9',
  'Ball Striking',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-laces-brazil-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-laces-drill-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-laces-transition-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-laces-3team-junior'),
  65,
  ARRAY['Execute laces shooting technique with correct form', 'Time movement to meet the ball for clean strikes', 'Recognise GK position and create shooting angles', 'Apply shooting habits in competitive game situations'],
  ARRAY['Laces technique — toe down, ankle locked', 'Hit corners', 'Shoot early', 'Create the angle'],
  'Academy',
  'Junior Football';


-- ============================================================================
-- SLIDE 8: Pass & Control (variant)
-- Header: Junior Academy | Pass & Control | 10.3.25
-- NOTE: Bailey only had 3 sessions. Added a Rondo session as Session 2
-- to fit 4-session framework. Reordered: Passing, Rondo, Possession, Game.
-- ============================================================================

-- Session 1: Passing (Warmup — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-passcontrol2-passing-junior',
  'U9',
  'warmup',
  15,
  'Passing',
  'Players pair up in a 20x20 metre grid. Punch pass practice with touch limits: start with 2-touch, progress to 1-touch. Add movement after passing — don''t stand still. Make competitive: first pair to 20 clean passes at each touch limit wins. Focus on weight of pass and movement quality.',
  ARRAY['Cones (12) for grid and markers', 'Balls (1 per pair)', 'Bibs (2 colours)'],
  ARRAY['Weight of pass — firm enough to reach, not too hard', 'Movement — move immediately after passing', 'Punch pass technique — inside foot, no spin', 'Touch limits — 2-touch then 1-touch', 'Open body shape to receive', 'Compete — first to 20 wins at each level'],
  ARRAY['Pair up, 10 metres apart, demonstrate punch pass', '2-touch passing: pass, control, pass (3 minutes)', '1-touch passing: first time only (3 minutes)', 'Add movement: pass and move to new position (3 minutes)', 'Competition: first to 20 at each touch limit (3 minutes)', 'Highlight best weight of pass and movement'],
  ARRAY['Build passing quality with correct weight', 'Develop movement habits after passing', 'Progress through touch limits to increase speed of play'],
  '20x20 metre grid. Pairs (orange bibs) passing a football (soccer ball) with movement after each pass. Arrows show pass-and-move patterns.'
);

-- Session 2: Rondo (Skill Intro — 10 min) [Generated to fill 4-session gap]
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-passcontrol2-rondo-junior',
  'U9',
  'skill_intro',
  10,
  'Rondo',
  'Set up 8x8 metre squares. 4v1 rondo: 4 attackers keep possession, 1 defender presses. If defender wins ball, the passer who lost it swaps in. Focus on back foot control, ball speed, and decision making. Progress to 3v1 to increase pressure. Quick, sharp passing — don''t hold the ball.',
  ARRAY['Cones (16) for 4 rondo squares', 'Balls (4)', 'Bibs (2 colours)'],
  ARRAY['Back foot control — receive across your body', 'Ball speed — keep the ball moving quickly', 'Decision making — play the right pass at the right time', 'Body shape — open up to see all options', 'Movement after passing — adjust your angle', 'Don''t hold the ball — play quick and simple'],
  ARRAY['Set up rondo squares, explain rules', '4v1 rondo: 4 minutes — focus on ball speed', 'Progress to 3v1: 4 minutes — more pressure', 'Competition: which group keeps possession longest?', 'Rotate defenders regularly', 'Discuss: what made it easier to keep the ball?'],
  ARRAY['Improve passing speed and decision making', 'Develop back foot control under pressure', 'Build quick passing rhythm in tight spaces'],
  '8x8 metre rondo squares. 4 attackers (orange bibs) around outside with football (soccer ball), 1 defender (blue bib) in middle. Arrows show quick passing lines.'
);

-- Session 3: Possession (Progressive — 20 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-passcontrol2-possession-junior',
  'U9',
  'progressive',
  20,
  'Possession',
  'Set up 20x15 metre grids. 4v4 or 5v5 possession game. Team with ball keeps it, other team presses. Focus on balance (team shape), body shape to receive, and ball speed. Score 1 point for 5 consecutive passes. Progress by adding conditions: must play to all 4 players before scoring.',
  ARRAY['Cones (12) for 3 grids', 'Balls (3)', 'Bibs (2 colours)'],
  ARRAY['Balance — maintain team shape, don''t bunch up', 'Back foot control — open body to see options', 'Ball speed — keep the ball moving', 'Decision making — simple pass or switch play?', 'Support angles — give the ball carrier options', 'Patience — don''t force it, keep possession'],
  ARRAY['Set up grids, explain possession rules', 'Play 4v4 possession: 7 minutes, track points', 'Add condition: all players must touch before scoring', 'Play with condition: 7 minutes', 'Cool down: which team had the best shape?', 'Discuss: what helped you keep the ball?'],
  ARRAY['Develop possession habits and team shape', 'Build ball speed and decision making', 'Maintain balance under defensive pressure'],
  '20x15 metre grid. 4v4 possession: orange vs blue. Orange team with football (soccer ball) keeping possession. Dotted lines show team shape. Arrows show passing options.'
);

-- Session 4: 4-Goal Game (Game — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-passcontrol2-4goal-game-junior',
  'U9',
  'game',
  15,
  '4-Goal Game',
  'Set up a 30x25 metre pitch with 4 small goals — one on each side. Two equal teams. Teams can score in any of the 4 goals. This encourages switching play, scanning, and finding the open goal. Shape your team based on numbers — if opponents overload one side, switch to the open goal. Minimal coaching — let the game teach.',
  ARRAY['Cones (16) for pitch and goals', 'Small goals (4)', 'Balls (2)', 'Bibs (2 colours)'],
  ARRAY['Balance — shape your team to cover all 4 goals', 'Passing quality — play accurate passes to switch play', 'Patience — don''t rush, find the open goal', 'Scan — look for which goal is undefended', 'Switch play quickly when you see space', 'Transition — defend all 4 goals when you lose the ball'],
  ARRAY['Explain 4-goal game: score in any of the 4 goals', 'Play first half (7 minutes) — observe switching play', 'Half-time: ask "Which goal was easiest to score in? Why?"', 'Play second half (7 minutes) — encourage scanning', 'Cool down: discuss how shape helped find open goals'],
  ARRAY['Apply possession habits in a multi-directional game', 'Develop scanning and switching play', 'Build team shape awareness'],
  '30x25 metre pitch with 4 small goals, one on each side. 4v4: orange vs blue bibs. Football (soccer ball) in play. Arrows show switching play from one goal to another. Team shape shown with dotted lines.'
);

-- LESSON: Pass & Control (variant)
INSERT INTO lessons (
  title, description, age_group, skill_category, level,
  session_1_id, session_2_id, session_3_id, session_4_id,
  total_duration, objectives, coaching_focus,
  division, team_type
)
SELECT
  'Pass & Control – Shape & Balance',
  'Players develop passing quality, ball speed, and team shape through rondos and possession games. Finishes with a 4-goal game that rewards scanning, switching play, and finding the open goal.',
  'U9',
  'Passing/Receiving',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-academy-passcontrol2-passing-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-passcontrol2-rondo-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-passcontrol2-possession-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-passcontrol2-4goal-game-junior'),
  60,
  ARRAY['Develop passing quality with correct weight and speed', 'Maintain team shape and balance in possession', 'Scan and switch play to find open goals', 'Apply possession habits in multi-directional game'],
  ARRAY['Weight of pass', 'Balance and shape', 'Ball speed', 'Patience in possession'],
  'Academy',
  'Junior Football';


-- ============================================================================
-- SLIDE 9: 2 v 1 / 3 v 2 – Defending
-- Header: Junior Academy ID | 2 v 1 / 3 v 2 – Defending | 17.1.25 | #8-12 players
-- NOTE: Slide 27 is content-duplicate — skipped.
-- ============================================================================

-- Session 1: Ball Mastery & Juggling (Warmup — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-2v1defending-ball-mastery-junior',
  'U9',
  'warmup',
  15,
  'Ball Mastery & Juggling',
  'Set up a 20x20 metre grid. Each player has a ball. Ball mastery skills on the coach''s call: toe taps, sole rolls, turns, juggling variations. Keep intensity high with short sharp bursts. Arrival activity: juggling in 2s — partners count combined juggles.',
  ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours for later sessions)'],
  ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to move', 'Acceleration after turns and fakes', 'Keep ball close to feet', 'Quick feet — short sharp touches', 'Both feet — practise weaker foot too'],
  ARRAY['Arrival activity: juggling in 2s, count combined total', 'Set up grid, ball mastery skills on coach''s call (3 minutes)', 'Add turns: Cruyff, drag-back (3 minutes)', 'Juggling challenge: personal best (3 minutes)', 'Speed dribbling races (3 minutes)', 'Cool down with free juggling'],
  ARRAY['Build intensity through short sharp skill bursts', 'Develop ball control and turning technique', 'Improve juggling confidence'],
  '20x20 metre grid. 8-12 players (orange bibs) each with a football (soccer ball) performing ball mastery skills. No defenders.'
);

-- Session 2: 2 v 1s (Skill Intro — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-2v1defending-2v1-junior',
  'U9',
  'skill_intro',
  15,
  '2 v 1s',
  'Set up 15x10 metre channels with a small goal at each end. 2 attackers vs 1 defender. Attackers start with ball and try to score. Defender must decide: press the ball or cut the passing lane to create a 1v1? If defender wins ball, they counter-attack the opposite goal. Focus on defensive decision making and cutting passing lanes. Rotate defender every 2 minutes.',
  ARRAY['Cones (12) for 3 channels', 'Small goals (6)', 'Balls (6)', 'Bibs (2 colours)'],
  ARRAY['Punch pass quality — attackers must pass accurately', 'Get out quick — close down the ball carrier fast', 'Create 1v1 by cutting the passing lane', 'Force the attacker to make a decision', 'Stay on your feet — don''t dive in', 'Win the ball and counter quickly'],
  ARRAY['Set up channels with goals, explain 2v1 rules', 'Demonstrate: press ball or cut lane — when to do each', 'Round 1: 2v1, defender practises cutting lanes (5 minutes)', 'Round 2: rotate defender, increase attacker speed (5 minutes)', 'Round 3: add counter-attack for defender (5 minutes)', 'Discuss: when did you press vs cut the lane?'],
  ARRAY['Teach defensive decision making in overload situations', 'Develop ability to cut passing lanes', 'Build confidence defending outnumbered'],
  'Three 15x10 metre channels with small goals at each end. 2 attackers (orange bibs) with football (soccer ball) vs 1 defender (blue bib). Arrows show passing lane and defender''s movement to cut it.'
);

-- Session 3: 3 v 2s (Progressive — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-2v1defending-3v2-junior',
  'U9',
  'progressive',
  15,
  '3 v 2s',
  'Set up 20x15 metre areas with a goal at one end and a counter-goal at the other. 3 attackers vs 2 defenders. Attackers try to score, defenders work together to force direction and win the ball. If defenders win it, they counter-attack. Focus on communication between defenders, forcing attackers one way, and working as a defensive pair.',
  ARRAY['Cones (8) for area boundaries', 'Goals (2)', 'Balls (4)', 'Bibs (2 colours)'],
  ARRAY['Communication — talk to your partner, organise', 'Force attackers one way — show them where to go', 'One presses, one covers — defensive partnership', 'Cut passing lanes together', 'Win the ball and counter quickly', 'Stay patient — don''t both dive in'],
  ARRAY['Set up areas with goals, explain 3v2 rules', 'Demonstrate: one presses, one covers', 'Round 1: 3v2, focus on communication (5 minutes)', 'Round 2: rotate defenders, increase speed (5 minutes)', 'Round 3: add counter-attack, track goals (5 minutes)', 'Discuss: how did communication help?'],
  ARRAY['Add complexity to defensive decisions with a partner', 'Develop communication and defensive partnerships', 'Learn to force direction as a defensive pair'],
  '20x15 metre area with goal at one end and counter-goal at other. 3 attackers (orange bibs) with football (soccer ball) vs 2 defenders (blue bibs). Arrows show defenders forcing attackers one way. Communication lines shown between defenders.'
);

-- Session 4: Overload Game (Game — 20 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-2v1defending-overload-game-junior',
  'U9',
  'game',
  20,
  'Overload Game',
  'Set up a 30x20 metre pitch with goals at each end. 4v4 game with overload rule: when a team loses the ball, coach immediately plays a new ball to the other team from cones on the sideline, creating a temporary overload as the losing team transitions. This creates constant 2v1 and 3v2 situations. Focus on transition speed and pressing cues. Play 2 x 8-minute halves.',
  ARRAY['Cones (12) for pitch and ball stations', 'Goals (2)', 'Balls (8 — on cones around pitch)', 'Bibs (2 colours)'],
  ARRAY['Transition — react immediately when ball changes', 'Pressing cues — when to press as a team', 'Defend the overload — communicate and organise', 'Attack the overload — play quickly before defence recovers', 'Stay alert — new ball can come at any time', 'Win the ball back quickly'],
  ARRAY['Explain overload game rules and new-ball system', 'Play first half (8 minutes) — observe transitions', 'Half-time: ask "How did you defend the overload?"', 'Play second half (8 minutes) — encourage pressing cues', 'Cool down: discuss transition moments'],
  ARRAY['Apply overload defending in game situations', 'Develop transition speed and pressing habits', 'Experience constant overload situations'],
  '30x20 metre pitch with goals at each end. 4v4: orange vs blue bibs. Spare balls on cones around the sideline. Coach playing new ball in. Arrows show transition movement. Football (soccer ball) in play.'
);

-- LESSON: 2 v 1 / 3 v 2 – Defending
INSERT INTO lessons (
  title, description, age_group, skill_category, level,
  session_1_id, session_2_id, session_3_id, session_4_id,
  total_duration, objectives, coaching_focus,
  division, team_type
)
SELECT
  '2 v 1 / 3 v 2 – Defending',
  'Players learn to defend outnumbered situations by cutting passing lanes, communicating with partners, and forcing direction. Progresses from 2v1 through 3v2 to an overload game with constant transition situations.',
  'U9',
  '1v1',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-academy-2v1defending-ball-mastery-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-2v1defending-2v1-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-2v1defending-3v2-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-2v1defending-overload-game-junior'),
  65,
  ARRAY['Make defensive decisions in outnumbered situations', 'Cut passing lanes to create 1v1 opportunities', 'Communicate and work as a defensive pair', 'Apply overload defending in game situations'],
  ARRAY['Cut the passing lane', 'Get out quick', 'Communicate with partner', 'Transition speed'],
  'Academy',
  'Junior Football';


-- ============================================================================
-- SLIDE 11 (Scrape): 1 v 1 Attacking
-- Header Slide 12: Junior Academy | 1 v 1 – Turns | 7.4.25
-- ============================================================================

-- Session 1: Ball Mastery & Juggling (Warmup — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-1v1turns-ball-mastery-junior',
  'U9',
  'warmup',
  15,
  'Ball Mastery & Juggling',
  'Set up a 20x20 metre grid. Each player has a ball. Ball mastery skills on the coach''s call: toe taps, sole rolls, step-overs, scissors, turns. Alternate between skill bursts and juggling. Focus on acceleration after fakes — sell the move then burst away. Keep intensity high.',
  ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (optional)'],
  ARRAY['Eyes up — scan while performing skills', 'On toes — stay light and balanced', 'Acceleration after fakes — burst away after the move', 'Keep ball close during mastery work', 'Use both feet for all skills', 'Sell the fake — make it believable'],
  ARRAY['Set up grid, distribute balls', 'Ball mastery: toe taps, sole rolls (3 minutes)', 'Add turns: step-over, scissors, Cruyff (3 minutes)', 'Juggling challenge: personal best (3 minutes)', 'Acceleration races: fake then sprint (3 minutes)', 'Cool down with free juggling'],
  ARRAY['Build intensity and improve ball control', 'Develop acceleration after fakes and turns', 'Improve juggling confidence'],
  '20x20 metre grid. 8-12 players (orange bibs) each with a football (soccer ball) performing ball mastery skills. Arrows show acceleration bursts after turns.'
);

-- Session 2: 1 v 1 Wide (Skill Intro — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-1v1turns-wide-junior',
  'U9',
  'skill_intro',
  15,
  '1 v 1 (Wide)',
  'Set up 15x8 metre wide channels. 1v1: attacker starts with ball at one end, defender at the other. Attacker must beat the defender and dribble over the end line. Focus on body feints, acceleration, and beating the defender wide. Encourage creativity — try different moves. 45 seconds per go, then switch roles.',
  ARRAY['Cones (12) for 3 channels', 'Balls (3)', 'Bibs (2 colours)'],
  ARRAY['Attack space quickly — drive at the defender', 'Use fakes — body feints, step-overs, shoulder drops', 'Accelerate past defender — burst of speed after the move', 'Beat the defender wide — use the space', 'Be creative — try different moves each time', 'Stay balanced — don''t overcommit to the fake'],
  ARRAY['Set up wide channels, explain 1v1 rules', 'Demonstrate: body feint, accelerate past defender', 'Round 1: attacker at 70% speed (5 minutes)', 'Round 2: full speed, defender fully active (5 minutes)', 'Round 3: competition — most successful beats wins (5 minutes)', 'Switch partners and repeat'],
  ARRAY['Develop attacking mindset and creativity', 'Learn to use body feints to beat defenders', 'Build acceleration after moves'],
  'Three 15x8 metre wide channels. Attacker (orange bib) with football (soccer ball) driving at defender (blue bib). Arrows show body feint and acceleration past defender wide.'
);

-- Session 3: 1 v 1 with Goals (Progressive — 15 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-1v1turns-goals-junior',
  'U9',
  'progressive',
  15,
  '1 v 1 with Goals',
  'Set up 15x12 metre areas with a goal at one end. 1v1: attacker starts 15 metres from goal, defender starts between attacker and goal. Attacker must beat defender and score. Focus on recognising space, creating an angle to shoot, and shooting early. If defender wins ball, they counter to a mini goal. 45 seconds per go.',
  ARRAY['Cones (8) for area boundaries', 'Goals (2 — 1 large, 1 small)', 'Balls (4)', 'Bibs (2 colours)'],
  ARRAY['Shoot early — don''t wait too long', 'Attack defender''s front foot — commit them', 'Create angle — move the ball to open up the goal', 'Recognise space — where is the gap?', 'Be decisive — shoot or beat the defender, don''t hesitate', 'Follow up for rebounds'],
  ARRAY['Set up areas with goals, explain rules', 'Demonstrate: drive, create angle, shoot early', 'Round 1: 1v1 to goal (5 minutes)', 'Round 2: add counter-attack for defender (5 minutes)', 'Round 3: competition — most goals wins (5 minutes)', 'Celebrate best finishes'],
  ARRAY['Add finishing decisions to 1v1 attacking', 'Develop ability to create shooting angles', 'Encourage early shooting'],
  '15x12 metre area with goal at one end and counter-goal at other. Attacker (orange bib) with football (soccer ball) driving at defender (blue bib). Arrows show angle of attack and shooting direction.'
);

-- Session 4: Game (Game — 20 min)
INSERT INTO sessions (
  session_name, age_group, session_type, duration, title,
  organisation, equipment, coaching_points, steps, key_objectives,
  pitch_layout_description
) VALUES (
  'session-academy-1v1turns-game-junior',
  'U9',
  'game',
  20,
  '1 v 1 Attacking Game',
  'Set up a 30x20 metre pitch with small goals at each end. 4v4 game. Encourage creativity and 1v1 attacking — take players on, use fakes, shoot early. Bonus point for beating a defender with a skill move. Play 2 x 8-minute halves. Minimal coaching — let the game encourage creativity.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
  ARRAY['Attack space — drive at defenders with confidence', 'Quick decisions — shoot, pass, or dribble', 'Be creative — try skills from earlier sessions', 'Support the attacker — give options', 'Transition quickly when you win the ball', 'Enjoy the game — express yourself'],
  ARRAY['Explain game rules and bonus point for skill moves', 'Play first half (8 minutes) — observe 1v1 attacking', 'Half-time: ask "What moves worked best?"', 'Play second half (8 minutes) — encourage creativity', 'Cool down: celebrate best skill moments'],
  ARRAY['Apply 1v1 attacking habits in game situations', 'Develop creativity and confidence on the ball', 'Experience competitive game with attacking focus'],
  '30x20 metre pitch with small goals. 4v4: orange vs blue bibs. Highlighted player performing skill move to beat defender. Football (soccer ball) in play.'
);

-- LESSON: 1 v 1 – Turns
INSERT INTO lessons (
  title, description, age_group, skill_category, level,
  session_1_id, session_2_id, session_3_id, session_4_id,
  total_duration, objectives, coaching_focus,
  division, team_type
)
SELECT
  '1 v 1 – Turns',
  'Players develop 1v1 attacking skills: body feints, acceleration, and creativity. Progresses from wide channel 1v1s through finishing with goals to competitive small-sided games encouraging creative play.',
  'U9',
  '1v1',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-academy-1v1turns-ball-mastery-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-1v1turns-wide-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-1v1turns-goals-junior'),
  (SELECT id FROM sessions WHERE session_name = 'session-academy-1v1turns-game-junior'),
  65,
  ARRAY['Use body feints and turns to beat defenders', 'Accelerate past defenders after skill moves', 'Create shooting angles and finish early', 'Apply 1v1 attacking creativity in game situations'],
  ARRAY['Attack space quickly', 'Use fakes and accelerate', 'Shoot early', 'Be creative'],
  'Academy',
  'Junior Football';


-- ============================================================================
-- SLIDE 12 (Scrape): Passing & Receiving
-- Header Slide 15: Junior Academy | Pass & Control | 30.4.25
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-passing-receiving-passing2s-junior', 'U9', 'warmup', 10, 'Passing in 2s',
'Players pair up in a 20x20 metre grid, one ball per pair, 10 metres apart. Punch pass practice: firm inside foot pass, back foot control. Progress to pass and move — after each pass, move to a new position. Build rhythm and tempo. Make competitive: first pair to 30 passes wins.',
ARRAY['Cones (8) for grid', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Firm pass — punch through the ball, no spin', 'No spin — strike through the middle', 'Move after pass — don''t stand still', 'Back foot control — receive across your body', 'Open body shape — see the field', 'Build rhythm — pass, move, receive, repeat'],
ARRAY['Pair up, 10 metres apart, demonstrate punch pass', 'Static passing: focus on technique (2 minutes)', 'Add movement: pass and move to new position (3 minutes)', 'Competition: first to 30 passes (3 minutes)', 'Increase distance to 12 metres (2 minutes)'],
ARRAY['Improve passing technique and build rhythm', 'Develop movement habits after passing', 'Build back foot control'],
'20x20 metre grid. Pairs (orange bibs) passing football (soccer ball). Arrows show pass-and-move patterns.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-passing-receiving-rondo3v1-junior', 'U9', 'skill_intro', 15, 'Rondo (3v1)',
'Set up 8x8 metre squares. 3v1 rondo: 3 attackers keep possession, 1 defender presses. If defender wins ball, passer swaps in. Focus on quick play, movement, and scanning. Progress to 2-touch then 1-touch limits.',
ARRAY['Cones (16) for 4 rondo squares', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Back foot touch — receive across your body', 'Body shape — open up to see all options', 'Ball speed — keep the ball moving quickly', 'Scan before receiving — know your next pass', 'Move after passing — adjust your angle', 'Play simple — don''t overcomplicate'],
ARRAY['Set up rondo squares, explain rules', '3v1 rondo: free touch (5 minutes)', 'Progress to 2-touch (5 minutes)', 'Progress to 1-touch (5 minutes)', 'Competition: which group keeps possession longest?'],
ARRAY['Develop possession habits in tight spaces', 'Build scanning and body shape awareness', 'Increase ball speed through touch limits'],
'8x8 metre rondo squares. 3 attackers (orange bibs) around outside with football (soccer ball), 1 defender (blue bib) in middle. Arrows show passing lines.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-passing-receiving-possession-junior', 'U9', 'progressive', 15, 'Possession Game',
'Set up 20x15 metre grids. 4v4 possession: team with ball keeps it, other team presses. Focus on balance, support angles, and decision making. Score 1 point for 5 consecutive passes. Progress by adding end zones to score in.',
ARRAY['Cones (12) for 3 grids', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Scan early — know your options before the ball arrives', 'Play simple — quick, accurate passes', 'Move after pass — find a new angle', 'Balance — maintain team shape', 'Support angles — give the ball carrier options', 'Patience — keep the ball, don''t rush'],
ARRAY['Set up grids, explain possession rules', 'Play 4v4 possession: 5 minutes, track points', 'Add end zones: score by passing into zone (5 minutes)', 'Final round: competition between groups (5 minutes)'],
ARRAY['Build decision making in possession', 'Develop movement and support play', 'Maintain balance and team shape'],
'20x15 metre grid. 4v4 possession: orange vs blue. Orange team with football (soccer ball). Arrows show passing and movement.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-passing-receiving-4goal-junior', 'U9', 'game', 20, '4-Goal Game',
'Set up a 30x25 metre pitch with 4 small goals — one on each side. 4v4 game. Teams can score in any goal. Encourages switching play, scanning, and finding the open goal. Play 2 x 8-minute halves. Focus on ball speed, movement, and patience in possession.',
ARRAY['Cones (16) for pitch and goals', 'Small goals (4)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Ball speed — keep passes firm and accurate', 'Movement — create passing options', 'Patience — find the open goal, don''t rush', 'Switch play — if one side is blocked, go the other way', 'Scan — look for which goal is undefended', 'Transition — defend all 4 goals when you lose it'],
ARRAY['Explain 4-goal game rules', 'Play first half (8 minutes)', 'Half-time: ask "Which goal was easiest to score in?"', 'Play second half (8 minutes)', 'Cool down: discuss switching play'],
ARRAY['Apply passing habits in multi-directional game', 'Develop scanning and switching play', 'Build patience in possession'],
'30x25 metre pitch with 4 small goals. 4v4: orange vs blue. Football (soccer ball) in play. Arrows show switching play.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Passing & Receiving', 'Players develop passing technique, possession habits, and decision making through rondos and possession games. Finishes with a 4-goal game encouraging switching play and scanning.', 'U9', 'Passing/Receiving', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-passing-receiving-passing2s-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-passing-receiving-rondo3v1-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-passing-receiving-possession-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-passing-receiving-4goal-junior'),
60, ARRAY['Develop firm punch pass with back foot control', 'Build possession habits through rondo play', 'Make decisions in possession under pressure', 'Apply passing habits in multi-directional game'],
ARRAY['Firm pass, no spin', 'Move after pass', 'Scan before receiving', 'Ball speed'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 13 (Scrape): 1 v 1 Defending (Wide)
-- Header Slide 18: Junior Academy | 1 v 1 – Dribbling | 12.5.25
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-dribbling-ball-mastery-junior', 'U9', 'warmup', 15, 'Ball Mastery & Juggling',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills on the coach''s call: toe taps, sole rolls, inside-outside, drag-backs. After each skill burst (30 seconds), players juggle for 20 seconds. Progress to dribbling at speed with sharp turns. Finish with races across the grid.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to change direction', 'Accelerate after turns — burst away with pace', 'Keep ball close to feet during mastery work', 'Quick feet — short sharp touches', 'Use all surfaces of the foot'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate first skill (toe taps), players copy for 30 seconds', 'Call out turns: drag-back, inside-outside, Cruyff — 30 seconds each with juggling between', 'Progress to dribbling at speed with sharp direction changes', 'Add competition: first to complete 3 laps wins', 'Cool down with free juggling — count personal best'],
ARRAY['Build intensity and engagement through short sharp bursts', 'Develop close ball control and turning technique', 'Improve juggling confidence and coordination'],
'20x20 metre grid marked with cones. 8-12 players each with a football (soccer ball) (orange bibs) spread throughout. Arrows show random dribbling patterns with sharp turns. No defenders.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-dribbling-wide-channel-junior', 'U9', 'skill_intro', 15, '1 v 1 Wide Channel',
'Set up 15x10 metre channels, one pair per channel. Attacker starts with the ball at one end, defender at the other. Attacker tries to dribble past the defender and stop the ball on the end line. Defender must use correct body shape to force the attacker wide. Swap roles after each attempt. Play 5 attempts each then rotate pairs.',
ARRAY['Cones (16) for 4 channels', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Side-on stance — show the attacker outside', 'Show outside — force attacker away from goal', 'Don''t dive in — stay on your feet and be patient', 'Stay low and balanced — ready to react', 'Watch the ball, not the attacker''s body', 'Close the distance quickly then slow down'],
ARRAY['Set up channels, pair up players, explain rules', 'Demonstrate body shape: side-on, showing outside', 'Round 1: attacker dribbles, defender forces wide (5 attempts each)', 'Pause and coach: highlight good body shape examples', 'Round 2: increase intensity, defender can tackle (5 attempts each)', 'Rotate pairs and play final round'],
ARRAY['Teach wide defending body shape and positioning', 'Develop patience and timing when defending 1v1', 'Build habit of forcing attacker away from danger'],
'15x10 metre channels marked with cones. Attacker (orange bib) with football (soccer ball) at one end, defender (blue bib) at other. Arrows show attacker trying to go past, defender showing outside. Body shape highlighted.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-dribbling-end-zones-junior', 'U9', 'progressive', 15, '1 v 1 with End Zones',
'Set up 20x15 metre grids with 3-metre end zones at each end. 1v1: attacker scores by dribbling into the end zone. Defender scores by winning the ball and dribbling into the opposite end zone. This adds directional defending — the defender must steer the attacker away from the scoring zone. Play 2-minute rounds then swap opponents.',
ARRAY['Cones (16) for 4 grids with end zones', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Force wide — steer the attacker away from the end zone', 'Wait for the mistake — don''t commit too early', 'Stay balanced — ready to change direction', 'Time the tackle — only go when the ball is loose', 'Recover quickly if beaten — sprint back goal-side', 'Transition — attack immediately when you win the ball'],
ARRAY['Set up grids with end zones, explain scoring rules', 'Demonstrate steering: force attacker away from end zone', 'Round 1: 2-minute 1v1s, light pressure (observe)', 'Round 2: full pressure, coach calls out good defending', 'Round 3: competition — who scores most end zone entries?', 'Cool down: discuss when to tackle vs when to wait'],
ARRAY['Add directional pressure to 1v1 defending', 'Develop steering and timing of tackles', 'Build transition habits when winning the ball'],
'20x15 metre grid with 3-metre end zones shaded at each end. Attacker (orange bib) with football (soccer ball) trying to reach end zone. Defender (blue bib) steering attacker wide. Arrows show defending angle and attacker''s attempted path.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-dribbling-game-junior', 'U9', 'game', 20, '1 v 1 Dribbling Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. Encourage wide play by awarding double points for goals scored from wide areas. Play 2 x 8-minute halves with a 4-minute break. Minimal coaching — let the game create natural 1v1 situations in wide channels.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Body shape — side-on when defending in wide areas', 'Press triggers — close down when attacker''s head is down', 'Force wide — show the attacker away from goal', 'Transition quickly when you win the ball', 'Support the defender — don''t leave them isolated', 'Communicate — tell teammates where the danger is'],
ARRAY['Explain rules: double points for goals from wide areas', 'Play first half (8 minutes) — observe wide 1v1 situations', 'Half-time: ask "How did you defend in wide areas?"', 'Play second half (8 minutes) — encourage wide defending habits', 'Cool down: players share one defending moment from the game'],
ARRAY['Apply wide defending technique in a real game', 'Develop decision making in wide 1v1 situations', 'Build team defending habits and communication'],
'40x30 metre pitch with goals at each end. Two teams (orange vs blue bibs), 4-5 per side. Wide zones highlighted. Arrows show wide 1v1 situations and defending angles.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT '1 v 1 – Dribbling', 'Players learn how to defend in wide 1v1 situations using correct body shape, forcing direction, and patience. Progresses from ball mastery through structured wide channel defending to a game with wide area focus.', 'U9', '1v1', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-dribbling-ball-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-dribbling-wide-channel-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-dribbling-end-zones-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-dribbling-game-junior'),
65, ARRAY['Develop wide defending body shape and positioning', 'Build patience and timing in 1v1 situations', 'Learn to steer attackers away from danger areas', 'Apply wide defending habits in game situations'],
ARRAY['Side-on stance', 'Force attacker outside', 'Don''t dive in', 'Transition when winning ball'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 14 (Scrape): Shooting (Inside Foot)
-- Header Slide 19: U11 / U12 | Kicking Techniques / Game Training | 14.5.25
-- NOTE: age_group = U11 (U11/U12 programme)
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-kicking-techniques-ball-mastery-junior', 'U11', 'warmup', 10, 'Ball Mastery & Turns',
'Set up a 25x25 metre grid. Each player has a ball. Players perform ball mastery skills: toe taps, sole rolls, inside-outside, drag-backs. Progress to turns at speed — Cruyff, drag-back, inside hook. Finish with dribbling races. Keep intensity high with short bursts.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to move', 'Quick feet — short sharp touches on the ball', 'Accelerate out of turns — burst away with pace', 'Use both feet for mastery work', 'Keep ball within playing distance at all times'],
ARRAY['Set up 25x25m grid, distribute balls — 1 per player', 'Demonstrate ball mastery skills, players copy for 30 seconds each', 'Progress to turns at speed: Cruyff, drag-back, inside hook', 'Add dribbling races across the grid', 'Competition: fastest through a cone slalom course', 'Cool down with free juggling'],
ARRAY['Build intensity and warm up technique', 'Develop close ball control at speed', 'Improve turning technique and acceleration'],
'25x25 metre grid marked with cones. Players (orange bibs) each with a football (soccer ball) performing ball mastery. Arrows show dribbling patterns with turns.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-kicking-techniques-inside-foot-junior', 'U11', 'skill_intro', 15, 'Inside Foot Finishing',
'Set up shooting stations 15 metres from goal. Players take turns striking at goal using inside foot technique. Focus on placement over power — pass the ball into the corners. Coach feeds balls from different angles. Progress to receiving a pass then finishing first time. Rotate through stations.',
ARRAY['Cones (8) for stations', 'Goals (2)', 'Balls (6)', 'Bibs (2 colours)'],
ARRAY['Open body — angle your body to see the target', 'Pass into corners — side-foot placement, low and firm', 'Head steady — eyes on the ball at point of contact', 'Plant foot pointing at target', 'Follow through towards the corner', 'Relaxed ankle — firm but not tense'],
ARRAY['Set up shooting stations 15m from goal', 'Demonstrate inside foot technique: open body, plant foot, follow through', 'Static shooting: 5 shots each, focus on placement (5 minutes)', 'Add a pass: receive and finish first time (5 minutes)', 'Competition: who can hit the most corners? (5 minutes)'],
ARRAY['Teach accurate inside foot finishing technique', 'Develop placement over power mentality', 'Build confidence striking at goal from different angles'],
'Shooting stations 15 metres from goal. Players (orange bibs) lined up. Arrows show ball path to corners of goal. Coach feeding from side. Target zones highlighted in goal corners.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-kicking-techniques-2v1-goal-junior', 'U11', 'progressive', 15, '2 v 1 to Goal',
'Set up a 25x20 metre area with a goal at one end. 2v1 situations: two attackers combine to create a finishing chance against one defender. Attackers start from halfway, defender starts on the edge of the box. Focus on timing of pass, movement off the ball, and shooting early. Rotate roles after each attack. Progress to 2v2.',
ARRAY['Cones (8) for area', 'Goals (1)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Play early — release the pass before the defender closes', 'Movement off ball — make a run to create space', 'Shoot early — don''t take extra touches', 'Timing of run — don''t go too early or too late', 'Combination play — wall passes, overlaps', 'Decision making — pass or shoot?'],
ARRAY['Set up 25x20m area with goal, explain 2v1 rules', 'Demonstrate: timing of pass and movement off ball', 'Round 1: 2v1 attacks, focus on combination play (5 minutes)', 'Round 2: add condition — must shoot within 3 touches of final pass (5 minutes)', 'Round 3: progress to 2v2 for more pressure (5 minutes)'],
ARRAY['Encourage combination play to create finishing chances', 'Develop timing of passes and runs', 'Build decision making around when to pass vs shoot'],
'25x20 metre area with goal at one end. 2 attackers (orange bibs) with football (soccer ball) starting from halfway. 1 defender (blue bib) near goal. Arrows show passing combination and shooting angle.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-kicking-techniques-game-junior', 'U11', 'game', 20, 'Finishing Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. Special rule: goals scored with inside foot placement count double. Play 2 x 8-minute halves with a 4-minute break. Encourage players to look for shooting opportunities and use inside foot technique.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Hit corners — aim for placement over power', 'Quick decisions — shoot when the chance is there', 'Create angles — move to find a shooting line', 'Combination play — use teammates to create chances', 'Transition — attack quickly when you win the ball', 'Encourage shooting from distance'],
ARRAY['Explain rules: inside foot goals count double', 'Play first half (8 minutes) — observe finishing habits', 'Half-time: ask "Where were the best chances?"', 'Play second half (8 minutes) — encourage inside foot finishing', 'Cool down: players share their best goal'],
ARRAY['Apply inside foot finishing in a real game', 'Develop shooting decision making under pressure', 'Build habit of looking for finishing opportunities'],
'40x30 metre pitch with goals at each end. Two teams (orange vs blue bibs), 4-5 per side. Arrows show shooting opportunities. Target zones in goal corners highlighted.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Kicking Techniques / Game Training', 'Players develop inside foot finishing technique focusing on placement over power. Progresses from ball mastery through structured shooting practice and 2v1 combination play to a game rewarding accurate finishing.', 'U11', 'Ball Striking', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-kicking-techniques-ball-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-kicking-techniques-inside-foot-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-kicking-techniques-2v1-goal-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-kicking-techniques-game-junior'),
60, ARRAY['Develop accurate inside foot finishing technique', 'Build combination play to create shooting chances', 'Improve decision making around when to shoot', 'Apply finishing habits in game situations'],
ARRAY['Open body shape', 'Pass into corners', 'Shoot early', 'Combination play'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 15 (Scrape): Rondo & Possession
-- Header Slide 21: Junior Academy | Pass & Control | 21.5.25
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-possession-3v1-junior', 'U9', 'warmup', 15, 'Rondo (3v1)',
'Set up 8x8 metre squares. 3v1 rondo: 3 attackers keep possession, 1 defender presses. If defender wins ball, the passer who lost it swaps in. Focus on quick play, movement after passing, and scanning before receiving. Progress from free touch to 2-touch then 1-touch.',
ARRAY['Cones (16) for 4 rondo squares', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Back foot touch — receive across your body', 'Body shape — open up to see all options before the ball arrives', 'Ball speed — keep the ball moving quickly between players', 'Scan before receiving — know your next pass', 'Move after passing — adjust your angle', 'Play simple — don''t overcomplicate'],
ARRAY['Set up rondo squares, explain 3v1 rules', '3v1 rondo: free touch — focus on body shape (5 minutes)', 'Progress to 2-touch — increase tempo (5 minutes)', 'Progress to 1-touch — maximum ball speed (3 minutes)', 'Competition: which group keeps possession longest?', 'Rotate defenders regularly'],
ARRAY['Teach possession habits in tight spaces', 'Build scanning and body shape awareness', 'Increase ball speed through touch limits'],
'8x8 metre rondo squares. 3 attackers (orange bibs) around outside with football (soccer ball), 1 defender (blue bib) in middle pressing. Arrows show passing lines and movement after pass.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-possession-4v2-junior', 'U9', 'skill_intro', 15, 'Rondo (4v2)',
'Set up 10x10 metre squares. 4v2 rondo: 4 attackers keep possession against 2 defenders. Defenders work in pairs to press and cut passing lanes. If defenders win ball, the two attackers who lost it swap in. Focus on angles of support, tempo, and decision making under increased pressure.',
ARRAY['Cones (16) for 4 rondo squares', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Move early — adjust your position before the ball arrives', 'Play simple — one or two touch, keep it moving', 'Scan before receiving — know where the pressure is coming from', 'Support angles — don''t hide behind the defender', 'Tempo — speed up when defenders are out of position', 'Communication — call for the ball'],
ARRAY['Set up 10x10m squares, explain 4v2 rules', '4v2 rondo: free touch — build confidence (5 minutes)', 'Progress to 2-touch — increase decision speed (5 minutes)', 'Add condition: 5 consecutive passes = 1 point (3 minutes)', 'Competition: which group scores most points?', 'Rotate defenders every 2 minutes'],
ARRAY['Increase difficulty with two defenders pressing', 'Improve decision making under pressure', 'Develop support angles and communication'],
'10x10 metre rondo squares. 4 attackers (orange bibs) around outside, 2 defenders (blue bibs) in middle. Arrows show passing lines and defender pressing angles.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-possession-game-junior', 'U9', 'progressive', 15, 'Possession Game',
'Set up 25x20 metre grids. 4v4 possession game: team with ball keeps it, other team presses. Score 1 point for 5 consecutive passes. Progress by adding end zones — score by passing into the end zone. Focus on width, depth, switching play, and patience in possession.',
ARRAY['Cones (12) for grids and end zones', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Balance — maintain team shape and spacing', 'Patience — keep the ball, don''t rush forward', 'Ball speed — move the ball quickly to stretch the defence', 'Width and depth — spread out to create passing options', 'Switching play — if one side is blocked, go the other way', 'Support the ball carrier — always give an option'],
ARRAY['Set up grids, explain possession rules and scoring', 'Play 4v4 possession: 5 passes = 1 point (5 minutes)', 'Add end zones: score by passing into zone (5 minutes)', 'Final round: competition between groups (5 minutes)'],
ARRAY['Build structured possession with width and depth', 'Develop patience and decision making in possession', 'Encourage switching play when under pressure'],
'25x20 metre grid. 4v4 possession: orange vs blue. End zones shaded at each end. Arrows show passing patterns and switching play.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-possession-4goal-junior', 'U9', 'game', 20, '4-Goal Game',
'Set up a 30x25 metre pitch with 4 small goals — one on each side. 4v4 game. Teams can score in any goal. This encourages switching play, scanning for the open goal, and quick decision making. Play 2 x 8-minute halves. Focus on applying possession habits from the session.',
ARRAY['Cones (16) for pitch and goals', 'Small goals (4)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Movement — create passing options and find space', 'Decision making — which goal is open?', 'Scan — look for which goal is undefended before receiving', 'Switch play — if one side is blocked, attack the other goal', 'Patience — keep possession until the right moment', 'Transition — defend all 4 goals when you lose the ball'],
ARRAY['Explain 4-goal game rules: score in any goal', 'Play first half (8 minutes) — observe possession habits', 'Half-time: ask "Which goal was easiest to score in and why?"', 'Play second half (8 minutes) — encourage switching play', 'Cool down: discuss best team goals'],
ARRAY['Apply possession habits in a multi-directional game', 'Develop scanning and switching play', 'Build patience and decision making in game situations'],
'30x25 metre pitch with 4 small goals, one on each side. 4v4: orange vs blue. Football (soccer ball) in play. Arrows show switching play between goals.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Rondo & Possession', 'Players develop possession habits through rondo progressions from 3v1 to 4v2, building scanning, body shape, and ball speed. Finishes with a 4-goal game encouraging switching play and patience in possession.', 'U9', 'Passing/Receiving', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-possession-3v1-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-possession-4v2-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-possession-game-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-possession-4goal-junior'),
65, ARRAY['Develop possession habits through rondo play', 'Build scanning and body shape awareness', 'Improve decision making under increasing pressure', 'Apply possession habits in multi-directional game'],
ARRAY['Back foot touch', 'Body shape and scanning', 'Ball speed', 'Switching play'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 16 (Scrape): 1 v 1 Attacking (Central)
-- Header Slide 22: Junior Academy | 1 v 1 – Attacking | 26.5.25
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-central-mastery-junior', 'U9', 'warmup', 15, 'Ball Mastery & Juggling',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills with emphasis on fakes and feints: step-overs, body feints, shoulder drops, Cruyff turns. After each skill (30 seconds), players juggle for 20 seconds. Progress to dribbling at speed with changes of direction. Finish with 1v1 races to the far cone.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to explode', 'Accelerate after fakes — sell the move then burst away', 'Keep ball close during mastery work', 'Use both feet for step-overs and feints', 'Commit to the move — make it convincing'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate fakes: step-over, body feint, shoulder drop (30 seconds each)', 'Players copy each skill with juggling between', 'Progress to dribbling at speed with direction changes', 'Add 1v1 races: first to far cone wins', 'Cool down with free juggling'],
ARRAY['Build intensity with emphasis on fakes and feints', 'Develop close ball control and deception', 'Improve acceleration out of skill moves'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball) performing step-overs and body feints. Arrows show dribbling with direction changes.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-central-skill-junior', 'U9', 'skill_intro', 15, '1 v 1 Central',
'Set up 15x10 metre channels. 1v1: attacker starts with the ball facing the defender centrally. Attacker tries to dribble past and stop the ball on the end line. Focus on attacking the defender''s front foot, using body feints and changes of direction, then accelerating past. Swap roles after each attempt.',
ARRAY['Cones (16) for 4 channels', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Attack defender''s front foot — run straight at them', 'Accelerate past — burst of speed after the move', 'Use disguise — body feints, step-overs, shoulder drops', 'Commit to the move — don''t hesitate', 'Change of direction — sharp and explosive', 'Keep ball close — don''t push it too far ahead'],
ARRAY['Set up channels, pair up players, explain rules', 'Demonstrate: attack front foot, use feint, accelerate past', 'Round 1: attacker dribbles past defender (5 attempts each)', 'Pause and coach: highlight good use of disguise', 'Round 2: increase defender pressure (5 attempts each)', 'Rotate pairs and play final round'],
ARRAY['Teach central 1v1 attacking technique', 'Develop use of body feints and disguise', 'Build confidence to take on defenders centrally'],
'15x10 metre channels. Attacker (orange bib) with football (soccer ball) facing defender (blue bib) centrally. Arrows show attacker using feint then accelerating past.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-central-goal-junior', 'U9', 'progressive', 15, '1 v 1 to Goal',
'Set up a 20x15 metre area with a goal at one end. 1v1: attacker starts with the ball 20 metres from goal, defender starts 5 metres in front. Attacker must beat the defender and shoot. Focus on creating an angle to shoot, recognising the goalkeeper''s position, and shooting early when the chance is there. Progress to 2v1 for more options.',
ARRAY['Cones (8) for area', 'Goals (1)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Shoot early — don''t take extra touches if you have a chance', 'Attack space — drive into the gap behind the defender', 'Recognise GK position — shoot to the open side', 'Create angle — move the ball to find a shooting line', 'Be decisive — commit to shoot or dribble', 'Use disguise to create the shooting opportunity'],
ARRAY['Set up area with goal, explain 1v1 to goal rules', 'Demonstrate: beat defender, create angle, shoot early', 'Round 1: 1v1 to goal, focus on creating angle (5 minutes)', 'Round 2: add condition — must shoot within 3 seconds of beating defender (5 minutes)', 'Round 3: progress to 2v1 for more options (5 minutes)'],
ARRAY['Add finishing decisions to 1v1 attacking', 'Develop ability to create shooting angles', 'Build habit of shooting early when chance appears'],
'20x15 metre area with goal at one end. Attacker (orange bib) with football (soccer ball) facing defender (blue bib). Arrows show attacker beating defender and shooting. GK in goal.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-central-game-junior', 'U9', 'game', 20, 'Central Attacking Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. Encourage central 1v1 situations by awarding double points for goals scored after beating a defender 1v1. Play 2 x 8-minute halves with a 4-minute break. Minimal coaching — let the game create natural attacking situations.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Attack space — drive forward when you have the ball', 'Quick decisions — take on or pass?', 'Creativity — try different moves to beat defenders', 'Transition — attack quickly when you win the ball', 'Support the attacker — give passing options', 'Shoot when you see the goal'],
ARRAY['Explain rules: double points for goals after beating a defender 1v1', 'Play first half (8 minutes) — observe central 1v1 situations', 'Half-time: ask "What moves worked best?"', 'Play second half (8 minutes) — encourage creativity', 'Cool down: players demonstrate their favourite move'],
ARRAY['Apply central 1v1 attacking in a real game', 'Develop creativity and decision making', 'Build confidence to take on defenders in game situations'],
'40x30 metre pitch with goals at each end. Two teams (orange vs blue bibs), 4-5 per side. Arrows show central 1v1 attacking situations and shooting.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT '1 v 1 – Attacking', 'Players develop central 1v1 attacking skills using body feints, disguise, and acceleration. Progresses from ball mastery through structured 1v1 practice to a game rewarding creativity and beating defenders.', 'U9', '1v1', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-central-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-central-skill-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-central-goal-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-central-game-junior'),
65, ARRAY['Develop central 1v1 attacking technique with feints', 'Build confidence to take on defenders', 'Improve finishing decisions after beating a defender', 'Apply attacking creativity in game situations'],
ARRAY['Attack front foot', 'Accelerate past', 'Use disguise', 'Shoot early'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 17 (Scrape): Passing (Punch Pass)
-- Header Slide 23: Junior Academy U9/U10 | 1 v 1 – Defending
-- NOTE: Header says "1v1 Defending" but scrape content is Passing (Punch Pass)
-- Using scrape content as ground truth, header name as title
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-punch-pass-passing2s-junior', 'U9', 'warmup', 10, 'Passing in 2s',
'Players pair up in a 20x20 metre grid, one ball per pair, 10 metres apart. Punch pass practice: firm inside foot pass, strike through the middle of the ball with no spin. Progress to pass and move — after each pass, move to a new position. Build rhythm and tempo. Competition: first pair to 30 passes wins.',
ARRAY['Cones (8) for grid', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Strong pass — punch through the ball firmly', 'No curl — strike through the middle for a straight pass', 'Move after pass — don''t stand still', 'Open body shape — see the field when receiving', 'Back foot control — receive across your body', 'Build rhythm — pass, move, receive, repeat'],
ARRAY['Set up 20x20m grid, pair up players 10 metres apart', 'Demonstrate punch pass: firm inside foot, no spin', 'Static passing: focus on technique (3 minutes)', 'Add movement: pass and move to new position (4 minutes)', 'Competition: first pair to 30 passes (3 minutes)'],
ARRAY['Teach firm punch pass technique', 'Develop movement habits after passing', 'Build rhythm and tempo in passing'],
'20x20 metre grid. Pairs (orange bibs) 10 metres apart passing football (soccer ball). Arrows show pass-and-move patterns.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-punch-pass-interference-junior', 'U9', 'skill_intro', 10, 'Passing Interference',
'Set up 15x15 metre grids. Groups of 4: 3 passers and 1 interferer. Passers try to complete passes while the interferer moves through the grid disrupting passing lanes (not tackling). Focus on receiving and turning under pressure, one-twos, and scanning. Progress to 2 interferers.',
ARRAY['Cones (12) for 3 grids', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Body shape — open up to see options when receiving', 'First touch — control the ball away from pressure', 'Movement — create passing angles', 'Scan before receiving — know where the interferer is', 'One-twos — quick combinations to beat the interferer', 'Receive and turn — don''t always play backwards'],
ARRAY['Set up grids, explain interference rules', 'Round 1: 3 passers vs 1 interferer, free touch (3 minutes)', 'Pause and coach: highlight good body shape', 'Round 2: add 2-touch limit (3 minutes)', 'Round 3: add second interferer for more pressure (4 minutes)'],
ARRAY['Add pressure to passing through interference', 'Develop scanning and awareness of pressure', 'Build receiving and turning technique'],
'15x15 metre grid. 3 passers (orange bibs) with football (soccer ball), 1 interferer (blue bib) moving through passing lanes. Arrows show passing lines and interferer movement.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-punch-pass-possession-junior', 'U9', 'progressive', 15, 'Possession',
'Set up 25x20 metre grids. 4v4 possession: team with ball keeps it, other team presses. Score 1 point for 5 consecutive passes. Focus on balance, support angles, and playing simple. Progress by adding end zones to score in. Encourage scanning and moving after every pass.',
ARRAY['Cones (12) for grids and end zones', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Scan early — know your options before the ball arrives', 'Play simple — quick, accurate passes', 'Move after pass — find a new angle immediately', 'Balance — maintain team shape and spacing', 'Support angles — give the ball carrier options', 'Patience — keep the ball, don''t rush'],
ARRAY['Set up grids, explain possession rules', 'Play 4v4 possession: 5 passes = 1 point (5 minutes)', 'Add end zones: score by passing into zone (5 minutes)', 'Final round: competition between groups (5 minutes)'],
ARRAY['Build decision making in possession', 'Develop movement and support play', 'Maintain balance and team shape under pressure'],
'25x20 metre grid. 4v4 possession: orange vs blue. End zones shaded. Arrows show passing and movement patterns.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-punch-pass-4goal-junior', 'U9', 'game', 20, '4-Goal Game',
'Set up a 30x25 metre pitch with 4 small goals — one on each side. 4v4 game. Teams can score in any goal. Encourages switching play, scanning for the open goal, and ball speed. Play 2 x 8-minute halves. Focus on applying passing habits — firm passes, movement, and patience.',
ARRAY['Cones (16) for pitch and goals', 'Small goals (4)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Ball speed — keep passes firm and accurate', 'Movement — create passing options after every pass', 'Scan — look for which goal is undefended', 'Switch play — if one side is blocked, go the other way', 'Patience — keep possession until the right moment', 'Transition — defend all 4 goals when you lose it'],
ARRAY['Explain 4-goal game rules: score in any goal', 'Play first half (8 minutes) — observe passing habits', 'Half-time: ask "Which goal was easiest to score in?"', 'Play second half (8 minutes) — encourage switching play', 'Cool down: discuss best team passing moves'],
ARRAY['Apply passing habits in multi-directional game', 'Develop scanning and switching play', 'Build patience and ball speed in possession'],
'30x25 metre pitch with 4 small goals. 4v4: orange vs blue. Football (soccer ball) in play. Arrows show switching play between goals.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Passing (Punch Pass)', 'Players develop the punch pass technique — firm, straight passes with no spin. Progresses from paired passing through interference drills and possession games to a 4-goal game encouraging switching play.', 'U9', 'Passing/Receiving', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-punch-pass-passing2s-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-punch-pass-interference-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-punch-pass-possession-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-punch-pass-4goal-junior'),
55, ARRAY['Develop firm punch pass with no spin', 'Build passing under pressure through interference', 'Improve possession habits and support angles', 'Apply passing technique in multi-directional game'],
ARRAY['Strong pass, no curl', 'Move after pass', 'Scan before receiving', 'Ball speed'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 18 (Scrape): 1 v 1 Defending (Central)
-- Header Slide 24: Junior Academy | 1 v 1 – Travelling with the Ball | 9.6.25
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-central-mastery-junior', 'U9', 'warmup', 15, 'Ball Mastery & Juggling',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills: toe taps, sole rolls, inside-outside, drag-backs. Progress to turns at speed with acceleration. Finish with dribbling races. Keep intensity high with short sharp bursts.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to change direction', 'Accelerate after turns — burst away with pace', 'Keep ball close to feet during mastery work', 'Quick feet — short sharp touches', 'Use all surfaces of the foot'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate ball mastery skills, players copy for 30 seconds each', 'Progress to turns at speed with acceleration', 'Add dribbling races across the grid', 'Competition: fastest through cone slalom', 'Cool down with free juggling'],
ARRAY['Build intensity and engagement through ball mastery', 'Develop close ball control and turning technique', 'Improve coordination and footwork'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball) performing ball mastery. Arrows show dribbling patterns with turns.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-central-skill-junior', 'U9', 'skill_intro', 15, '1 v 1 Central Defending',
'Set up 15x10 metre channels. 1v1: attacker starts with the ball at one end, defender at the other. Defender must use correct body shape to force the attacker one way. Focus on side-on stance, showing one direction, and not diving in. Swap roles after each attempt. Play 5 attempts each.',
ARRAY['Cones (16) for 4 channels', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Side-on stance — angle your body to show one way', 'Show one way — force the attacker where you want them', 'Don''t dive in — stay on your feet and be patient', 'Stay low and balanced — ready to react', 'Watch the ball, not the attacker''s body', 'Close the distance quickly then slow down'],
ARRAY['Set up channels, pair up players, explain rules', 'Demonstrate body shape: side-on, showing one direction', 'Round 1: attacker dribbles, defender forces one way (5 attempts each)', 'Pause and coach: highlight good body shape examples', 'Round 2: increase intensity, defender can tackle (5 attempts each)', 'Rotate pairs and play final round'],
ARRAY['Teach central defending body shape and positioning', 'Develop patience and timing when defending 1v1', 'Build habit of forcing attacker in one direction'],
'15x10 metre channels. Attacker (orange bib) with football (soccer ball) at one end, defender (blue bib) at other. Arrows show defender forcing attacker one way.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-central-endzones-junior', 'U9', 'progressive', 15, '1 v 1 with End Zones',
'Set up 20x15 metre grids with 3-metre end zones at each end. 1v1: attacker scores by dribbling into the end zone. Defender scores by winning the ball and dribbling into the opposite end zone. Focus on steering the attacker, timing the tackle, and transitioning when winning the ball. Play 2-minute rounds.',
ARRAY['Cones (16) for grids with end zones', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Force one way — steer the attacker away from the end zone', 'Wait for the mistake — don''t commit too early', 'Stay balanced — ready to change direction', 'Time the tackle — only go when the ball is loose', 'Recover quickly if beaten — sprint back goal-side', 'Transition — attack immediately when you win the ball'],
ARRAY['Set up grids with end zones, explain scoring rules', 'Demonstrate steering: force attacker away from end zone', 'Round 1: 2-minute 1v1s, observe defending habits', 'Round 2: full pressure, coach highlights good defending', 'Round 3: competition — who scores most end zone entries?', 'Discuss: when to tackle vs when to wait'],
ARRAY['Add directional pressure to central 1v1 defending', 'Develop steering and timing of tackles', 'Build transition habits when winning the ball'],
'20x15 metre grid with 3-metre end zones shaded. Attacker (orange bib) with football (soccer ball) trying to reach end zone. Defender (blue bib) steering attacker. Arrows show defending angle.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-central-game-junior', 'U9', 'game', 20, 'Central Defending Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. Focus on central defending situations — body shape, pressing triggers, and transition moments. Play 2 x 8-minute halves with a 4-minute break. Minimal coaching — let the game teach.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Body shape — side-on when defending centrally', 'Press triggers — close down when attacker''s head is down', 'Force one way — show the attacker where you want them', 'Transition quickly when you win the ball', 'Support the defender — don''t leave them isolated', 'Communicate — organise your teammates'],
ARRAY['Explain game rules and focus on central defending', 'Play first half (8 minutes) — observe defending habits', 'Half-time: ask "How did you defend 1v1 centrally?"', 'Play second half (8 minutes) — encourage central defending habits', 'Cool down: players share one defending moment'],
ARRAY['Apply central defending technique in a real game', 'Develop decision making in central 1v1 situations', 'Build team defending habits and communication'],
'40x30 metre pitch with goals at each end. Two teams (orange vs blue bibs), 4-5 per side. Arrows show central 1v1 defending situations.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT '1 v 1 Defending (Central)', 'Players learn central 1v1 defending using correct body shape, forcing direction, and patience. Progresses from ball mastery through structured central defending practice to a game with natural defending situations.', 'U9', '1v1', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-central-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-central-skill-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-central-endzones-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-central-game-junior'),
65, ARRAY['Develop central defending body shape and positioning', 'Build patience and timing in 1v1 situations', 'Learn to steer attackers and force direction', 'Apply central defending habits in game situations'],
ARRAY['Side-on stance', 'Show one way', 'Don''t dive in', 'Transition when winning ball'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 19 (Scrape): Shooting (Power)
-- Header Slide 25: Junior Academy | Shooting Technique – Laces | 11.6.25
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-shooting-power-mastery-junior', 'U9', 'warmup', 10, 'Ball Mastery & Turns',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills: toe taps, sole rolls, inside-outside. Progress to turns at speed. Finish with dribbling races. Keep intensity high with short bursts.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to move', 'Quick feet — short sharp touches', 'Accelerate out of turns', 'Use both feet for mastery work', 'Keep ball within playing distance'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate ball mastery skills, players copy (3 minutes)', 'Progress to turns at speed (3 minutes)', 'Add dribbling races across the grid (2 minutes)', 'Competition: fastest through slalom (2 minutes)'],
ARRAY['Build intensity and warm up technique', 'Develop close ball control at speed', 'Prepare players for shooting practice'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball) performing ball mastery. Arrows show dribbling patterns.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-shooting-power-laces-junior', 'U9', 'skill_intro', 15, 'Laces Shooting',
'Set up shooting stations 15 metres from goal. Players take turns striking at goal using laces technique for power. Focus on striking through the ball, keeping head steady, and following through. Coach feeds balls from different angles. Progress to receiving a pass then shooting first time.',
ARRAY['Cones (8) for stations', 'Goals (2)', 'Balls (6)', 'Bibs (2 colours)'],
ARRAY['Head steady — eyes on the ball at point of contact', 'Laces contact — strike with the top of the foot', 'Follow through — leg continues towards the target', 'Plant foot pointing at target', 'Strike through the middle of the ball', 'Approach at slight angle for power'],
ARRAY['Set up shooting stations 15m from goal', 'Demonstrate laces technique: head steady, laces contact, follow through', 'Static shooting: 5 shots each, focus on technique (5 minutes)', 'Add a pass: receive and shoot first time (5 minutes)', 'Competition: who can hit the target most? (5 minutes)'],
ARRAY['Teach power shooting with laces technique', 'Develop correct striking mechanics', 'Build confidence shooting at goal with power'],
'Shooting stations 15 metres from goal. Players (orange bibs) lined up. Arrows show ball path to goal. Coach feeding from side. Strike zone on foot highlighted.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-shooting-power-transition-junior', 'U9', 'progressive', 15, '1 v 1 Transition',
'Set up a 25x20 metre area with a goal at one end. 1v1 transition: coach plays ball in, first player to react becomes attacker, other becomes defender. Attacker must shoot as early as possible. Focus on recognising GK position, creating an angle, and shooting early. Progress to 2v1.',
ARRAY['Cones (8) for area', 'Goals (1)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Shoot early — don''t take extra touches if you have a chance', 'Attack space — drive into the gap', 'Create angle — move the ball to find a shooting line', 'Recognise GK position — shoot to the open side', 'Power — use laces technique from the session', 'Be decisive — commit to the shot'],
ARRAY['Set up area with goal, explain transition rules', 'Demonstrate: react to ball, create angle, shoot early', 'Round 1: 1v1 transition, focus on early shooting (5 minutes)', 'Round 2: add condition — must shoot within 3 seconds (5 minutes)', 'Round 3: progress to 2v1 for combination play (5 minutes)'],
ARRAY['Encourage early shots in transition situations', 'Build decision making around when to shoot', 'Apply laces technique under pressure'],
'25x20 metre area with goal. Two players (orange and blue bibs) reacting to ball played by coach. Arrows show transition and shooting angle.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-shooting-power-game-junior', 'U9', 'game', 20, 'Shooting Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. Special rule: goals scored from outside a marked shooting zone (15 metres from goal) count double. Encourages long-range shooting with power. Play 2 x 8-minute halves.',
ARRAY['Cones (12) for pitch and shooting zones', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Hit corners — aim for accuracy with power', 'Quick decisions — shoot when the chance is there', 'Create space — move to find a shooting line', 'Use laces technique for power shots', 'Transition — attack quickly when you win the ball', 'Encourage shooting from distance'],
ARRAY['Explain rules: goals from outside shooting zone count double', 'Play first half (8 minutes) — observe shooting habits', 'Half-time: ask "Where were the best shooting chances?"', 'Play second half (8 minutes) — encourage long-range shooting', 'Cool down: players share their best shot'],
ARRAY['Apply power shooting in a real game', 'Develop shooting decision making under pressure', 'Build habit of shooting from distance'],
'40x30 metre pitch with goals at each end. Shooting zones marked 15m from each goal. Two teams (orange vs blue bibs). Arrows show long-range shooting opportunities.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Shooting (Power)', 'Players develop power shooting using laces technique. Progresses from ball mastery through structured shooting practice and 1v1 transition to a game rewarding long-range goals.', 'U9', 'Ball Striking', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-power-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-power-laces-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-power-transition-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-power-game-junior'),
60, ARRAY['Develop power shooting with laces technique', 'Build correct striking mechanics and follow through', 'Improve shooting decision making in transition', 'Apply power shooting habits in game situations'],
ARRAY['Head steady', 'Laces contact', 'Follow through', 'Shoot early'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 20 (Scrape): Rondo & Games
-- Header Slide 26: Junior Academy | 1 v 1 Competitiveness | 16.6.25
-- NOTE: Only 3 sessions in Bailey's content. Session 4 generated to fit framework.
-- Bailey's Session 3 (Game, 30 min) split into progressive (15 min) + game (15 min)
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-games-3v1-junior', 'U9', 'warmup', 15, 'Rondo (3v1)',
'Set up 8x8 metre squares. 3v1 rondo: 3 attackers keep possession, 1 defender presses. If defender wins ball, the passer who lost it swaps in. Focus on quick play, movement after passing, and scanning before receiving. Progress from free touch to 2-touch then 1-touch.',
ARRAY['Cones (16) for 4 rondo squares', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Back foot touch — receive across your body', 'Body shape — open up to see all options', 'Ball speed — keep the ball moving quickly', 'Scan before receiving — know your next pass', 'Move after passing — adjust your angle', 'Play simple — don''t overcomplicate'],
ARRAY['Set up rondo squares, explain 3v1 rules', '3v1 rondo: free touch (5 minutes)', 'Progress to 2-touch (5 minutes)', 'Progress to 1-touch (3 minutes)', 'Competition: which group keeps possession longest?', 'Rotate defenders regularly'],
ARRAY['Teach possession habits in tight spaces', 'Build scanning and body shape awareness', 'Increase ball speed through touch limits'],
'8x8 metre rondo squares. 3 attackers (orange bibs) around outside with football (soccer ball), 1 defender (blue bib) in middle. Arrows show passing lines.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-games-4v2-junior', 'U9', 'skill_intro', 15, 'Rondo (4v2)',
'Set up 10x10 metre squares. 4v2 rondo: 4 attackers keep possession against 2 defenders. Defenders work in pairs to press and cut passing lanes. If defenders win ball, the two attackers who lost it swap in. Focus on angles of support, tempo, and decision making.',
ARRAY['Cones (16) for 4 rondo squares', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Move early — adjust position before the ball arrives', 'Play simple — one or two touch, keep it moving', 'Scan before receiving — know where pressure is', 'Support angles — don''t hide behind the defender', 'Tempo — speed up when defenders are out of position', 'Communication — call for the ball'],
ARRAY['Set up 10x10m squares, explain 4v2 rules', '4v2 rondo: free touch (5 minutes)', 'Progress to 2-touch (5 minutes)', 'Add condition: 5 consecutive passes = 1 point (3 minutes)', 'Competition: which group scores most points?', 'Rotate defenders every 2 minutes'],
ARRAY['Increase difficulty with two defenders pressing', 'Improve decision making under pressure', 'Develop support angles and communication'],
'10x10 metre rondo squares. 4 attackers (orange bibs) around outside, 2 defenders (blue bibs) in middle. Arrows show passing lines and pressing angles.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-games-possession-junior', 'U9', 'progressive', 15, 'Possession Game',
'Set up 25x20 metre grids. 4v4 possession with end zones: team with ball keeps it and scores by passing into the end zone. Other team presses. Focus on switching play, patience, and finding the open space. Progress by adding a neutral player (5v4 in possession).',
ARRAY['Cones (12) for grids and end zones', 'Balls (3)', 'Bibs (3 colours for teams and neutral)'],
ARRAY['Movement — create passing options constantly', 'Decision making — when to play forward vs keep possession', 'Scan — look for the open end zone', 'Switch play — if one side is blocked, go the other way', 'Patience — keep the ball until the right moment', 'Support the ball carrier — always give an option'],
ARRAY['Set up grids with end zones, explain rules', 'Play 4v4 possession with end zones (5 minutes)', 'Add neutral player: 5v4 in possession (5 minutes)', 'Final round: competition between groups (5 minutes)'],
ARRAY['Build structured possession with end zone targets', 'Develop switching play and patience', 'Encourage decision making in possession'],
'25x20 metre grid with end zones shaded. 4v4 possession: orange vs blue. Neutral player (yellow bib). Arrows show passing to end zones.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-games-4goal-junior', 'U9', 'game', 15, '4-Goal Game',
'Set up a 30x25 metre pitch with 4 small goals — one on each side. 4v4 game. Teams can score in any goal. Encourages switching play, scanning, and applying possession habits from the session. Play 2 x 6-minute halves. Focus on movement, decision making, and keeping the ball.',
ARRAY['Cones (16) for pitch and goals', 'Small goals (4)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Movement — find space and create options', 'Decision making — which goal is open?', 'Scan — look for undefended goals before receiving', 'Switch play — attack the open goal', 'Keep possession — don''t rush, find the right moment', 'Transition — defend all 4 goals when you lose it'],
ARRAY['Explain 4-goal game rules: score in any goal', 'Play first half (6 minutes) — observe possession habits', 'Half-time: ask "How did you find the open goal?"', 'Play second half (6 minutes) — encourage switching play', 'Cool down: discuss best team moves'],
ARRAY['Apply possession habits in multi-directional game', 'Develop scanning and switching play', 'Build decision making in game situations'],
'30x25 metre pitch with 4 small goals. 4v4: orange vs blue. Football (soccer ball) in play. Arrows show switching play.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Rondo & Games', 'Players develop possession habits through rondo progressions and apply them in game situations. Progresses from 3v1 rondo through 4v2 and possession games to a 4-goal game encouraging switching play.', 'U9', 'Passing/Receiving', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-games-3v1-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-games-4v2-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-games-possession-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-games-4goal-junior'),
60, ARRAY['Develop possession habits through rondo play', 'Build scanning and body shape awareness', 'Improve decision making with increasing pressure', 'Apply possession habits in multi-directional game'],
ARRAY['Back foot touch', 'Body shape', 'Ball speed', 'Switching play'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 21 (Scrape): 1 v 1 Attacking (Wide)
-- Header Slide 27: Junior Academy ID | 2 v 1 / 3 v 2 – Defending | 18.6.25
-- NOTE: Header name mismatches scrape content. Using scrape content as ground truth.
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-wide-mastery-junior', 'U9', 'warmup', 15, 'Ball Mastery & Juggling',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills with emphasis on fakes and acceleration: step-overs, body feints, shoulder drops. After each skill (30 seconds), players juggle for 20 seconds. Progress to dribbling at speed down the wings. Finish with 1v1 races.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to explode', 'Accelerate after fakes — sell the move then burst away', 'Keep ball close during mastery work', 'Use both feet for step-overs and feints', 'Commit to the move — make it convincing'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate fakes: step-over, body feint, shoulder drop', 'Players copy each skill with juggling between', 'Progress to dribbling at speed with direction changes', 'Add 1v1 races down the wing', 'Cool down with free juggling'],
ARRAY['Build intensity with emphasis on fakes and acceleration', 'Develop close ball control and deception', 'Improve acceleration out of skill moves'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball) performing step-overs and body feints. Arrows show dribbling with acceleration.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-wide-skill-junior', 'U9', 'skill_intro', 15, '1 v 1 Wide',
'Set up 20x10 metre wide channels. 1v1: attacker starts with the ball on the touchline, defender opposite. Attacker tries to beat the defender and get to the end line to cross or cut inside. Focus on attacking space quickly, using disguise, and accelerating past the defender. Swap roles after each attempt.',
ARRAY['Cones (16) for 4 wide channels', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Attack space quickly — drive at the defender with pace', 'Use disguise — body feints, step-overs to unbalance defender', 'Accelerate past defender — burst of speed after the move', 'Get to the end line — deliver a cross or cut inside', 'Commit to the move — don''t hesitate', 'Use the touchline as a friend — it protects one side'],
ARRAY['Set up wide channels, pair up players, explain rules', 'Demonstrate: attack space, use feint, accelerate past', 'Round 1: attacker beats defender to end line (5 attempts each)', 'Pause and coach: highlight good use of disguise', 'Round 2: increase defender pressure (5 attempts each)', 'Rotate pairs and play final round'],
ARRAY['Teach wide 1v1 attacking technique', 'Develop use of disguise and acceleration', 'Build confidence to take on defenders in wide areas'],
'20x10 metre wide channel. Attacker (orange bib) with football (soccer ball) on touchline, defender (blue bib) opposite. Arrows show attacker using feint then accelerating to end line.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-wide-goal-junior', 'U9', 'progressive', 15, '1 v 1 to Goal (Wide)',
'Set up a 25x20 metre area with a goal at one end and wide channels marked. 1v1: attacker starts wide with the ball, must beat the defender and either cross or cut inside to shoot. Focus on creating an angle, shooting early, and recognising the GK position. Progress to 2v1.',
ARRAY['Cones (12) for area and wide channels', 'Goals (1)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Shoot early — don''t take extra touches if you have a chance', 'Attack defender''s front foot — run straight at them', 'Recognise GK position — shoot to the open side', 'Create angle — cut inside or get to the end line', 'Be decisive — commit to cross or shoot', 'Use disguise to create the opportunity'],
ARRAY['Set up area with goal and wide channels, explain rules', 'Demonstrate: beat defender wide, create angle, finish', 'Round 1: 1v1 from wide, focus on end product (5 minutes)', 'Round 2: add condition — must finish within 3 seconds (5 minutes)', 'Round 3: progress to 2v1 for crossing options (5 minutes)'],
ARRAY['Add finishing decisions to wide 1v1 attacking', 'Develop ability to create shooting angles from wide', 'Build habit of delivering end product after beating defender'],
'25x20 metre area with goal. Wide channels marked. Attacker (orange bib) with football (soccer ball) starting wide. Defender (blue bib). Arrows show cutting inside and shooting.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-wide-game-junior', 'U9', 'game', 20, 'Wide Attacking Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. Special rule: goals scored from crosses or after beating a defender in a wide area count double. Play 2 x 8-minute halves. Encourage wide play and creativity.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Attack space — drive wide when you have the ball', 'Quick decisions — cross, cut inside, or shoot?', 'Creativity — try different moves to beat defenders', 'Transition — attack quickly when you win the ball', 'Support the wide player — make runs into the box', 'Use width — stretch the defence'],
ARRAY['Explain rules: goals from wide play count double', 'Play first half (8 minutes) — observe wide 1v1 situations', 'Half-time: ask "What worked best in wide areas?"', 'Play second half (8 minutes) — encourage wide attacking', 'Cool down: players demonstrate their favourite wide move'],
ARRAY['Apply wide 1v1 attacking in a real game', 'Develop creativity and decision making in wide areas', 'Build confidence to take on defenders wide'],
'40x30 metre pitch with goals at each end. Two teams (orange vs blue bibs). Wide zones highlighted. Arrows show wide 1v1 attacking and crossing.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT '1 v 1 Attacking (Wide)', 'Players develop wide 1v1 attacking skills using disguise, acceleration, and end product. Progresses from ball mastery through structured wide channel practice to a game rewarding wide play.', 'U9', '1v1', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-wide-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-wide-skill-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-wide-goal-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-wide-game-junior'),
65, ARRAY['Develop wide 1v1 attacking technique with disguise', 'Build confidence to take on defenders in wide areas', 'Improve end product after beating a defender', 'Apply wide attacking creativity in game situations'],
ARRAY['Attack space quickly', 'Use disguise', 'Accelerate past', 'End product'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 22 (Scrape): Passing & Receiving (Movement)
-- Header Slide 28: Junior Academy | Pass & Control | 23.6.25
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-passing-movement-passing2s-junior', 'U9', 'warmup', 10, 'Passing in 2s',
'Players pair up in a 20x20 metre grid, one ball per pair, 10 metres apart. Punch pass practice with emphasis on movement after passing. Pass and move to a new position — never stand still. Build rhythm and tempo. Competition: first pair to 30 passes wins.',
ARRAY['Cones (8) for grid', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Firm pass — punch through the ball', 'No spin — strike through the middle', 'Move after pass — immediately find a new position', 'Back foot control — receive across your body', 'Open body shape — see the field', 'Build rhythm — pass, move, receive, repeat'],
ARRAY['Set up 20x20m grid, pair up players 10 metres apart', 'Demonstrate punch pass with movement after', 'Static passing: focus on technique (2 minutes)', 'Add movement: pass and move to new position (4 minutes)', 'Competition: first pair to 30 passes (4 minutes)'],
ARRAY['Improve passing technique with movement', 'Develop habit of moving after every pass', 'Build rhythm and tempo in passing'],
'20x20 metre grid. Pairs (orange bibs) passing football (soccer ball) with movement arrows after each pass.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-passing-movement-drill-junior', 'U9', 'skill_intro', 15, 'Movement Passing Drill',
'Set up 20x15 metre grids. Groups of 5-6 with 2 balls. Players pass and move continuously — after passing, check your shoulder and move to a new space. Focus on timing of movement, angles of support, and playing simple. Progress to adding a defender who intercepts.',
ARRAY['Cones (12) for 3 grids', 'Balls (6)', 'Bibs (2 colours)'],
ARRAY['Move early — start your run before the ball arrives', 'Check shoulders — scan before receiving', 'Play simple — one or two touch maximum', 'Timing of run — arrive as the ball arrives', 'Support angles — show at an angle, not behind a defender', 'Communication — call for the ball'],
ARRAY['Set up grids, explain movement passing rules', 'Round 1: pass and move, free touch (5 minutes)', 'Pause and coach: highlight good movement examples', 'Round 2: add 2-touch limit (5 minutes)', 'Round 3: add a defender to intercept (5 minutes)'],
ARRAY['Teach movement off the ball after passing', 'Develop timing and angles of support', 'Build scanning habits before receiving'],
'20x15 metre grid. 5-6 players (orange bibs) with 2 footballs (soccer balls). Arrows show pass-and-move patterns. Players checking shoulders before receiving.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-passing-movement-possession-junior', 'U9', 'progressive', 15, 'Possession Game',
'Set up 25x20 metre grids. 4v4 possession: team with ball keeps it, other team presses. Score 1 point for 5 consecutive passes. Focus on movement after every pass — no standing still. Progress by adding end zones.',
ARRAY['Cones (12) for grids and end zones', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Scan early — know your options before the ball arrives', 'Play simple — quick, accurate passes', 'Move after pass — find a new angle immediately', 'Balance — maintain team shape', 'Support angles — give the ball carrier options', 'Patience — keep the ball, don''t rush'],
ARRAY['Set up grids, explain possession rules', 'Play 4v4 possession: 5 passes = 1 point (5 minutes)', 'Add end zones: score by passing into zone (5 minutes)', 'Final round: competition between groups (5 minutes)'],
ARRAY['Build decision making in possession with movement', 'Develop support play and passing angles', 'Maintain balance and team shape'],
'25x20 metre grid. 4v4 possession: orange vs blue. End zones shaded. Arrows show passing and movement after pass.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-passing-movement-4goal-junior', 'U9', 'game', 20, '4-Goal Game',
'Set up a 30x25 metre pitch with 4 small goals — one on each side. 4v4 game. Teams can score in any goal. Encourages movement, switching play, and patience. Play 2 x 8-minute halves. Focus on applying movement habits from the session.',
ARRAY['Cones (16) for pitch and goals', 'Small goals (4)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Ball speed — keep passes firm and accurate', 'Movement — create passing options after every pass', 'Patience — find the open goal, don''t rush', 'Switch play — if one side is blocked, go the other way', 'Scan — look for which goal is undefended', 'Transition — defend all 4 goals when you lose it'],
ARRAY['Explain 4-goal game rules: score in any goal', 'Play first half (8 minutes) — observe movement habits', 'Half-time: ask "Who moved best after passing?"', 'Play second half (8 minutes) — encourage movement', 'Cool down: discuss best team passing moves'],
ARRAY['Apply movement habits in multi-directional game', 'Develop scanning and switching play', 'Build patience and movement in possession'],
'30x25 metre pitch with 4 small goals. 4v4: orange vs blue. Football (soccer ball) in play. Arrows show movement after passing and switching play.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Passing & Receiving (Movement)', 'Players develop passing technique with emphasis on movement off the ball. Progresses from paired passing through movement drills and possession games to a 4-goal game encouraging constant movement.', 'U9', 'Passing/Receiving', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-passing-movement-passing2s-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-passing-movement-drill-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-passing-movement-possession-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-passing-movement-4goal-junior'),
60, ARRAY['Develop passing technique with movement after', 'Build movement off the ball habits', 'Improve support angles and timing of runs', 'Apply movement habits in game situations'],
ARRAY['Move after pass', 'Check shoulders', 'Play simple', 'Ball speed'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 23 (Scrape): 1 v 1 Defending (Recovery)
-- Header Slide 29: Junior Academy | 1 v 1 – Dribbling (Escaping Pressure) | 14.7.24
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-recovery-mastery-junior', 'U9', 'warmup', 15, 'Ball Mastery & Juggling',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills: toe taps, sole rolls, inside-outside, drag-backs. Progress to turns at speed with acceleration. Finish with sprint races. Keep intensity high — this session demands fitness.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to change direction', 'Accelerate after turns — burst away with pace', 'Keep ball close to feet during mastery work', 'Quick feet — short sharp touches', 'High intensity — match the effort needed for recovery runs'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate ball mastery skills, players copy for 30 seconds each', 'Progress to turns at speed with acceleration', 'Add sprint races across the grid (recovery run simulation)', 'Competition: fastest through cone slalom', 'Cool down with free juggling'],
ARRAY['Build high intensity for recovery defending demands', 'Develop close ball control and turning technique', 'Improve fitness and sprint recovery'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball) performing ball mastery. Arrows show sprint patterns.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-recovery-skill-junior', 'U9', 'skill_intro', 15, 'Recovery 1 v 1',
'Set up 20x15 metre channels. Attacker starts with the ball 5 metres ahead of the defender. On the whistle, attacker dribbles towards the end line while defender sprints to recover and get goal-side. Focus on sprint recovery, angle of approach, and showing one way once recovered. Swap roles after each attempt.',
ARRAY['Cones (16) for 4 channels', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Sprint recovery — get back goal-side as fast as possible', 'Show one way — once recovered, force the attacker in one direction', 'Don''t dive in — be patient once you''ve recovered', 'Angle of approach — curve your run to get goal-side', 'Stay on your feet — don''t slide in', 'Communicate — let teammates know you''re recovering'],
ARRAY['Set up channels, pair up players, explain recovery rules', 'Demonstrate: sprint recovery, curve run, get goal-side', 'Round 1: attacker has 5m head start, defender recovers (5 attempts each)', 'Pause and coach: highlight good recovery angles', 'Round 2: increase head start to 7m (5 attempts each)', 'Rotate pairs and play final round'],
ARRAY['Teach recovery defending technique and sprint effort', 'Develop correct angle of approach when recovering', 'Build habit of showing one way after recovery'],
'20x15 metre channel. Attacker (orange bib) with football (soccer ball) 5m ahead. Defender (blue bib) sprinting to recover. Curved arrow shows recovery run angle to get goal-side.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-recovery-endzones-junior', 'U9', 'progressive', 15, '1 v 1 with End Zones',
'Set up 20x15 metre grids with 3-metre end zones. 1v1: attacker scores by dribbling into the end zone. Defender starts behind the attacker and must recover to defend. Focus on steering the attacker after recovery, timing the tackle, and staying balanced. Play 2-minute rounds.',
ARRAY['Cones (16) for grids with end zones', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Force one way — steer the attacker after recovering', 'Wait for the mistake — don''t commit too early', 'Stay balanced — ready to change direction', 'Time the tackle — only go when the ball is loose', 'Recovery sprint — get goal-side first', 'Transition — attack immediately when you win the ball'],
ARRAY['Set up grids with end zones, explain recovery rules', 'Demonstrate: recover, get goal-side, steer attacker', 'Round 1: defender starts behind, recovers to defend (5 minutes)', 'Round 2: full pressure, coach highlights good recovery (5 minutes)', 'Round 3: competition — who defends most successfully? (5 minutes)'],
ARRAY['Add directional pressure to recovery defending', 'Develop steering after recovery sprint', 'Build transition habits when winning the ball'],
'20x15 metre grid with end zones. Attacker (orange bib) with football (soccer ball). Defender (blue bib) starting behind, recovering. Arrows show recovery run and steering angle.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-recovery-game-junior', 'U9', 'game', 20, 'Recovery Defending Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. Focus on recovery defending — getting back goal-side when beaten. Play 2 x 8-minute halves with a 4-minute break. Minimal coaching — let the game create natural recovery situations.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Body shape — side-on when defending', 'Press triggers — close down when attacker''s head is down', 'Recovery sprint — get back goal-side when beaten', 'Transition quickly when you win the ball', 'Support the defender — cover and balance', 'Communicate — organise recovery'],
ARRAY['Explain game rules and focus on recovery defending', 'Play first half (8 minutes) — observe recovery situations', 'Half-time: ask "When did you need to recover?"', 'Play second half (8 minutes) — encourage recovery habits', 'Cool down: players share one recovery moment'],
ARRAY['Apply recovery defending in a real game', 'Develop sprint effort and recovery habits', 'Build team defending and communication'],
'40x30 metre pitch with goals at each end. Two teams (orange vs blue bibs). Arrows show recovery runs and defending situations.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT '1 v 1 Defending (Recovery)', 'Players learn recovery defending — sprinting back goal-side, using correct angle of approach, and showing one way after recovering. Progresses from high-intensity ball mastery through recovery 1v1 drills to a game with natural recovery situations.', 'U9', '1v1', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-recovery-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-recovery-skill-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-recovery-endzones-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-recovery-game-junior'),
65, ARRAY['Develop recovery defending technique and sprint effort', 'Build correct angle of approach when recovering', 'Learn to steer attackers after recovery', 'Apply recovery defending habits in game situations'],
ARRAY['Sprint recovery', 'Angle of approach', 'Show one way', 'Don''t dive in'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 24 (Scrape): Shooting (1 v 1 Finishing)
-- Header Slide 30: Junior Academy | Pass & Control – Escaping Pressure | 16.7.25
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-shooting-1v1-finishing-mastery-junior', 'U9', 'warmup', 10, 'Ball Mastery & Turns',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills: toe taps, sole rolls, inside-outside. Progress to turns at speed. Finish with dribbling races towards goal. Keep intensity high.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to move', 'Quick feet — short sharp touches', 'Accelerate out of turns', 'Use both feet for mastery work', 'Keep ball within playing distance'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate ball mastery skills, players copy (3 minutes)', 'Progress to turns at speed (3 minutes)', 'Add dribbling races towards goal (2 minutes)', 'Competition: fastest through slalom (2 minutes)'],
ARRAY['Build intensity and warm up technique', 'Develop close ball control at speed', 'Prepare players for finishing practice'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball) performing ball mastery. Arrows show dribbling towards goal.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-shooting-1v1-finishing-skill-junior', 'U9', 'skill_intro', 15, '1 v 1 Finishing',
'Set up a 20x15 metre area with a goal. 1v1: attacker starts with the ball 20 metres from goal, defender starts 5 metres in front. Attacker must beat the defender and finish. Focus on creating an angle to shoot, recognising the GK position, and shooting early. Swap roles after each attempt.',
ARRAY['Cones (8) for area', 'Goals (1)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Shoot early — take the chance when it appears', 'Attack space — drive into the gap behind the defender', 'Create angle — move the ball to find a shooting line', 'Recognise GK position — shoot to the open side', 'Be decisive — commit to shoot or dribble', 'Composure — stay calm in front of goal'],
ARRAY['Set up area with goal, explain 1v1 finishing rules', 'Demonstrate: beat defender, create angle, finish', 'Round 1: 1v1 finishing, focus on creating angle (5 minutes)', 'Pause and coach: highlight good finishing examples', 'Round 2: add condition — must shoot within 3 seconds (5 minutes)', 'Competition: who scores most? (5 minutes)'],
ARRAY['Teach finishing under pressure in 1v1 situations', 'Develop ability to create shooting angles', 'Build composure and decision making in front of goal'],
'20x15 metre area with goal. Attacker (orange bib) with football (soccer ball) facing defender (blue bib). Arrows show attacker creating angle and shooting. GK in goal.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-shooting-1v1-finishing-2v1-junior', 'U9', 'progressive', 15, '2 v 1 to Goal',
'Set up a 25x20 metre area with a goal. 2v1: two attackers combine to create a finishing chance against one defender. Focus on timing of pass, movement off the ball, and shooting early when the chance is there. Progress to 2v2 for more pressure.',
ARRAY['Cones (8) for area', 'Goals (1)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Play early — release the pass before the defender closes', 'Movement off ball — make a run to create space', 'Shoot early — don''t take extra touches', 'Timing of run — arrive as the ball arrives', 'Combination play — wall passes, overlaps', 'Decision making — pass or shoot?'],
ARRAY['Set up area with goal, explain 2v1 rules', 'Demonstrate: timing of pass and movement', 'Round 1: 2v1 attacks, focus on combination play (5 minutes)', 'Round 2: add condition — must finish within 3 touches (5 minutes)', 'Round 3: progress to 2v2 for more pressure (5 minutes)'],
ARRAY['Encourage combination play to create finishing chances', 'Develop timing of passes and runs', 'Build decision making around when to pass vs shoot'],
'25x20 metre area with goal. 2 attackers (orange bibs) with football (soccer ball). 1 defender (blue bib). Arrows show combination play and shooting.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-shooting-1v1-finishing-game-junior', 'U9', 'game', 20, 'Finishing Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. Encourage shooting and finishing by awarding double points for first-time finishes. Play 2 x 8-minute halves. Focus on applying finishing habits from the session.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Hit corners — aim for placement and accuracy', 'Quick decisions — shoot when the chance is there', 'Create space — move to find a shooting line', 'Combination play — use teammates to create chances', 'Transition — attack quickly when you win the ball', 'Composure — stay calm in front of goal'],
ARRAY['Explain rules: first-time finishes count double', 'Play first half (8 minutes) — observe finishing habits', 'Half-time: ask "Where were the best chances?"', 'Play second half (8 minutes) — encourage early shooting', 'Cool down: players share their best goal'],
ARRAY['Apply 1v1 finishing habits in a real game', 'Develop shooting decision making under pressure', 'Build composure in front of goal'],
'40x30 metre pitch with goals at each end. Two teams (orange vs blue bibs). Arrows show shooting opportunities and finishing.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Shooting (1 v 1 Finishing)', 'Players develop finishing under pressure in 1v1 situations. Progresses from ball mastery through structured 1v1 finishing and 2v1 combination play to a game rewarding early shooting.', 'U9', 'Ball Striking', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-1v1-finishing-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-1v1-finishing-skill-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-1v1-finishing-2v1-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-1v1-finishing-game-junior'),
60, ARRAY['Develop finishing technique under 1v1 pressure', 'Build composure and decision making in front of goal', 'Improve combination play to create chances', 'Apply finishing habits in game situations'],
ARRAY['Shoot early', 'Create angle', 'Recognise GK position', 'Composure'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 25 (Scrape): Rondo (Support Play)
-- Header Slide 31: Junior Academy | 1 v 1 – Finishing | 28.7.25
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-support-3v1-junior', 'U9', 'warmup', 15, 'Rondo (3v1)',
'Set up 8x8 metre squares. 3v1 rondo: 3 attackers keep possession, 1 defender presses. If defender wins ball, the passer who lost it swaps in. Focus on quick play, movement after passing, and scanning. Progress from free touch to 2-touch then 1-touch.',
ARRAY['Cones (16) for 4 rondo squares', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Back foot touch — receive across your body', 'Body shape — open up to see all options', 'Ball speed — keep the ball moving quickly', 'Scan before receiving — know your next pass', 'Move after passing — adjust your angle', 'Play simple — don''t overcomplicate'],
ARRAY['Set up rondo squares, explain 3v1 rules', '3v1 rondo: free touch (5 minutes)', 'Progress to 2-touch (5 minutes)', 'Progress to 1-touch (3 minutes)', 'Competition: which group keeps possession longest?', 'Rotate defenders regularly'],
ARRAY['Teach possession habits in tight spaces', 'Build scanning and body shape awareness', 'Increase ball speed through touch limits'],
'8x8 metre rondo squares. 3 attackers (orange bibs) with football (soccer ball), 1 defender (blue bib) in middle. Arrows show passing lines.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-support-4v2-junior', 'U9', 'skill_intro', 15, 'Rondo (4v2) – Support Play',
'Set up 10x10 metre squares. 4v2 rondo with emphasis on support play: 4 attackers keep possession against 2 defenders. Focus on angles of support — always give the ball carrier two passing options. Move early to create angles. Defenders work in pairs to press.',
ARRAY['Cones (16) for 4 rondo squares', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Move early — adjust position before the ball arrives', 'Play simple — one or two touch, keep it moving', 'Scan before receiving — know where pressure is', 'Support angles — show at an angle, not flat', 'Two options — always give the ball carrier two passing lines', 'Communication — call for the ball'],
ARRAY['Set up 10x10m squares, explain 4v2 with support focus', '4v2 rondo: free touch, focus on support angles (5 minutes)', 'Progress to 2-touch (5 minutes)', 'Add condition: 5 consecutive passes = 1 point (3 minutes)', 'Competition: which group scores most points?', 'Rotate defenders every 2 minutes'],
ARRAY['Improve support play and angles of support', 'Develop decision making under pressure', 'Build communication and movement habits'],
'10x10 metre rondo squares. 4 attackers (orange bibs), 2 defenders (blue bibs). Arrows show support angles and passing lines.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-support-possession-junior', 'U9', 'progressive', 15, 'Possession Game',
'Set up 25x20 metre grids. 4v4 possession with end zones. Focus on width, depth, and switching play. Score by passing into the end zone. Encourage balance and patience — keep the ball until the right moment to play forward.',
ARRAY['Cones (12) for grids and end zones', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Balance — maintain team shape and spacing', 'Patience — keep the ball, don''t rush forward', 'Ball speed — move the ball quickly to stretch the defence', 'Width and depth — spread out to create passing options', 'Switching play — if one side is blocked, go the other way', 'Support the ball carrier — always give an option'],
ARRAY['Set up grids with end zones, explain rules', 'Play 4v4 possession with end zones (5 minutes)', 'Add condition: must use width before scoring (5 minutes)', 'Final round: competition between groups (5 minutes)'],
ARRAY['Build structured possession with support play', 'Develop switching play and patience', 'Encourage width and depth in possession'],
'25x20 metre grid with end zones. 4v4 possession: orange vs blue. Arrows show width, depth, and switching play.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-support-4goal-junior', 'U9', 'game', 20, '4-Goal Game',
'Set up a 30x25 metre pitch with 4 small goals — one on each side. 4v4 game. Teams can score in any goal. Encourages switching play, scanning, and support play. Play 2 x 8-minute halves. Focus on applying support play habits.',
ARRAY['Cones (16) for pitch and goals', 'Small goals (4)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Movement — create passing options and find space', 'Decision making — which goal is open?', 'Support play — always give the ball carrier options', 'Switch play — attack the open goal', 'Patience — keep possession until the right moment', 'Transition — defend all 4 goals when you lose it'],
ARRAY['Explain 4-goal game rules: score in any goal', 'Play first half (8 minutes) — observe support play', 'Half-time: ask "How did you support the ball carrier?"', 'Play second half (8 minutes) — encourage support angles', 'Cool down: discuss best team moves'],
ARRAY['Apply support play habits in multi-directional game', 'Develop scanning and switching play', 'Build patience and decision making'],
'30x25 metre pitch with 4 small goals. 4v4: orange vs blue. Football (soccer ball) in play. Arrows show support play and switching.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Rondo (Support Play)', 'Players develop support play through rondo progressions focusing on angles of support and giving the ball carrier options. Finishes with a 4-goal game encouraging switching play and patience.', 'U9', 'Passing/Receiving', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-support-3v1-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-support-4v2-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-support-possession-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-support-4goal-junior'),
65, ARRAY['Develop support play and angles of support', 'Build scanning and body shape awareness', 'Improve decision making with increasing pressure', 'Apply support play habits in game situations'],
ARRAY['Support angles', 'Move early', 'Play simple', 'Switching play'],
'Academy', 'Junior Football';

-- ============================================================================
-- SLIDE 26 (Scrape): 1 v 1 Attacking (Finishing)
-- Header Slide 32: Junior Academy | Pass & Control | 4.8.25
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-finishing-mastery-junior', 'U9', 'warmup', 15, 'Ball Mastery & Juggling',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills with emphasis on fakes and feints: step-overs, body feints, shoulder drops. After each skill (30 seconds), players juggle for 20 seconds. Progress to dribbling at speed towards goal. Finish with 1v1 races.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to explode', 'Accelerate after fakes — sell the move then burst away', 'Keep ball close during mastery work', 'Use both feet for step-overs and feints', 'Commit to the move — make it convincing'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate fakes: step-over, body feint, shoulder drop', 'Players copy each skill with juggling between', 'Progress to dribbling at speed towards goal', 'Add 1v1 races', 'Cool down with free juggling'],
ARRAY['Build intensity with emphasis on fakes and acceleration', 'Develop close ball control and deception', 'Prepare players for 1v1 finishing practice'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball) performing step-overs. Arrows show dribbling towards goal.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-finishing-skill-junior', 'U9', 'skill_intro', 15, '1 v 1 to Goal',
'Set up a 20x15 metre area with a goal. 1v1: attacker starts with the ball 20 metres from goal, defender starts 5 metres in front. Attacker must beat the defender and finish. Focus on creating an angle, shooting early, and attacking the defender''s front foot. Swap roles after each attempt.',
ARRAY['Cones (8) for area', 'Goals (1)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Shoot early — take the chance when it appears', 'Attack defender''s front foot — run straight at them', 'Recognise GK position — shoot to the open side', 'Create angle — move the ball to find a shooting line', 'Use disguise — feints to create the shooting opportunity', 'Be decisive — commit to shoot or dribble'],
ARRAY['Set up area with goal, explain 1v1 finishing rules', 'Demonstrate: attack front foot, create angle, finish', 'Round 1: 1v1 to goal, focus on creating angle (5 minutes)', 'Pause and coach: highlight good finishing examples', 'Round 2: add condition — must shoot within 3 seconds (5 minutes)', 'Competition: who scores most? (5 minutes)'],
ARRAY['Teach finishing from 1v1 situations', 'Develop ability to create shooting angles', 'Build composure in front of goal'],
'20x15 metre area with goal. Attacker (orange bib) with football (soccer ball) facing defender (blue bib). Arrows show creating angle and shooting.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-finishing-gates-junior', 'U9', 'progressive', 15, '1 v 1 with Gates',
'Set up a 20x15 metre area with 3 cone gates (2 metres wide) spread across the middle. 1v1: attacker must dribble through a gate to score. Defender tries to block all gates. Focus on choosing the correct gate, using disguise, and accelerating through. Progress to adding a goal behind the gates.',
ARRAY['Cones (14) for area and gates', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Attack space — drive at the open gate', 'Use disguise — feint one way, go the other', 'Accelerate through gate — burst of speed', 'Choose the right gate — scan before committing', 'Be decisive — commit to your choice', 'Transition — defend immediately if you lose the ball'],
ARRAY['Set up area with 3 gates, explain rules', 'Demonstrate: scan gates, use feint, accelerate through', 'Round 1: 1v1 with gates, focus on gate selection (5 minutes)', 'Round 2: add goal behind gates — must go through gate then finish (5 minutes)', 'Round 3: competition — who scores most? (5 minutes)'],
ARRAY['Add directional decisions to 1v1 attacking', 'Develop scanning and gate selection', 'Build acceleration through contact'],
'20x15 metre area with 3 cone gates across the middle. Attacker (orange bib) with football (soccer ball). Defender (blue bib) covering gates. Arrows show feint and acceleration through gate.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-finishing-game-junior', 'U9', 'game', 20, '1 v 1 Finishing Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. Encourage 1v1 attacking and finishing by awarding double points for goals scored after beating a defender. Play 2 x 8-minute halves. Focus on creativity and finishing.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Attack space — drive forward when you have the ball', 'Quick decisions — take on or pass?', 'Creativity — try different moves to beat defenders', 'Finish with composure — stay calm in front of goal', 'Transition — attack quickly when you win the ball', 'Support the attacker — give passing options'],
ARRAY['Explain rules: goals after beating a defender count double', 'Play first half (8 minutes) — observe 1v1 finishing', 'Half-time: ask "What moves worked best?"', 'Play second half (8 minutes) — encourage creativity and finishing', 'Cool down: players demonstrate their favourite move'],
ARRAY['Apply 1v1 attacking and finishing in a real game', 'Develop creativity and decision making', 'Build confidence to take on defenders and finish'],
'40x30 metre pitch with goals at each end. Two teams (orange vs blue bibs). Arrows show 1v1 attacking and finishing.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT '1 v 1 Attacking (Finishing)', 'Players develop 1v1 attacking with a focus on finishing. Progresses from ball mastery through 1v1 to goal and gate drills to a game rewarding creativity and finishing after beating defenders.', 'U9', '1v1', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-finishing-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-finishing-skill-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-finishing-gates-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-finishing-game-junior'),
65, ARRAY['Develop 1v1 attacking with finishing focus', 'Build composure and decision making in front of goal', 'Improve use of disguise and gate selection', 'Apply 1v1 finishing habits in game situations'],
ARRAY['Shoot early', 'Attack front foot', 'Use disguise', 'Accelerate through'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 27 (Scrape): Passing (Speed of Play)
-- Header Slide 33: Junior Academy | Pass & Control – Building Up | 6.8.25
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-passing-speed-passing2s-junior', 'U9', 'warmup', 10, 'Passing in 2s',
'Players pair up in a 20x20 metre grid, one ball per pair, 10 metres apart. Punch pass practice with emphasis on speed of play. Pass and move immediately — build rhythm and tempo. Progress to 1-touch passing. Competition: first pair to 30 passes wins.',
ARRAY['Cones (8) for grid', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Firm pass — punch through the ball', 'No spin — strike through the middle', 'Move after pass — don''t stand still', 'Back foot control — receive across your body', 'Open body shape — see the field', 'Build rhythm — increase tempo with each round'],
ARRAY['Set up 20x20m grid, pair up players 10 metres apart', 'Demonstrate punch pass with speed emphasis', 'Static passing: focus on technique (2 minutes)', 'Add movement: pass and move at speed (4 minutes)', 'Competition: first pair to 30 passes (4 minutes)'],
ARRAY['Improve passing technique with speed emphasis', 'Develop movement habits after passing', 'Build rhythm and tempo in passing'],
'20x20 metre grid. Pairs (orange bibs) passing football (soccer ball) at speed. Arrows show pass-and-move patterns.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-passing-speed-drill-junior', 'U9', 'skill_intro', 15, 'Speed Passing Drill',
'Set up 20x15 metre grids. Groups of 5-6 with 2 balls. Quick combination passing: one-twos, third-man runs, and wall passes at speed. Focus on playing early, moving after every pass, and scanning before receiving. Progress to adding a defender.',
ARRAY['Cones (12) for 3 grids', 'Balls (6)', 'Bibs (2 colours)'],
ARRAY['Play early — release the pass before pressure arrives', 'Move after pass — find a new position immediately', 'Scan before receiving — know your next pass', 'Quick combinations — one-twos and wall passes', 'Weight of pass — firm enough to maintain tempo', 'Communication — call for the ball early'],
ARRAY['Set up grids, explain speed passing rules', 'Round 1: quick combinations, free touch (5 minutes)', 'Pause and coach: highlight good speed of play', 'Round 2: add 2-touch limit (5 minutes)', 'Round 3: add a defender to increase pressure (5 minutes)'],
ARRAY['Increase ball speed through quick combinations', 'Develop scanning and decision making at speed', 'Build movement habits after passing'],
'20x15 metre grid. 5-6 players (orange bibs) with 2 footballs (soccer balls). Arrows show quick combination passing patterns.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-passing-speed-possession-junior', 'U9', 'progressive', 15, 'Possession Game',
'Set up 25x20 metre grids. 4v4 possession: team with ball keeps it, other team presses. Score 1 point for 5 consecutive passes. Focus on speed of play — move the ball quickly to stretch the defence. Progress by adding end zones.',
ARRAY['Cones (12) for grids and end zones', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Scan early — know your options before the ball arrives', 'Play simple — quick, accurate passes', 'Move after pass — find a new angle immediately', 'Balance — maintain team shape', 'Support angles — give the ball carrier options', 'Patience — keep the ball, don''t rush'],
ARRAY['Set up grids, explain possession rules', 'Play 4v4 possession: 5 passes = 1 point (5 minutes)', 'Add end zones: score by passing into zone (5 minutes)', 'Final round: competition between groups (5 minutes)'],
ARRAY['Build decision making at speed in possession', 'Develop movement and support play', 'Maintain balance and team shape'],
'25x20 metre grid. 4v4 possession: orange vs blue. End zones shaded. Arrows show quick passing and movement.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-passing-speed-4goal-junior', 'U9', 'game', 20, '4-Goal Game',
'Set up a 30x25 metre pitch with 4 small goals — one on each side. 4v4 game. Teams can score in any goal. Encourages speed of play, switching, and movement. Play 2 x 8-minute halves. Focus on applying speed-of-play habits.',
ARRAY['Cones (16) for pitch and goals', 'Small goals (4)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Ball speed — keep passes firm and accurate', 'Movement — create passing options after every pass', 'Patience — find the open goal, don''t rush', 'Switch play — if one side is blocked, go the other way', 'Scan — look for which goal is undefended', 'Transition — defend all 4 goals when you lose it'],
ARRAY['Explain 4-goal game rules: score in any goal', 'Play first half (8 minutes) — observe speed of play', 'Half-time: ask "When did you play quickly?"', 'Play second half (8 minutes) — encourage speed of play', 'Cool down: discuss best quick passing moves'],
ARRAY['Apply speed-of-play habits in multi-directional game', 'Develop scanning and switching play', 'Build tempo and movement in possession'],
'30x25 metre pitch with 4 small goals. 4v4: orange vs blue. Football (soccer ball) in play. Arrows show quick passing and switching.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Passing (Speed of Play)', 'Players develop speed of play through quick combination passing and possession games. Progresses from paired passing through speed drills to a 4-goal game encouraging tempo and switching play.', 'U9', 'Passing/Receiving', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-passing-speed-passing2s-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-passing-speed-drill-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-passing-speed-possession-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-passing-speed-4goal-junior'),
60, ARRAY['Develop speed of play through quick passing', 'Build combination play habits', 'Improve scanning and decision making at speed', 'Apply speed-of-play habits in game situations'],
ARRAY['Play early', 'Move after pass', 'Scan before receiving', 'Ball speed'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 28 (Scrape): 1 v 1 Defending (Pressing)
-- No direct header match — standalone lesson
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-pressing-mastery-junior', 'U9', 'warmup', 15, 'Ball Mastery & Juggling',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills: toe taps, sole rolls, inside-outside, drag-backs. Progress to turns at speed with acceleration. Finish with sprint races. Keep intensity high — pressing demands fitness.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to change direction', 'Accelerate after turns — burst away with pace', 'Keep ball close to feet during mastery work', 'Quick feet — short sharp touches', 'High intensity — match the effort needed for pressing'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate ball mastery skills, players copy for 30 seconds each', 'Progress to turns at speed with acceleration', 'Add sprint races across the grid', 'Competition: fastest through cone slalom', 'Cool down with free juggling'],
ARRAY['Build high intensity for pressing demands', 'Develop close ball control and turning technique', 'Improve fitness and sprint effort'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball) performing ball mastery. Arrows show sprint patterns.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-pressing-skill-junior', 'U9', 'skill_intro', 15, 'Pressing 1 v 1',
'Set up 15x10 metre channels. 1v1: attacker receives a pass from the coach, defender presses immediately. Focus on sprint to close down, slowing down near the ball, and showing one way. Defender must read the pressing trigger (attacker''s head down, poor touch). Swap roles after each attempt.',
ARRAY['Cones (16) for 4 channels', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Sprint to close — get to the attacker quickly', 'Slow down near ball — don''t overrun', 'Show one way — force the attacker where you want them', 'Read pressing triggers — head down, poor touch, back to goal', 'Stay on your feet — don''t dive in', 'Body shape — side-on, low, balanced'],
ARRAY['Set up channels, pair up players, explain pressing rules', 'Demonstrate: sprint to close, slow down, show one way', 'Round 1: coach plays ball to attacker, defender presses (5 attempts each)', 'Pause and coach: highlight good pressing cues', 'Round 2: increase intensity, attacker can turn (5 attempts each)', 'Rotate pairs and play final round'],
ARRAY['Teach pressing technique and cues', 'Develop sprint effort and closing down', 'Build habit of showing one way after pressing'],
'15x10 metre channel. Attacker (orange bib) receiving ball from coach. Defender (blue bib) sprinting to press. Arrows show pressing run and body shape.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-pressing-endzones-junior', 'U9', 'progressive', 15, '1 v 1 with End Zones',
'Set up 20x15 metre grids with 3-metre end zones. 1v1: attacker scores by dribbling into the end zone. Defender must press and steer the attacker away. Focus on pressing triggers, steering after closing down, and timing the tackle. Play 2-minute rounds.',
ARRAY['Cones (16) for grids with end zones', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Force one way — steer the attacker after pressing', 'Wait for the mistake — don''t commit too early', 'Stay balanced — ready to change direction', 'Time the tackle — only go when the ball is loose', 'Press triggers — close down when attacker''s head is down', 'Transition — attack immediately when you win the ball'],
ARRAY['Set up grids with end zones, explain rules', 'Demonstrate: press, steer, time the tackle', 'Round 1: 2-minute 1v1s, observe pressing habits', 'Round 2: full pressure, coach highlights good pressing', 'Round 3: competition — who defends most successfully?', 'Discuss: when to press vs when to hold'],
ARRAY['Add directional pressure to pressing', 'Develop steering after closing down', 'Build transition habits when winning the ball'],
'20x15 metre grid with end zones. Attacker (orange bib) with football (soccer ball). Defender (blue bib) pressing. Arrows show pressing run and steering angle.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-pressing-game-junior', 'U9', 'game', 20, 'Pressing Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. Focus on pressing — closing down quickly and forcing turnovers. Play 2 x 8-minute halves. Minimal coaching — let the game create natural pressing situations.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Press triggers — close down when attacker''s head is down', 'Body shape — side-on when pressing', 'Sprint to close — get there quickly', 'Transition quickly when you win the ball', 'Support the presser — cover behind', 'Communicate — organise the press'],
ARRAY['Explain game rules and focus on pressing', 'Play first half (8 minutes) — observe pressing habits', 'Half-time: ask "When did you press well?"', 'Play second half (8 minutes) — encourage pressing habits', 'Cool down: players share one pressing moment'],
ARRAY['Apply pressing technique in a real game', 'Develop team pressing habits', 'Build communication and transition'],
'40x30 metre pitch with goals at each end. Two teams (orange vs blue bibs). Arrows show pressing runs and transition.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT '1 v 1 Defending (Pressing)', 'Players learn pressing technique — sprinting to close down, reading pressing triggers, and showing one way. Progresses from high-intensity ball mastery through structured pressing drills to a game with natural pressing situations.', 'U9', 'Pressing', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-pressing-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-pressing-skill-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-pressing-endzones-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-pressing-game-junior'),
65, ARRAY['Develop pressing technique and sprint effort', 'Build ability to read pressing triggers', 'Learn to steer attackers after closing down', 'Apply pressing habits in game situations'],
ARRAY['Sprint to close', 'Slow down near ball', 'Show one way', 'Press triggers'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 29 (Scrape): Shooting (Combination Play)
-- No direct header match — standalone lesson
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-shooting-combination-mastery-junior', 'U9', 'warmup', 10, 'Ball Mastery & Turns',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills: toe taps, sole rolls, inside-outside. Progress to turns at speed. Finish with dribbling races towards goal.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to move', 'Quick feet — short sharp touches', 'Accelerate out of turns', 'Use both feet for mastery work', 'Keep ball within playing distance'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate ball mastery skills, players copy (3 minutes)', 'Progress to turns at speed (3 minutes)', 'Add dribbling races towards goal (2 minutes)', 'Competition: fastest through slalom (2 minutes)'],
ARRAY['Build intensity and warm up technique', 'Develop close ball control at speed', 'Prepare players for combination shooting'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball). Arrows show dribbling patterns.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-shooting-combination-skill-junior', 'U9', 'skill_intro', 15, 'Combination Shooting',
'Set up shooting stations 20 metres from goal. Groups of 3: two passers and one finisher. Practice combination play to create shooting chances — one-twos, third-man runs, and wall passes. Finisher receives the final pass and shoots. Rotate roles. Progress to adding a defender.',
ARRAY['Cones (8) for stations', 'Goals (2)', 'Balls (6)', 'Bibs (2 colours)'],
ARRAY['Timing — release the pass at the right moment', 'Weight of pass — firm enough to maintain tempo', 'Shoot early — don''t take extra touches', 'One-twos — quick wall passes to create space', 'Third-man runs — movement off the ball to receive', 'Follow through — strike through the ball towards target'],
ARRAY['Set up shooting stations, explain combination rules', 'Demonstrate: one-two, third-man run, finish', 'Round 1: combination shooting, free touch (5 minutes)', 'Pause and coach: highlight good timing', 'Round 2: add 2-touch limit for combinations (5 minutes)', 'Round 3: add a defender (5 minutes)'],
ARRAY['Teach combination play to create shooting chances', 'Develop timing of passes and runs', 'Build finishing technique after combinations'],
'Shooting stations 20m from goal. Groups of 3 (orange bibs). Arrows show one-two combination and shooting. Goal with GK.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-shooting-combination-2v1-junior', 'U9', 'progressive', 15, '2 v 1 to Goal',
'Set up a 25x20 metre area with a goal. 2v1: two attackers combine to create a finishing chance against one defender. Focus on timing, movement off the ball, and shooting early. Progress to 2v2.',
ARRAY['Cones (8) for area', 'Goals (1)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Play early — release the pass before the defender closes', 'Movement off ball — make a run to create space', 'Shoot early — don''t take extra touches', 'Timing of run — arrive as the ball arrives', 'Combination play — wall passes, overlaps', 'Decision making — pass or shoot?'],
ARRAY['Set up area with goal, explain 2v1 rules', 'Demonstrate: timing of pass and movement', 'Round 1: 2v1 attacks, focus on combination play (5 minutes)', 'Round 2: add condition — must finish within 3 touches (5 minutes)', 'Round 3: progress to 2v2 (5 minutes)'],
ARRAY['Encourage combination play under pressure', 'Develop timing of passes and runs', 'Build decision making around when to pass vs shoot'],
'25x20 metre area with goal. 2 attackers (orange bibs) with football (soccer ball). 1 defender (blue bib). Arrows show combination and shooting.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-shooting-combination-game-junior', 'U9', 'game', 20, 'Combination Finishing Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. Special rule: goals scored after a combination (one-two or overlap) count double. Play 2 x 8-minute halves. Encourage combination play and finishing.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Hit corners — aim for placement and accuracy', 'Quick decisions — shoot when the chance is there', 'Combination play — use teammates to create chances', 'Timing — release the pass at the right moment', 'Transition — attack quickly when you win the ball', 'Movement — create passing options'],
ARRAY['Explain rules: goals after combinations count double', 'Play first half (8 minutes) — observe combination play', 'Half-time: ask "What combinations worked best?"', 'Play second half (8 minutes) — encourage combinations', 'Cool down: players share their best combination goal'],
ARRAY['Apply combination shooting in a real game', 'Develop team play and finishing', 'Build habit of combining before shooting'],
'40x30 metre pitch with goals at each end. Two teams (orange vs blue bibs). Arrows show combination play and shooting.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Shooting (Combination Play)', 'Players develop combination play to create shooting chances. Progresses from ball mastery through structured combination shooting and 2v1 play to a game rewarding team goals.', 'U9', 'Ball Striking', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-combination-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-combination-skill-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-combination-2v1-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-shooting-combination-game-junior'),
60, ARRAY['Develop combination play to create shooting chances', 'Build timing of passes and runs', 'Improve finishing after combinations', 'Apply combination shooting in game situations'],
ARRAY['Timing of pass', 'Weight of pass', 'Shoot early', 'Combination play'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 30 (Scrape): Rondo (Decision Making)
-- No direct header match — standalone lesson
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-decision-3v1-junior', 'U9', 'warmup', 15, 'Rondo (3v1)',
'Set up 8x8 metre squares. 3v1 rondo: 3 attackers keep possession, 1 defender presses. If defender wins ball, the passer who lost it swaps in. Focus on quick play, movement, and scanning. Progress from free touch to 2-touch then 1-touch.',
ARRAY['Cones (16) for 4 rondo squares', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Back foot touch — receive across your body', 'Body shape — open up to see all options', 'Ball speed — keep the ball moving quickly', 'Scan before receiving — know your next pass', 'Move after passing — adjust your angle', 'Play simple — don''t overcomplicate'],
ARRAY['Set up rondo squares, explain 3v1 rules', '3v1 rondo: free touch (5 minutes)', 'Progress to 2-touch (5 minutes)', 'Progress to 1-touch (3 minutes)', 'Competition: which group keeps possession longest?', 'Rotate defenders regularly'],
ARRAY['Teach possession habits in tight spaces', 'Build scanning and body shape awareness', 'Increase ball speed through touch limits'],
'8x8 metre rondo squares. 3 attackers (orange bibs) with football (soccer ball), 1 defender (blue bib) in middle. Arrows show passing lines.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-decision-4v2-junior', 'U9', 'skill_intro', 15, 'Rondo (4v2) – Decision Making',
'Set up 10x10 metre squares. 4v2 rondo with emphasis on decision making: when to play forward, when to keep possession, when to switch. 4 attackers keep possession against 2 defenders. Focus on reading the game and making the right choice under pressure.',
ARRAY['Cones (16) for 4 rondo squares', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Move early — adjust position before the ball arrives', 'Play simple — one or two touch, keep it moving', 'Scan before receiving — know where pressure is', 'Decision making — forward pass or keep possession?', 'Tempo — speed up when defenders are out of position', 'Communication — call for the ball'],
ARRAY['Set up 10x10m squares, explain 4v2 with decision focus', '4v2 rondo: free touch, focus on decisions (5 minutes)', 'Progress to 2-touch (5 minutes)', 'Add condition: bonus point for splitting defenders with a pass (3 minutes)', 'Competition: which group scores most points?', 'Rotate defenders every 2 minutes'],
ARRAY['Improve decision making under pressure', 'Develop ability to read the game in tight spaces', 'Build communication and movement habits'],
'10x10 metre rondo squares. 4 attackers (orange bibs), 2 defenders (blue bibs). Arrows show passing options and decision points.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-decision-possession-junior', 'U9', 'progressive', 15, 'Possession Game',
'Set up 25x20 metre grids. 4v4 possession with end zones. Focus on decision making — when to play forward into the end zone vs keep possession. Score by passing into the end zone. Encourage width, depth, and switching play.',
ARRAY['Cones (12) for grids and end zones', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Balance — maintain team shape and spacing', 'Patience — keep the ball until the right moment', 'Ball speed — move the ball quickly', 'Width and depth — spread out to create options', 'Switching play — if one side is blocked, go the other way', 'Decision making — forward or keep?'],
ARRAY['Set up grids with end zones, explain rules', 'Play 4v4 possession with end zones (5 minutes)', 'Add condition: must switch play before scoring (5 minutes)', 'Final round: competition between groups (5 minutes)'],
ARRAY['Build decision making in possession', 'Develop switching play and patience', 'Encourage reading the game'],
'25x20 metre grid with end zones. 4v4 possession: orange vs blue. Arrows show decision points — forward pass vs switching.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-rondo-decision-4goal-junior', 'U9', 'game', 20, '4-Goal Game',
'Set up a 30x25 metre pitch with 4 small goals — one on each side. 4v4 game. Teams can score in any goal. Encourages decision making — which goal to attack, when to switch, when to keep possession. Play 2 x 8-minute halves.',
ARRAY['Cones (16) for pitch and goals', 'Small goals (4)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Movement — find space and create options', 'Decision making — which goal is open?', 'Scan — look for undefended goals before receiving', 'Switch play — attack the open goal', 'Patience — keep possession until the right moment', 'Transition — defend all 4 goals when you lose it'],
ARRAY['Explain 4-goal game rules: score in any goal', 'Play first half (8 minutes) — observe decision making', 'Half-time: ask "How did you decide which goal to attack?"', 'Play second half (8 minutes) — encourage smart decisions', 'Cool down: discuss best decision-making moments'],
ARRAY['Apply decision making in multi-directional game', 'Develop scanning and game reading', 'Build patience and smart play'],
'30x25 metre pitch with 4 small goals. 4v4: orange vs blue. Football (soccer ball) in play. Arrows show decision points between goals.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Rondo (Decision Making)', 'Players develop decision making through rondo progressions focusing on when to play forward vs keep possession. Finishes with a 4-goal game encouraging smart play and game reading.', 'U9', 'Passing/Receiving', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-decision-3v1-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-decision-4v2-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-decision-possession-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-rondo-decision-4goal-junior'),
65, ARRAY['Develop decision making through rondo play', 'Build ability to read the game under pressure', 'Improve scanning and game awareness', 'Apply decision making in game situations'],
ARRAY['Decision making', 'Scan before receiving', 'Play simple', 'Switching play'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 31 (Scrape): 1 v 1 Finishing
-- No direct header match — standalone lesson
-- NOTE: Bailey has unique session structure — Session 2 is Passing Interference,
-- Session 3 is 1v1 vs GK, Session 4 is 3 Team Game + Murder Ball
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-finishing-mastery-junior', 'U9', 'warmup', 10, 'Ball Mastery',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills: toe taps, sole rolls, inside-outside. Progress to turns at speed with fakes. Finish with dribbling races towards goal.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to move', 'Acceleration with turns and fakes — burst away', 'Keep ball close to feet', 'Quick feet — short sharp touches', 'Use both feet for mastery work'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate ball mastery skills, players copy (3 minutes)', 'Progress to turns with fakes (3 minutes)', 'Add dribbling races towards goal (2 minutes)', 'Competition: fastest through slalom (2 minutes)'],
ARRAY['Build intensity and warm up technique', 'Develop close ball control with fakes', 'Prepare players for finishing practice'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball). Arrows show dribbling with fakes towards goal.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-finishing-passing-junior', 'U9', 'skill_intro', 10, 'Passing Interference',
'Set up 15x15 metre grids. Groups of 4: 3 passers and 1 interferer. Passers try to complete passes while the interferer disrupts passing lanes. Focus on strong passes, back foot touch, and movement after passing. Progress to 2 interferers. Build intensity before finishing drills.',
ARRAY['Cones (12) for 3 grids', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Strong pass — firm inside foot, no spin', 'Back foot touch — receive across your body', 'Movement — create passing angles after every pass', 'Scan before receiving — know where the interferer is', 'Play simple — quick, accurate passes', 'Accelerate after receiving — don''t dwell on the ball'],
ARRAY['Set up grids, explain interference rules', 'Round 1: 3 passers vs 1 interferer, free touch (3 minutes)', 'Pause and coach: highlight good passing technique', 'Round 2: add 2-touch limit (3 minutes)', 'Round 3: add second interferer (4 minutes)'],
ARRAY['Build passing intensity before finishing drills', 'Develop strong passing technique under pressure', 'Improve scanning and movement habits'],
'15x15 metre grid. 3 passers (orange bibs) with football (soccer ball), 1 interferer (blue bib). Arrows show passing lines.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-finishing-vsGK-junior', 'U9', 'progressive', 10, '1 v 1 vs GK',
'Set up a 20x15 metre area with a goal and GK. Players start 20 metres from goal with the ball. 1v1 vs GK: player dribbles towards goal and must finish. Focus on recognising GK position, creating an angle, and shooting early. Progress to adding a defender chasing from behind.',
ARRAY['Cones (8) for area', 'Goals (1)', 'Balls (6)', 'Bibs (2 colours)'],
ARRAY['Shoot early — take the chance when it appears', 'Attack space — drive towards goal with pace', 'Create angle — move the ball to find a shooting line', 'Recognise GK position — shoot to the open side', 'Change angle if needed — adjust your approach', 'Composure — stay calm in front of goal'],
ARRAY['Set up area with goal and GK, explain rules', 'Demonstrate: approach GK, read position, finish', 'Round 1: 1v1 vs GK, no defender (3 minutes)', 'Round 2: add defender chasing from behind (3 minutes)', 'Round 3: add dribbling and shooting techniques (4 minutes)'],
ARRAY['Teach finishing under pressure against GK', 'Develop ability to read GK position', 'Build composure in 1v1 finishing situations'],
'20x15 metre area with goal and GK. Player (orange bib) with football (soccer ball) approaching goal. Arrows show approach angle and shooting options. Defender (blue bib) chasing from behind.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-finishing-3team-junior', 'U9', 'game', 20, '3 Team Game + Murder Ball',
'Set up a 40x30 metre pitch with goals at each end. Three teams of 4: two teams play, one team rests. Losing team rotates off, resting team comes on. Quick transitions and high intensity. Add "Murder Ball" rounds — all three teams on the pitch, score in any goal. Encourages dribbling quality and finishing.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (3)', 'Bibs (3 colours)'],
ARRAY['Dribbling quality — close control in tight spaces', 'Recognise GK position — shoot to the open side', 'Finishing technique — placement and composure', 'Quick transitions — attack immediately when you win the ball', 'Creativity — try different finishing techniques', 'High intensity — every game matters'],
ARRAY['Explain 3-team rotation rules', 'Play first rotation: 2 teams play, 1 rests (5 minutes)', 'Rotate teams (5 minutes)', 'Murder Ball round: all 3 teams on pitch (5 minutes)', 'Final rotation: championship round (5 minutes)'],
ARRAY['Apply finishing habits in competitive game format', 'Develop dribbling quality and composure', 'Build high-intensity game habits'],
'40x30 metre pitch with goals at each end. Three teams (orange, blue, yellow bibs). Two teams playing, one resting. Arrows show transitions and finishing.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT '1 v 1 Finishing', 'Players develop 1v1 finishing against the goalkeeper. Progresses from ball mastery through passing interference and 1v1 vs GK to a competitive 3-team game format with Murder Ball.', 'U9', '1v1', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-finishing-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-finishing-passing-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-finishing-vsGK-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-finishing-3team-junior'),
50, ARRAY['Develop 1v1 finishing technique against GK', 'Build composure and decision making in front of goal', 'Improve dribbling quality approaching goal', 'Apply finishing habits in competitive game format'],
ARRAY['Recognise GK position', 'Create angle', 'Shoot early', 'Composure'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 32 (Scrape): Pass & Control (Lofted)
-- No direct header match — standalone lesson
-- NOTE: Bailey has unique durations — Session 1 is 5 min, Session 3 is 20 min, Session 4 is 15 min
-- Plus 15 min Transfer Rondo noted
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-pass-control-lofted-passing2s-junior', 'U9', 'warmup', 5, 'Passing in 2s',
'Players pair up in a 20x20 metre grid, one ball per pair, 15 metres apart. Practice both low driven passes and lofted passes. Focus on technique first — clean contact, ball speed. Build rhythm between low and lofted passes.',
ARRAY['Cones (8) for grid', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Technique first — focus on clean contact', 'Ball speed — firm passes, no floating', 'Clean contact — strike through the ball', 'Low driven: inside foot, through the middle', 'Lofted: get under the ball, lean back slightly', 'Alternate between low and lofted passes'],
ARRAY['Set up 20x20m grid, pair up players 15 metres apart', 'Demonstrate low driven pass technique', 'Demonstrate lofted pass technique', 'Alternate: 5 low, 5 lofted (3 minutes)', 'Competition: most accurate passes (2 minutes)'],
ARRAY['Teach both low driven and lofted pass technique', 'Build rhythm alternating between pass types', 'Develop clean contact and ball speed'],
'20x20 metre grid. Pairs (orange bibs) 15 metres apart passing football (soccer ball). Arrows show low driven and lofted pass trajectories.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-pass-control-lofted-drill-junior', 'U9', 'skill_intro', 15, 'Lofted Passing Drill',
'Set up passing stations in a 25x20 metre area. Groups of 4. Practice lofted passes over a central zone (simulating midfield). Receiver controls with first touch and plays back. Focus on body shape, weight of pass, and first touch direction. Progress to adding movement after passing.',
ARRAY['Cones (12) for stations and central zone', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Body shape — lean back slightly for loft', 'Weight of pass — enough height to clear the zone', 'First touch direction — control towards your next action', 'Get under the ball — strike low on the ball', 'Follow through — leg continues upward', 'Soft first touch — cushion the ball on landing'],
ARRAY['Set up stations with central zone, explain rules', 'Demonstrate lofted pass: body shape, contact point, follow through', 'Round 1: static lofted passes over zone (5 minutes)', 'Round 2: add first touch direction — control and turn (5 minutes)', 'Round 3: add movement after passing (5 minutes)'],
ARRAY['Teach lofted pass mechanics', 'Develop first touch control from lofted passes', 'Build confidence with long-range passing'],
'25x20 metre area with central zone marked. Groups of 4 (orange bibs). Arrows show lofted pass trajectory over central zone. Receiver controlling ball.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-pass-control-lofted-possession-junior', 'U9', 'progressive', 20, 'Possession',
'Set up 30x25 metre grids. 5v5 possession game. Focus on balance, back foot control, and ball speed. Score 1 point for 5 consecutive passes, bonus point for a successful lofted switch of play. Encourage patience to switch and decision making.',
ARRAY['Cones (12) for grids', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Positioning — find space and maintain team shape', 'Decision making — when to play short vs lofted', 'Patience to switch — don''t force it through the middle', 'Back foot control — receive across your body', 'Ball speed — keep passes firm', 'Balance — maintain width and depth'],
ARRAY['Set up grids, explain possession rules and bonus points', 'Play 5v5 possession: 5 passes = 1 point (7 minutes)', 'Add bonus: lofted switch = extra point (7 minutes)', 'Final round: competition between groups (6 minutes)'],
ARRAY['Build possession habits with lofted passing option', 'Develop decision making around pass selection', 'Encourage patience and switching play'],
'30x25 metre grid. 5v5 possession: orange vs blue. Arrows show short passing and lofted switches of play.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-pass-control-lofted-game-junior', 'U9', 'game', 15, 'Passing Game',
'Set up a 35x25 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. 2-3 touch maximum. Use a floater (neutral player) if possible to create overloads. Focus on quick play, movement, and passing quality. Play 2 x 6-minute halves.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (3 colours for teams and floater)'],
ARRAY['Quick play — 2-3 touch maximum', 'Movement — create passing options constantly', 'Passing quality — firm, accurate passes', 'Use the floater — create overloads', 'Switch play — use lofted passes to change the point of attack', 'Transition — defend quickly when you lose it'],
ARRAY['Explain rules: 2-3 touch max, floater plays for team in possession', 'Play first half (6 minutes) — observe passing quality', 'Half-time: ask "When did you use a lofted pass?"', 'Play second half (6 minutes) — encourage switching play', 'Cool down: discuss best passing moments'],
ARRAY['Apply passing habits including lofted passes in game', 'Develop quick play and movement', 'Build passing quality under pressure'],
'35x25 metre pitch with goals. Two teams (orange vs blue) plus floater (yellow). Arrows show passing and lofted switches.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Pass & Control (Lofted)', 'Players develop both low driven and lofted passing technique. Progresses from paired passing through lofted pass drills and possession games to a game encouraging switching play with lofted passes.', 'U9', 'Passing/Receiving', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-pass-control-lofted-passing2s-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-pass-control-lofted-drill-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-pass-control-lofted-possession-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-pass-control-lofted-game-junior'),
55, ARRAY['Develop lofted passing technique', 'Build first touch control from lofted passes', 'Improve decision making around pass selection', 'Apply lofted passing in game situations'],
ARRAY['Technique first', 'Weight of pass', 'First touch direction', 'Patience to switch'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 33 (Scrape): Pass & Control – Building Up
-- No direct header match — standalone lesson
-- NOTE: Bailey has unique session structure — Session 1 is Passing Interference (5-10 min),
-- Session 2 is Juggling (5-10 min), Session 3 is Directional Rondo (15 min),
-- Session 4 is 4 Goal Game (20 min). Plus 15 min Games noted.
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-building-up-interference-junior', 'U9', 'warmup', 10, 'Passing Interference',
'Set up 15x15 metre grids. Groups of 4: 3 passers and 1 interferer. Passers try to complete passes while the interferer disrupts. Focus on receiving under pressure — back foot receiving and turning away from pressure. Progress to 2 interferers. Accelerate after turning.',
ARRAY['Cones (12) for 3 grids', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Body shape — open up to see options when receiving', 'Strong pass — firm inside foot', 'Accelerate after turn — burst away from pressure', 'Back foot receiving — control across your body', 'Scan before receiving — know where pressure is', 'Play forward when possible — don''t always go backwards'],
ARRAY['Set up grids, explain interference rules', 'Round 1: 3 passers vs 1 interferer, free touch (3 minutes)', 'Pause and coach: highlight good receiving under pressure', 'Round 2: add 2-touch limit (3 minutes)', 'Round 3: add second interferer (4 minutes)'],
ARRAY['Improve receiving under pressure', 'Develop back foot receiving and turning', 'Build confidence playing forward'],
'15x15 metre grid. 3 passers (orange bibs) with football (soccer ball), 1 interferer (blue bib). Arrows show receiving and turning under pressure.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-building-up-juggling-junior', 'U9', 'skill_intro', 10, 'Juggling',
'Players spread out in a 20x20 metre grid, one ball each. Juggling practice: feet, thighs, headers. Focus on rhythm and soft touch. Progress through challenges: 10 juggles feet only, 5 thigh juggles, 3 headers. Competition: longest juggling streak.',
ARRAY['Cones (8) for grid', 'Balls (1 per player)'],
ARRAY['Rhythm — find a consistent tempo', 'Soft touch — cushion the ball on each contact', 'Use all surfaces — feet, thighs, headers', 'Stay balanced — light on your toes', 'Eyes on the ball — watch it onto your foot', 'Challenge yourself — try new combinations'],
ARRAY['Distribute balls, explain juggling challenges', 'Feet only: aim for 10 consecutive (3 minutes)', 'Add thighs: alternate feet and thighs (3 minutes)', 'Add headers: feet, thighs, headers combination (2 minutes)', 'Competition: longest juggling streak (2 minutes)'],
ARRAY['Improve ball control through juggling', 'Develop soft touch and rhythm', 'Build confidence with different body surfaces'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball) juggling. Various body surfaces shown: feet, thighs, headers.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-building-up-rondo-junior', 'U9', 'progressive', 15, 'Directional Rondo',
'Set up 15x10 metre rectangles. 4v2 directional rondo: attackers must play forward when possible — score by passing to a target player at the far end. If defenders win ball, attackers swap. Focus on playing forward, back foot control, and passing quality. Patience to switch when forward pass isn''t on.',
ARRAY['Cones (16) for 4 rondo rectangles', 'Balls (4)', 'Bibs (3 colours for attackers, defenders, targets)'],
ARRAY['Back foot control — receive across your body to play forward', 'Passing quality — firm, accurate passes', 'Patience — don''t force the forward pass', 'Play forward when possible — look for the target first', 'Movement — create passing angles', 'Switch play — go the other way if blocked'],
ARRAY['Set up directional rondos, explain rules and target player', 'Round 1: 4v2 directional, free touch (5 minutes)', 'Pause and coach: highlight good forward passing', 'Round 2: add 2-touch limit (5 minutes)', 'Round 3: competition — most passes to target (5 minutes)'],
ARRAY['Teach building up principles — play forward when possible', 'Develop back foot control for forward play', 'Build patience to switch when forward isn''t on'],
'15x10 metre rectangle. 4 attackers (orange bibs), 2 defenders (blue bibs), target player (yellow bib) at far end. Arrows show forward passing to target.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-building-up-4goal-junior', 'U9', 'game', 20, '4-Goal Game',
'Set up a 35x25 metre pitch with 4 small goals — one on each side. 4v4 game. Teams play in a shape (2-3-1 or 2-3 or 1-3). Special rule: must complete 3 passes in own half before progressing. Encourages building up from the back, switching play, and calm possession.',
ARRAY['Cones (16) for pitch and goals', 'Small goals (4)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Shape — maintain team formation (2-3-1 or similar)', 'Ball speed — keep passes firm and accurate', 'Calm in possession — don''t panic under pressure', 'Build from the back — 3 passes in own half first', 'Switching play — use width to find the open goal', 'Patience — keep the ball until the right moment'],
ARRAY['Explain rules: 3 passes in own half before progressing, score in any goal', 'Play first half (8 minutes) — observe building up habits', 'Half-time: ask "How did you build up from the back?"', 'Play second half (8 minutes) — encourage shape and switching', 'Cool down: discuss best build-up sequences'],
ARRAY['Apply build-up habits in multi-directional game', 'Develop team shape and calm possession', 'Build switching play from the back'],
'35x25 metre pitch with 4 small goals. 4v4: orange vs blue in team shapes. Arrows show building up from back and switching play.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Pass & Control – Building Up', 'Players develop building up from the back through receiving under pressure, directional rondos, and shaped possession games. Finishes with a 4-goal game requiring 3 passes in own half before progressing.', 'U9', 'Passing/Receiving', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-building-up-interference-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-building-up-juggling-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-building-up-rondo-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-building-up-4goal-junior'),
55, ARRAY['Develop receiving under pressure for building up', 'Build directional passing habits — play forward', 'Improve team shape and calm possession', 'Apply build-up habits in game situations'],
ARRAY['Back foot control', 'Play forward when possible', 'Patience to switch', 'Team shape'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 34 (Scrape): 1 v 1 Attacking (U9 & U10)
-- Header Slide 34: U9 & U10 | 1 v 1 – Attacking | 11.8.25
-- NOTE: age_group = U9 (U9/U10 programme)
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-u9u10-mastery-junior', 'U9', 'warmup', 20, 'Ball Mastery & Juggling',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills with emphasis on turns, fakes, and dribbling: step-overs, body feints, Cruyff turns, drag-backs. After each skill (30 seconds), players juggle for 20 seconds. Progress to dribbling at speed with acceleration after fakes. Finish with 1v1 races.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to explode', 'Acceleration — burst away after every turn and fake', 'Keep ball close during mastery work', 'Use both feet for turns and fakes', 'Commit to the move — make it convincing'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate turns and fakes: step-over, Cruyff, drag-back (5 minutes)', 'Players copy each skill with juggling between (5 minutes)', 'Progress to dribbling at speed with fakes (5 minutes)', 'Add 1v1 races with fakes (3 minutes)', 'Cool down with free juggling (2 minutes)'],
ARRAY['Build intensity with emphasis on 1v1 skills', 'Develop turns, fakes, and dribbling technique', 'Improve acceleration out of skill moves'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball) performing turns and fakes. Arrows show dribbling with acceleration.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-u9u10-line-junior', 'U9', 'skill_intro', 15, '1 v 1 Line Football',
'Set up 15x10 metre channels with a line at each end. 1v1: attacker tries to dribble past the defender and stop the ball on the end line. Focus on making fakes believable, little touches to keep the ball close, and a winning mentality. Swap roles after each attempt.',
ARRAY['Cones (16) for 4 channels', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Make fake believable — sell the move with your body', 'Little touches — keep the ball close to your feet', 'Winning mentality — be brave and take players on', 'Acceleration after the fake — burst past', 'Use both feet — be unpredictable', 'Commit to the move — don''t hesitate'],
ARRAY['Set up channels, pair up players, explain line football rules', 'Demonstrate: believable fake, little touches, acceleration', 'Round 1: 1v1 line football, light pressure (5 attempts each)', 'Pause and coach: highlight good fakes', 'Round 2: full pressure (5 attempts each)', 'Competition: who scores most line stops?'],
ARRAY['Teach attacking mindset in 1v1 situations', 'Develop believable fakes and close control', 'Build winning mentality and bravery'],
'15x10 metre channels with end lines. Attacker (orange bib) with football (soccer ball) facing defender (blue bib). Arrows show fake and acceleration to end line.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-u9u10-goals-junior', 'U9', 'progressive', 15, '1 v 1 with Goals',
'Set up 20x15 metre areas with small goals at each end. 1v1: attacker must beat the defender and score. Focus on fake shots, composure in front of goal, and looking up before shooting. Progress to adding a GK. Sprint effort to recover if beaten.',
ARRAY['Cones (12) for areas', 'Small goals (4)', 'Balls (1 per pair)', 'Bibs (2 colours)'],
ARRAY['Look up before shooting — check GK position', 'Acceleration — burst past the defender', 'Sprint effort — recover if beaten', 'Fake shots — sell the shot then go past', 'Composure — stay calm in front of goal', 'Be decisive — commit to shoot or dribble'],
ARRAY['Set up areas with goals, explain rules', 'Demonstrate: fake shot, beat defender, finish', 'Round 1: 1v1 with goals, focus on composure (5 minutes)', 'Round 2: add GK for more pressure (5 minutes)', 'Round 3: competition — who scores most? (5 minutes)'],
ARRAY['Add finishing decisions to 1v1 attacking', 'Develop fake shots and composure', 'Build sprint effort and recovery'],
'20x15 metre area with small goals at each end. Attacker (orange bib) with football (soccer ball) facing defender (blue bib). Arrows show fake shot and finishing.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-attacking-u9u10-tournament-junior', 'U9', 'game', 20, 'Tournament Games',
'Set up multiple small pitches (15x10 metres) with mini goals. Tournament format: 1v1 games, 2-minute rounds, winner stays on. Rotate opponents. Focus on creativity, speed, and decision making. Finish with a championship round. High intensity, competitive environment.',
ARRAY['Cones (24) for multiple pitches', 'Mini goals (8)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Creativity — try different moves to beat defenders', 'Speed — play at match pace', 'Decision making — when to dribble, when to shoot', 'Winning mentality — compete in every game', 'Transition — defend immediately when you lose the ball', 'Composure — stay calm under pressure'],
ARRAY['Set up tournament pitches, explain format', 'Round 1: 1v1 games, 2-minute rounds (6 minutes)', 'Rotate opponents (6 minutes)', 'Championship round: winners play winners (4 minutes)', 'Final: best of 3 (4 minutes)'],
ARRAY['Apply 1v1 attacking in competitive tournament', 'Develop creativity and speed under pressure', 'Build winning mentality and composure'],
'Multiple 15x10 metre pitches with mini goals. 1v1 tournament: orange vs blue. Arrows show attacking moves and finishing.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT '1 v 1 Attacking (U9 & U10)', 'Players develop 1v1 attacking skills with emphasis on believable fakes, close control, and finishing. Progresses from ball mastery through line football and 1v1 with goals to a competitive tournament format.', 'U9', '1v1', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-u9u10-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-u9u10-line-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-u9u10-goals-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-attacking-u9u10-tournament-junior'),
70, ARRAY['Develop believable fakes and close control', 'Build attacking mindset and winning mentality', 'Improve finishing decisions after beating defenders', 'Apply 1v1 attacking in competitive game format'],
ARRAY['Make fake believable', 'Little touches', 'Winning mentality', 'Acceleration'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 35 (Scrape): Ways to Break the Line
-- Header Slide 35: Junior Academy | Ways to Break the Line | 13.8.25
-- NOTE: Slide 36 is duplicate — skipped
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-break-line-1-2-passing-junior', 'U9', 'warmup', 15, '1-2 Passing',
'Set up a 20x20 metre grid. Groups of 3. Practice 1-2 (wall pass) combinations: player A passes to player B, player B returns first time, player A accelerates onto the return pass. Focus on timing, back foot control, and acceleration after the return pass. Rotate roles.',
ARRAY['Cones (8) for grid', 'Balls (1 per group)', 'Bibs (2 colours)'],
ARRAY['Strong pass — firm inside foot to start the combination', 'Movement timing — start your run as you pass', 'Accelerate after return pass — burst into space', 'Back foot control — receive across your body', 'Weight of return pass — firm enough to play first time', 'Communication — call for the ball'],
ARRAY['Set up grid, groups of 3, explain 1-2 combination', 'Demonstrate: pass, run, receive return (5 minutes)', 'Practice 1-2 combinations, rotate roles (5 minutes)', 'Add movement: 1-2 then dribble to far cone (3 minutes)', 'Competition: fastest 1-2 combination (2 minutes)'],
ARRAY['Teach 1-2 combination play technique', 'Develop timing of runs and passes', 'Build acceleration after return pass'],
'20x20 metre grid. Groups of 3 (orange bibs). Arrows show 1-2 wall pass combination with acceleration.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-break-line-football-junior', 'U9', 'skill_intro', 15, 'Line Football',
'Set up 20x15 metre grids with a line of cones across the middle (the "line"). 3v3: team with ball must break through the line by passing or dribbling through it. Focus on positioning, passing quality, and speed when breaking the line. Defenders try to block the line.',
ARRAY['Cones (16) for grids and line', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Balance — maintain team shape around the line', 'Patience — wait for the right moment to break through', 'Speed when breaking line — accelerate through the gap', 'Positioning — find space either side of the line', 'Passing quality — firm, accurate passes through the line', 'Movement — create passing angles to break through'],
ARRAY['Set up grids with line, explain rules', 'Demonstrate: positioning, patience, breaking through', 'Round 1: 3v3 line football, free touch (5 minutes)', 'Pause and coach: highlight good line-breaking moments', 'Round 2: add 2-touch limit (5 minutes)', 'Competition: most line breaks (5 minutes)'],
ARRAY['Teach line-breaking principles', 'Develop positioning and patience', 'Build speed when breaking through'],
'20x15 metre grid with line of cones across middle. 3v3: orange vs blue. Arrows show passing and dribbling through the line.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-break-line-transition-junior', 'U9', 'progressive', 15, '2 v 2 / 3 v 3 Transition',
'Set up 25x20 metre grids with goals at each end. 2v2 or 3v3 transition game: when a team scores or loses the ball, new attackers enter from the side. Focus on reaction speed, aggression in transition, and unlocking defenders with quick combinations. Progress to 3v3.',
ARRAY['Cones (12) for grids', 'Goals (2)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Speed — react quickly in transition', 'Unlocking defenders — use combinations to break through', 'Decision making — pass, dribble, or shoot?', 'Aggression — attack with intent', 'Quick transitions — don''t waste time', 'Support the ball carrier — give options'],
ARRAY['Set up grids with goals, explain transition rules', 'Round 1: 2v2 transition, focus on speed (5 minutes)', 'Round 2: 3v3 transition, add combinations (5 minutes)', 'Round 3: competition — most goals in transition (5 minutes)'],
ARRAY['Teach transition habits and reaction speed', 'Develop ability to unlock defenders quickly', 'Build aggression and decision making in transition'],
'25x20 metre grid with goals. 2v2 or 3v3 transition: orange vs blue. New players entering from side. Arrows show transition attacks.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-break-line-overload-junior', 'U9', 'game', 20, 'Overload Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 4v4 or 5v5. Special rule: when a team wins the ball, 2 extra players join from the side to create a 6v4 overload for 10 seconds. Encourages quick transitions and breaking lines with the overload. Play 2 x 8-minute halves.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Movement — exploit the overload quickly', 'Passing quality — firm, accurate passes to break lines', 'Quick transitions — attack before the overload expires', 'Decision making — use the extra players wisely', 'Speed — play at match pace', 'Combination play — 1-2s and overlaps to break through'],
ARRAY['Explain overload rules: 2 extra players for 10 seconds after winning ball', 'Play first half (8 minutes) — observe line-breaking in overloads', 'Half-time: ask "How did you use the extra players?"', 'Play second half (8 minutes) — encourage quick transitions', 'Cool down: discuss best line-breaking moments'],
ARRAY['Apply line-breaking habits with overloads', 'Develop quick transition play', 'Build decision making in overload situations'],
'40x30 metre pitch with goals. Two teams (orange vs blue). Extra players entering from sides. Arrows show overload attacks and line-breaking.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Ways to Break the Line', 'Players learn different ways to break through defensive lines using 1-2 combinations, positioning, and quick transitions. Finishes with an overload game encouraging fast line-breaking play.', 'U9', 'Passing/Receiving', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-break-line-1-2-passing-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-break-line-football-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-break-line-transition-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-break-line-overload-junior'),
65, ARRAY['Develop 1-2 combination play to break lines', 'Build positioning and patience around defensive lines', 'Improve transition speed and aggression', 'Apply line-breaking habits in overload game'],
ARRAY['Strong pass', 'Movement timing', 'Speed when breaking line', 'Quick transitions'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 37 (Scrape): Crossing & Finishing
-- Header Slide 37: Junior Academy | Pass & Control – Crossing & Finishing | 20.8.25
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-crossing-finishing-mastery-junior', 'U9', 'warmup', 20, 'Ball Mastery & 1v1 Skills',
'Set up a 25x25 metre grid. Each player has a ball. Players perform ball mastery skills with emphasis on 1v1 skills: step-overs, body feints, turns, juggling. Progress to dribbling at speed down the wings. Finish with 1v1 races to the end line. Higher duration to prepare for crossing demands.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to explode', 'Acceleration — burst away after every turn and fake', 'Keep ball close during mastery work', 'Use both feet for turns and fakes', 'Get to the end line — practice wide dribbling'],
ARRAY['Set up 25x25m grid, distribute balls — 1 per player', 'Demonstrate 1v1 skills: step-over, body feint, turn (5 minutes)', 'Players copy each skill with juggling between (5 minutes)', 'Progress to dribbling at speed down the wings (5 minutes)', 'Add 1v1 races to end line (3 minutes)', 'Cool down with free juggling (2 minutes)'],
ARRAY['Build intensity with emphasis on wide play skills', 'Develop 1v1 skills for getting to the end line', 'Prepare players for crossing and finishing'],
'25x25 metre grid. Players (orange bibs) each with a football (soccer ball) performing 1v1 skills. Arrows show wide dribbling to end line.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-crossing-finishing-isolated-junior', 'U9', 'skill_intro', 10, 'Isolated Crossing & Finishing',
'Set up crossing stations on both sides of a 30x20 metre area with a goal. Crosser delivers from wide, finisher attacks the cross. Practice different crossing types: low driven, lofted, cut-back. Finisher practices one-touch finishing. Rotate roles.',
ARRAY['Cones (8) for area and crossing zones', 'Goals (1)', 'Balls (6)', 'Bibs (2 colours)'],
ARRAY['Movement variety — different runs to attack the cross', 'Weight of cross — match the type to the situation', 'One-touch finish — don''t take extra touches', 'Timing of run — arrive as the ball arrives', 'Crossing types — low driven, lofted, cut-back', 'Attack the ball — be aggressive at the cross'],
ARRAY['Set up crossing stations, explain rotation', 'Demonstrate crossing types: low driven, lofted, cut-back', 'Round 1: low driven crosses, one-touch finish (3 minutes)', 'Round 2: lofted crosses (3 minutes)', 'Round 3: cut-backs (4 minutes)'],
ARRAY['Teach crossing mechanics and types', 'Develop one-touch finishing from crosses', 'Build timing of runs to attack crosses'],
'30x20 metre area with goal. Crosser (orange bib) on wing delivering cross. Finisher (orange bib) attacking cross. Arrows show different crossing types and finishing.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-crossing-finishing-defender-junior', 'U9', 'progressive', 15, 'Crossing & Finishing with Defender',
'Set up a 30x20 metre area with a goal. Add a defender marking the finisher. Crosser must decide: cross early, take on the defender, or cut back. Finisher must lose the marker to attack the cross. Focus on decision making, drawing the defender, and finishing technique.',
ARRAY['Cones (8) for area', 'Goals (1)', 'Balls (6)', 'Bibs (2 colours)'],
ARRAY['Draw defender — take them out of position before crossing', 'Crosser''s decision making — cross, dribble, or cut back?', 'Finishing technique — one-touch, placement, or power', 'Timing of run — lose the marker at the right moment', 'Communication — crosser and finisher must connect', 'Attack the ball — be first to the cross'],
ARRAY['Set up area with goal and defender, explain rules', 'Demonstrate: crosser decision making with defender', 'Round 1: crossing with defender, focus on decisions (5 minutes)', 'Round 2: add second finisher for more options (5 minutes)', 'Round 3: competition — most goals from crosses (5 minutes)'],
ARRAY['Add pressure to crossing and finishing', 'Develop crosser decision making', 'Build finishing technique under defensive pressure'],
'30x20 metre area with goal. Crosser (orange bib) on wing. Finisher (orange bib) vs defender (blue bib). Arrows show crossing options and finishing.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-crossing-finishing-2v2-floaters-junior', 'U9', 'game', 20, '2 v 2 with Wide Floaters',
'Set up a 30x25 metre pitch with goals at each end. 2v2 in the middle with 2 wide floaters (neutral players) on each side. Floaters play for the team in possession and deliver crosses. Focus on wide play, movement to attack crosses, and transition. Play 2 x 8-minute halves.',
ARRAY['Cones (12) for pitch and wide zones', 'Goals (2)', 'Balls (2)', 'Bibs (3 colours for teams and floaters)'],
ARRAY['Movement — make runs to attack crosses', 'Passing quality — use the wide floaters', 'Finishing — one-touch from crosses', 'Transition — defend quickly when you lose the ball', 'Wide play — use the floaters to stretch the defence', 'Communication — call for the cross'],
ARRAY['Explain rules: 2v2 with wide floaters, floaters deliver crosses', 'Play first half (8 minutes) — observe crossing and finishing', 'Half-time: ask "How did you use the wide players?"', 'Play second half (8 minutes) — encourage wide play', 'Cool down: discuss best crossing moments'],
ARRAY['Apply crossing and finishing in game with wide floaters', 'Develop wide play and movement', 'Build finishing from crosses under pressure'],
'30x25 metre pitch with goals. 2v2 (orange vs blue) in middle. Wide floaters (yellow bibs) on each side. Arrows show crosses and finishing.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Crossing & Finishing', 'Players develop crossing and finishing technique. Progresses from ball mastery through isolated crossing practice and crossing with defenders to a 2v2 game with wide floaters.', 'U9', 'Passing/Receiving', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-crossing-finishing-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-crossing-finishing-isolated-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-crossing-finishing-defender-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-crossing-finishing-2v2-floaters-junior'),
65, ARRAY['Develop crossing mechanics and types', 'Build one-touch finishing from crosses', 'Improve decision making for crosser and finisher', 'Apply crossing and finishing in game with wide play'],
ARRAY['Weight of cross', 'One-touch finish', 'Movement timing', 'Draw defender'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 38 (Scrape): 1 v 1 Defending
-- Header Slide 38: Junior Academy | 1 v 1 – Defending | 25.8.25
-- NOTE: Bailey has unique structure — Session 2 is 1v1s (20 min), Session 3 is 2v1/3v2 (15 min)
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-expanded-mastery-junior', 'U9', 'warmup', 15, 'Ball Mastery & Juggling',
'Set up a 20x20 metre grid. Each player has a ball. Players perform ball mastery skills: toe taps, sole rolls, inside-outside, drag-backs. Progress to turns at speed with acceleration. Finish with sprint races. Keep intensity high.',
ARRAY['Cones (8) for grid boundary', 'Balls (1 per player)', 'Bibs (2 colours)'],
ARRAY['Eyes up — scan the area while dribbling', 'On toes — stay light and ready to change direction', 'Acceleration — burst away after every turn', 'Keep ball close to feet', 'Quick feet — short sharp touches', 'High intensity — match the effort needed for defending'],
ARRAY['Set up 20x20m grid, distribute balls — 1 per player', 'Demonstrate ball mastery skills, players copy (5 minutes)', 'Progress to turns at speed with acceleration (5 minutes)', 'Add sprint races (3 minutes)', 'Cool down with free juggling (2 minutes)'],
ARRAY['Build high intensity for defending demands', 'Develop close ball control and turning technique', 'Improve fitness and sprint effort'],
'20x20 metre grid. Players (orange bibs) each with a football (soccer ball). Arrows show dribbling with acceleration.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-expanded-1v1s-junior', 'U9', 'skill_intro', 20, '1 v 1 Defending',
'Set up 15x10 metre channels. 1v1 defending in two formats: line football (dribble to end line) and with gates/goals. Focus on getting out quick to close down, not diving in, correct body shape, forcing the weaker foot, and leading the attacker away from the strong goal. Swap roles after each attempt.',
ARRAY['Cones (20) for channels and gates', 'Balls (1 per pair)', 'Bibs (2 colours)', 'Small goals (4)'],
ARRAY['Get out quick — close the distance fast', 'Don''t dive in — stay on your feet and be patient', 'Body shape — side-on, low, balanced', 'Force weaker foot — show them onto their weak side', 'Lead attacker away from strong goal — angle your approach', 'Stay on your feet — don''t go to ground'],
ARRAY['Set up channels with line and gates, explain rules', 'Demonstrate: get out quick, body shape, force weaker foot', 'Round 1: line football — defender closes and forces direction (5 minutes)', 'Round 2: with gates — defender leads attacker away from strong gate (5 minutes)', 'Round 3: with goals — full 1v1 defending (5 minutes)', 'Competition: best defender wins (5 minutes)'],
ARRAY['Teach comprehensive 1v1 defending habits', 'Develop closing down speed and body shape', 'Build ability to force attacker onto weaker foot'],
'15x10 metre channels with end lines and gates. Attacker (orange bib) with football (soccer ball). Defender (blue bib) closing down. Arrows show closing angle and forcing direction.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-expanded-overload-junior', 'U9', 'progressive', 15, '2 v 1 / 3 v 2 Defending',
'Set up 25x20 metre areas with goals. Overload defending: 2v1 and 3v2 situations. Defender(s) must cut passing lanes, use correct pressing angle, and communicate. Focus on creating favourable situations despite being outnumbered. Progress from 2v1 to 3v2.',
ARRAY['Cones (12) for areas', 'Goals (2)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Create favourable situation — delay and force mistakes', 'Angle of press — cut the passing lane while pressing', 'Communication — organise your partner', 'Cut passing lanes — position to block the easy pass', 'Delay — don''t rush in, buy time for support', 'Press as a pair — work together'],
ARRAY['Set up areas with goals, explain overload rules', 'Demonstrate: pressing angle and cutting lanes', 'Round 1: 2v1 defending, focus on delay (5 minutes)', 'Round 2: 3v2 defending, focus on communication (5 minutes)', 'Round 3: competition — fewest goals conceded (5 minutes)'],
ARRAY['Teach overload defending principles', 'Develop pressing angles and lane cutting', 'Build communication in defensive situations'],
'25x20 metre area with goals. 2v1 or 3v2: attackers (orange bibs) vs defenders (blue bibs). Arrows show pressing angles and lane cutting.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-1v1-defending-expanded-tournament-junior', 'U9', 'game', 20, 'Defending Tournament',
'Set up multiple small pitches (20x15 metres) with goals. Tournament format: 3v3 or 4v4 games. Focus on defending habits — pressing cues, body shape, and transition. Rotate opponents. Larger space to create realistic defending situations. Play 4-minute games.',
ARRAY['Cones (16) for pitches', 'Goals (4)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Pressing cues — close down when attacker''s head is down', 'Body shape — side-on when defending', 'Get out quick — close the distance fast', 'Force weaker foot — show them onto their weak side', 'Transition — attack quickly when you win the ball', 'Communicate — organise your team'],
ARRAY['Set up tournament pitches, explain format', 'Round 1: 3v3 or 4v4 games, 4-minute rounds (8 minutes)', 'Rotate opponents (8 minutes)', 'Championship round (4 minutes)'],
ARRAY['Apply defending habits in competitive tournament', 'Develop team defending and communication', 'Build pressing and transition habits'],
'Multiple 20x15 metre pitches with goals. 3v3 or 4v4 tournament: orange vs blue. Arrows show pressing and defending.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT '1 v 1 Defending (Expanded)', 'Players develop comprehensive 1v1 defending including closing down, body shape, forcing weaker foot, and overload defending. Progresses from ball mastery through structured 1v1 and 2v1/3v2 defending to a tournament format.', 'U9', '1v1', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-expanded-mastery-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-expanded-1v1s-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-expanded-overload-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-1v1-defending-expanded-tournament-junior'),
70, ARRAY['Develop comprehensive 1v1 defending habits', 'Build closing down speed and correct body shape', 'Learn overload defending principles', 'Apply defending habits in competitive tournament'],
ARRAY['Get out quick', 'Don''t dive in', 'Force weaker foot', 'Communication'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 39 (Scrape): Defending Transition (U9 & U10)
-- Header Slide 39: U9 & U10 | Defending Transition | 27.8.25
-- NOTE: Bailey has unique structure — Session 2 is Sprints (5 min),
-- Session 3 is Endless Shark Attack (10 min), Session 4 is Transition Rondo (20 min)
-- Plus 20 min Games noted. Adjusted to fit 4-session framework.
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-defending-transition-interference-junior', 'U9', 'warmup', 15, 'Passing Interference',
'Set up 15x15 metre grids. Groups of 4: 3 passers and 1 interferer. Passers try to complete passes while the interferer disrupts. Focus on receiving under pressure — back foot receiving and turning away from pressure. Accelerate after turning. Progress to 2 interferers.',
ARRAY['Cones (12) for 3 grids', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Body shape — open up to see options when receiving', 'Strong pass — firm inside foot', 'Accelerate after turn — burst away from pressure', 'Back foot receiving — control across your body', 'Scan before receiving — know where pressure is', 'React quickly — transition mindset from the start'],
ARRAY['Set up grids, explain interference rules', 'Round 1: 3 passers vs 1 interferer, free touch (5 minutes)', 'Pause and coach: highlight good receiving under pressure', 'Round 2: add sprint races between rounds (5 minutes)', 'Round 3: add second interferer (5 minutes)'],
ARRAY['Improve receiving under pressure', 'Build reaction speed and sprint effort', 'Develop transition mindset from warm-up'],
'15x15 metre grid. 3 passers (orange bibs) with football (soccer ball), 1 interferer (blue bib). Arrows show receiving and turning under pressure.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-defending-transition-shark-junior', 'U9', 'skill_intro', 10, 'Endless Shark Attack',
'Use a 20x20 metre grid. All players dribble with a ball. Select 2-3 "sharks" (no ball, different bibs). Sharks try to kick dribblers'' balls out. If your ball is kicked out, you become a shark. Endless version: sharks never stop, game resets when only 1 player remains. Focus on winning the ball back, shielding, and intensity.',
ARRAY['Cones (8) for grid', 'Balls (1 per player minus sharks)', 'Bibs (different colour for sharks)'],
ARRAY['Reaction — respond immediately when you lose the ball', 'Shielding — protect the ball from sharks', 'Intensity — never stop moving, never stop competing', 'Win ball back — transition to shark immediately', 'Aggression — be first to the ball', 'Awareness — scan for approaching sharks'],
ARRAY['Explain Endless Shark Attack rules', 'Select 2-3 sharks, remaining players dribble', 'Play first round — observe transition to defending (3 minutes)', 'Reset and play second round — increase sharks (3 minutes)', 'Final round — last player standing wins (4 minutes)'],
ARRAY['Teach transition to defending mindset', 'Develop reaction speed and intensity', 'Build shielding and ball protection habits'],
'20x20 metre grid. Dribblers (orange bibs) with footballs (soccer balls). Sharks (blue bibs) chasing. Arrows show sharks closing down and dribblers shielding.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-defending-transition-rondo-junior', 'U9', 'progressive', 20, 'Transition Rondo',
'Set up 15x15 metre squares. 4v2 rondo with transition focus: when defenders win the ball, they immediately try to score in a mini goal while the 2 attackers who lost it must transition to defend. Focus on Bailey''s defending process: 1) Win ball back immediately, 2) If not, get in shape, 3) Press on cues, 4) Press as a team.',
ARRAY['Cones (16) for 4 rondo squares', 'Mini goals (4)', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Win ball back immediately — react the moment you lose it', 'If not, get in shape — organise quickly', 'Press on cues — head down, poor touch, back to goal', 'Press as a team — work together, don''t press alone', 'Intensity — never switch off', 'Communication — organise the press'],
ARRAY['Set up rondos with mini goals, explain transition rules', 'Round 1: 4v2 rondo with transition to defend (7 minutes)', 'Pause and coach: explain the 4-step defending process', 'Round 2: focus on pressing cues (7 minutes)', 'Round 3: competition — fewest goals conceded (6 minutes)'],
ARRAY['Teach the defending transition process', 'Develop reaction speed when losing possession', 'Build pressing habits as a team'],
'15x15 metre rondo square with mini goal. 4 attackers (orange bibs), 2 defenders (blue bibs). Arrows show transition: defenders winning ball and attacking mini goal, attackers recovering.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-defending-transition-game-junior', 'U9', 'game', 20, 'Transition Tournament',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Tournament style: 4v4 or 5v5 games. Focus on defending transition — winning the ball back quickly and getting in shape. Play 4-minute games, rotate opponents. Encourage the 4-step defending process.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Win ball back immediately — react the moment you lose it', 'Get in shape — organise quickly if you can''t win it back', 'Press on cues — close down when attacker is vulnerable', 'Press as a team — work together', 'Transition — attack quickly when you win the ball', 'Intensity — compete in every moment'],
ARRAY['Explain tournament format and defending focus', 'Round 1: 4v4 game, 4-minute round (4 minutes)', 'Rotate opponents (4 minutes)', 'Round 3: focus on defending process (4 minutes)', 'Championship round (4 minutes)', 'Cool down: discuss defending process moments (4 minutes)'],
ARRAY['Apply defending transition in competitive games', 'Develop the 4-step defending process', 'Build team defending habits and intensity'],
'40x30 metre pitch with goals. Two teams (orange vs blue bibs). Arrows show transition moments — losing ball and recovering.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Defending Transition', 'Players learn the defending transition process: win ball back immediately, get in shape, press on cues, press as a team. Progresses from passing interference through Shark Attack and transition rondos to a tournament format.', 'U9', 'Pressing', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-defending-transition-interference-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-defending-transition-shark-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-defending-transition-rondo-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-defending-transition-game-junior'),
65, ARRAY['Develop defending transition process', 'Build reaction speed when losing possession', 'Improve pressing habits as a team', 'Apply defending transition in competitive games'],
ARRAY['Win ball back immediately', 'Get in shape', 'Press on cues', 'Press as a team'],
'Academy', 'Junior Football';


-- ============================================================================
-- SLIDE 40 (Scrape): Pass & Control – Defending Process (U11/U12)
-- Header Slide 40: U11 & U12 | Pass & Control – Defending Process | 27.8.25
-- NOTE: age_group = U11 (U11/U12 programme)
-- ============================================================================

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-defending-process-square-passing-junior', 'U11', 'warmup', 15, 'Square Passing',
'Set up 15x15 metre squares. Groups of 4, one player on each corner. Pass and follow: pass to the next corner and follow your pass. Focus on passing technique with right foot only, then left foot only. Build ball speed and movement. Progress to 2-touch then 1-touch.',
ARRAY['Cones (16) for 4 squares', 'Balls (4)', 'Bibs (2 colours)'],
ARRAY['Passing technique — clean contact, firm pass', 'First touch — control towards your next action', 'Ball speed — keep the ball moving quickly', 'Movement — follow your pass immediately', 'Right foot only — then switch to left foot only', 'Use both feet — develop weaker foot'],
ARRAY['Set up squares, explain pass-and-follow rules', 'Round 1: right foot only, free touch (5 minutes)', 'Round 2: left foot only (5 minutes)', 'Round 3: alternate feet, 2-touch (3 minutes)', 'Competition: fastest group to complete 20 passes (2 minutes)'],
ARRAY['Improve passing technique with both feet', 'Develop first touch and ball speed', 'Build movement habits after passing'],
'15x15 metre squares. 4 players (orange bibs) on corners. Arrows show pass-and-follow pattern. Football (soccer ball) moving around square.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-defending-process-2v2v2-junior', 'U11', 'skill_intro', 15, '2 v 2 v 2 Rondo',
'Set up 15x15 metre squares. 3 pairs: 2 pairs keep possession (4v2), 1 pair defends. When defenders win the ball, the pair who lost it becomes defenders. Focus on transition defending — winning the ball back early and securing possession. Press cues, shape, and movement.',
ARRAY['Cones (16) for 4 squares', 'Balls (4)', 'Bibs (3 colours)'],
ARRAY['Press cues — close down when attacker is vulnerable', 'Shape — maintain defensive shape as a pair', 'Movement — adjust position as the ball moves', 'Win ball back early — react immediately', 'Secure possession — don''t give it straight back', 'Communication — organise with your partner'],
ARRAY['Set up squares, explain 2v2v2 rules', 'Round 1: 4v2 rondo with transition (5 minutes)', 'Pause and coach: highlight good pressing cues', 'Round 2: add 2-touch limit for attackers (5 minutes)', 'Round 3: competition — pair with fewest times defending (5 minutes)'],
ARRAY['Teach transition defending in rondo format', 'Develop pressing cues and defensive shape', 'Build communication between defensive partners'],
'15x15 metre square. 4 attackers (orange and yellow bibs), 2 defenders (blue bibs). Arrows show pressing and transition.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-defending-process-directional-junior', 'U11', 'progressive', 20, 'Directional Possession',
'Set up 30x20 metre grids divided into thirds. 5v5 directional possession: team with ball tries to play through the thirds. Defending team must protect the middle third — no forward passes allowed through. Focus on sliding together, pressing as a team, and making decisive decisions.',
ARRAY['Cones (16) for grids and thirds', 'Balls (3)', 'Bibs (2 colours)'],
ARRAY['Slide together — move as a unit across the pitch', 'Press as team — don''t press alone', 'No in-between decisions — commit to press or hold', 'Protect middle — block forward passes through the centre', 'Disallow forward pass — force sideways or backwards', 'Communication — organise the defensive line'],
ARRAY['Set up grids with thirds, explain directional rules', 'Round 1: 5v5 directional, focus on protecting middle (7 minutes)', 'Pause and coach: explain sliding and pressing as a team', 'Round 2: add condition — defending team scores by winning ball in middle third (7 minutes)', 'Round 3: competition between groups (6 minutes)'],
ARRAY['Teach defending shape and protecting the middle', 'Develop team pressing and sliding together', 'Build decisive defending — no in-between decisions'],
'30x20 metre grid divided into thirds. 5v5: orange vs blue. Defending team (blue) protecting middle third. Arrows show sliding together and pressing.');

INSERT INTO sessions (session_name, age_group, session_type, duration, title, organisation, equipment, coaching_points, steps, key_objectives, pitch_layout_description) VALUES
('session-academy-defending-process-game-junior', 'U11', 'game', 15, 'Defending Process Game',
'Set up a 40x30 metre pitch with goals at each end. Two equal teams. Play 5v5. Focus on the defending process — team shape, press cues, and press timing. Play 2 x 6-minute halves. Encourage the team to defend as a unit.',
ARRAY['Cones (8) for pitch boundary', 'Goals (2)', 'Balls (2)', 'Bibs (2 colours)'],
ARRAY['Team shape — maintain defensive formation', 'Press timing — close down at the right moment', 'Slide together — move as a unit', 'Press as team — don''t leave gaps', 'Transition — attack quickly when you win the ball', 'Communication — organise the defence'],
ARRAY['Explain game rules and defending process focus', 'Play first half (6 minutes) — observe team defending', 'Half-time: ask "How did you defend as a team?"', 'Play second half (6 minutes) — encourage defending process', 'Cool down: discuss best team defending moments'],
ARRAY['Apply defending process in a real game', 'Develop team shape and press timing', 'Build communication and unit defending'],
'40x30 metre pitch with goals. Two teams (orange vs blue bibs). Arrows show team shape and pressing as a unit.');

INSERT INTO lessons (title, description, age_group, skill_category, level, session_1_id, session_2_id, session_3_id, session_4_id, total_duration, objectives, coaching_focus, division, team_type)
SELECT 'Pass & Control – Defending Process', 'Players develop the team defending process through square passing, 2v2v2 rondos, and directional possession. Focus on pressing cues, team shape, and sliding together. Finishes with a game applying the defending process.', 'U11', 'Pressing', 'Beginner',
(SELECT id FROM sessions WHERE session_name = 'session-academy-defending-process-square-passing-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-defending-process-2v2v2-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-defending-process-directional-junior'),
(SELECT id FROM sessions WHERE session_name = 'session-academy-defending-process-game-junior'),
65, ARRAY['Develop passing technique with both feet', 'Build transition defending through rondo play', 'Improve team defending shape and pressing', 'Apply defending process in game situations'],
ARRAY['Press cues', 'Team shape', 'Slide together', 'No in-between decisions'],
'Academy', 'Junior Football';

-- ============================================================================
-- END OF BATCH MIGRATION — All slides with scraped content processed
-- Slides skipped: 10 (dup of 6), 27/header (dup of 9 — but scrape content was unique, included as slide 21), 36 (dup of 35)
-- Slides with NO scraped content (13 lessons): 11, 13, 14, 16, 17, 20, 41-47
-- These need Bailey to re-scrape from original slides
-- ============================================================================

COMMIT;
