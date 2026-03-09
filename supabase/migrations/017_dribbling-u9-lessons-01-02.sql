-- Migration 017: U9 Dribbling Lessons 01 and 02
-- Both lessons for Dribbling skill

-- ============================================================================
-- SESSIONS FOR U9 DRIBBLING LESSON 01
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
  'session-close-control-u9',
  'U9',
  'warmup',
  20,
  'Close Control',
  'Set up a 20x20 meter square. Each player with a ball dribbles freely around the area. On coach signal, players perform specific touches: sole of foot rolls, inside/outside touches, pull backs. Progress to dribbling through traffic, avoiding other players. Every 2 minutes, coach calls different touch type. Focus on keeping ball close, head up, using all parts of foot.',
  ARRAY['Cones (8) for square boundary', 'Balls (1 per player)', 'Bibs (optional)'],
  ARRAY['Keep ball close to your feet', 'Use all parts of your foot', 'Head up to see space', 'Small touches, not big kicks', 'Stay balanced and controlled', 'Protect the ball with your body'],
  ARRAY['Demonstrate close control: ball stays within 1 meter', 'Free dribbling with any touches (2 minutes)', 'Add sole rolls on signal (2 minutes)', 'Add inside/outside touches (2 minutes)', 'Add pull backs (2 minutes)', 'Free dribbling through traffic: avoid collisions (4 minutes)', 'Emphasize head up and awareness'],
  ARRAY['Develop close ball control', 'Use different parts of foot', 'Maintain awareness while dribbling'],
  '20x20 meter square marked with cones at corners. Multiple players (orange bibs) each with football (soccer ball) dribbling freely throughout area. Arrows show random movement patterns with ball staying close to feet. Small inset diagrams showing four touch types: 1) sole roll, 2) inside touch, 3) outside touch, 4) pull back. Emphasis on ball control with dotted circles (1 meter radius) around each player showing close control zone.'
),
(
  'session-change-of-direction-u9',
  'U9',
  'skill_intro',
  15,
  'Change of Direction',
  'Set up five 12x12 meter grids with 4 cones in each grid forming a square. Players dribble figure-8 pattern around cones, changing direction at each cone using inside or outside of foot. Start at 50% speed focusing on technique. Progress to 70% speed, then add defender walking behind. Key concept: Sharp changes of direction to lose opponents.',
  ARRAY['Cones (24) for 5 grids plus markers', 'Balls (1 per player)', 'Bibs (2 colors for progression)'],
  ARRAY['Plant foot beside ball', 'Use inside or outside of foot', 'Push ball into new direction', 'Stay low and balanced', 'Accelerate after the turn', 'Keep ball close during turn'],
  ARRAY['Set up grids with 4 cones in square pattern', 'Demonstrate figure-8 with direction changes', 'Practice at 50% speed (3 minutes)', 'Increase to 70% speed (3 minutes)', 'Add walking defender behind (3 minutes)', 'Increase defender to jogging pace (3 minutes)', 'Discuss: When do you change direction?'],
  ARRAY['Execute sharp changes of direction', 'Use inside and outside of foot', 'Accelerate out of turns'],
  'Five 12x12 meter grids arranged in a row. Each grid has 4 cones forming square (3 meters apart). Focus on center grid: orange player with football (soccer ball) dribbling figure-8 pattern around cones. Curved arrows show dribbling path with sharp direction changes at each cone. Small diagrams showing inside-foot turn and outside-foot turn techniques. Blue defender (without ball) following behind in progression. Emphasis on sharp turns with angle indicators showing 90-degree changes.'
),
(
  'session-dribbling-under-pressure-u9',
  'U9',
  'progressive',
  15,
  'Dribbling Under Pressure',
  'Set up three 15x10 meter channels. 1v1 in each channel: attacker tries to dribble from one end to other, defender tries to stop them. Attacker scores 1 point for reaching end with control. Defender scores 1 point for winning ball. Play for 45 seconds then switch. Progress to 2v2 in channels. Emphasizes dribbling with opponent pressure.',
  ARRAY['Cones (18) for 3 channels', 'Balls (3)', 'Bibs (2 colors)'],
  ARRAY['Protect the ball with your body', 'Change direction when pressured', 'Use quick touches to escape', 'Stay calm under pressure', 'Accelerate into space', 'Don''t panic and kick it away'],
  ARRAY['Set up channels, explain scoring system', 'Demonstrate protecting ball and escaping pressure', 'First round: 1v1, 45 seconds each (4 minutes)', 'Switch roles (4 minutes)', 'Progress to 2v2 in channels (4 minutes)', 'Discuss: How do you protect the ball?'],
  ARRAY['Dribble effectively under pressure', 'Protect ball with body positioning', 'Make decisions under defensive pressure'],
  'Three 15x10 meter channels side by side. Focus on center channel showing 1v1: orange player with football (soccer ball) dribbling toward far end, blue player (defender without ball) applying pressure from behind and side. Arrows show attacker''s dribbling path with direction changes to escape pressure. Emphasis on body positioning with attacker between ball and defender. Small inset showing correct shielding technique: body between ball and opponent, arms out for balance.'
),
(
  'session-dribbling-game-u9',
  'U9',
  'game',
  15,
  'Dribbling Game',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Special Rule: To score, player must dribble ball over goal line (not shoot). This encourages dribbling to goal and taking players on. Regular dribbled goals = 2 points. If player beats 2+ opponents before scoring, goal = 3 points.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)'],
  ARRAY['Take players on with confidence', 'Dribble toward goal', 'Use skills to beat opponents', 'Protect ball in tight spaces', 'Support dribbler with movement', 'Celebrate successful dribbles'],
  ARRAY['Explain rules: must dribble over line to score', 'Demonstrate dribbling to goal and beating opponents', 'Play 2 x 6-minute halves with 3-minute break', 'Track bonus points for beating multiple opponents', 'During break: ask "What helped you beat defenders?"', 'Second half: continue, celebrate great dribbling', 'Cool down: highlight best dribbling moments'],
  ARRAY['Apply dribbling in game situations', 'Take on opponents with confidence', 'Dribble to create scoring opportunities'],
  '30x20 meter pitch with small goals at each end. 4v4 game: 4 orange players vs 4 blue players. One orange player with football (soccer ball) dribbling toward goal, taking on blue defender. Arrows show dribbling path beating defenders. Emphasis on player dribbling over goal line (not shooting). Small annotation showing "2 pts for dribbled goal, 3 pts if beat 2+ opponents". Show multiple players spread across pitch with focus on dribbling action near goal.'
);

-- ============================================================================
-- LESSON FOR U9 DRIBBLING LESSON 01
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
  'Ball Mastery: Introduction to Dribbling',
  'Players learn fundamental dribbling skills: close control, changes of direction, protecting the ball under pressure, and dribbling with confidence in game situations. Focus on technique, control, and decision-making.',
  'U9',
  'Dribbling',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-close-control-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-change-of-direction-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-dribbling-under-pressure-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-dribbling-game-u9'),
  65,
  ARRAY['Maintain close control using all parts of foot', 'Execute sharp changes of direction to beat opponents', 'Protect ball effectively under defensive pressure', 'Dribble with confidence in game situations'],
  ARRAY['Ball stays close', 'Change direction sharply', 'Protect with your body', 'Be brave and confident'];

-- ============================================================================
-- SESSIONS FOR U9 DRIBBLING LESSON 02
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
  'session-speed-dribbling-u9',
  'U9',
  'warmup',
  20,
  'Speed Dribbling',
  'Set up a 20x20 meter square with 4 gates (2 cones, 2 meters wide) on each side. Players dribble at speed through gates, using longer touches in open space and shorter touches near gates. On coach signal, players sprint with ball to any gate. Progress to races: first player through 5 different gates wins. Focus on speed with control, knowing when to take big touches vs small touches.',
  ARRAY['Cones (24) for square and 8 gates', 'Balls (1 per player)'],
  ARRAY['Big touches in space', 'Small touches near gates', 'Head up to see next gate', 'Use laces for speed', 'Stay balanced at speed', 'Accelerate with the ball'],
  ARRAY['Set up square with gates, demonstrate speed dribbling', 'Free dribbling through gates (3 minutes)', 'Sprint to gates on signal (3 minutes)', 'Races: first through 5 gates (4 minutes)', 'Partner races: compete against partner (4 minutes)', 'Emphasize when to use big vs small touches'],
  ARRAY['Dribble at speed with control', 'Adjust touch size based on space', 'Accelerate with ball effectively'],
  '20x20 meter square marked with cones at corners. Four gates (2 cones, 2 meters wide) positioned on each side of square (8 gates total). Multiple orange players each with football (soccer ball) dribbling at speed through gates. Long arrows show big touches in open space between gates. Short arrows show small touches approaching and through gates. Emphasis on speed with motion lines. Small inset showing touch size comparison: big touch (3-4 meters) vs small touch (1 meter).'
),
(
  'session-dribbling-moves-u9',
  'U9',
  'skill_intro',
  15,
  'Dribbling Moves',
  'Set up five 12x12 meter grids with one cone in center of each. Players practice specific moves around cone: 1) Step-over, 2) Scissors, 3) Drag-back. Start slowly focusing on technique. Progress to performing move then accelerating away. Add passive defender for final progression. Key concept: Moves are used to create space and beat opponents.',
  ARRAY['Cones (10) for 5 grids plus center cones', 'Balls (1 per player)', 'Bibs (2 colors for progression)'],
  ARRAY['Sell the move - make it believable', 'Accelerate after the move', 'Use move to create space', 'Stay balanced throughout', 'Practice both feet', 'Move with purpose, not just for show'],
  ARRAY['Set up grids, demonstrate three moves slowly', 'Practice step-over around cone (3 minutes)', 'Practice scissors around cone (3 minutes)', 'Practice drag-back around cone (3 minutes)', 'Perform move then accelerate away (3 minutes)', 'Add passive defender: use move to beat them (3 minutes)'],
  ARRAY['Execute basic dribbling moves', 'Use moves to create space', 'Accelerate after performing move'],
  'Five 12x12 meter grids arranged in a row. Each grid has one cone in center. Focus on center grid showing three-stage sequence: 1) Orange player with football (soccer ball) approaching cone performing step-over move, 2) Same player executing scissors move, 3) Same player performing drag-back move. Each move shown with detailed foot position diagrams. Arrows show acceleration away after each move. Blue defender (passive, without ball) added in final stage. Small legend showing all three moves with step-by-step foot positions.'
),
(
  'session-dribbling-in-tight-spaces-u9',
  'U9',
  'progressive',
  15,
  'Dribbling in Tight Spaces',
  'Set up three 12x12 meter grids. 4v4 possession in each grid (very tight space). Team with ball tries to keep possession while dribbling in tight area. Defenders try to win ball. Team scores 1 point for 6 consecutive passes or successful dribbles. Emphasizes close control, quick feet, and awareness in congested areas.',
  ARRAY['Cones (12) for 3 grids', 'Balls (3)', 'Bibs (2 colors)'],
  ARRAY['Keep ball very close', 'Use quick, small touches', 'Turn away from pressure', 'Protect ball with body', 'Stay calm in tight space', 'Look for space to dribble into'],
  ARRAY['Set up tight grids, explain possession rules', 'Demonstrate dribbling in congestion: small touches, turns', 'First round: 4v4 possession (5 minutes)', 'Switch teams (5 minutes)', 'Track points, celebrate good tight control', 'Cool down: discuss how tight space is different'],
  ARRAY['Maintain control in congested areas', 'Use quick touches and turns', 'Make decisions in tight spaces'],
  'Three 12x12 meter grids side by side. Focus on center grid showing 4v4: 4 orange players (one with football (soccer ball), three without) vs 4 blue players (all without ball). Very congested space with all 8 players close together. Emphasis on tight control with small touch indicators around ball carrier. Arrows show quick turns and direction changes in limited space. Shaded zones showing very limited space available. Small annotation "TIGHT SPACE = SMALL TOUCHES". Contrast with small inset showing open space dribbling with X mark.'
),
(
  'session-creative-dribbling-game-u9',
  'U9',
  'game',
  15,
  'Creative Dribbling Game',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Special Rule: Bonus points for creativity - using a move to beat opponent = 1 bonus point, nutmeg (ball through legs) = 2 bonus points. Regular goals = 1 point. This encourages players to try skills and be creative with the ball.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)'],
  ARRAY['Be creative and try skills', 'Take risks with the ball', 'Enjoy dribbling', 'Learn from mistakes', 'Support creative teammates', 'Celebrate skill moves'],
  ARRAY['Explain rules: bonus points for moves and nutmegs', 'Demonstrate examples of creative play', 'Play 2 x 6-minute halves with 3-minute break', 'Coach celebrates all skill attempts, even unsuccessful', 'During break: ask "What moves did you try?"', 'Second half: continue, encourage more creativity', 'Cool down: highlight most creative moments'],
  ARRAY['Express creativity with the ball', 'Take calculated risks in dribbling', 'Develop confidence to try skills in games'],
  '30x20 meter pitch with small goals at each end. 4v4 game: 4 orange players vs 4 blue players. Show multiple dribbling actions: one orange player with football (soccer ball) performing move to beat blue defender, another orange player attempting nutmeg. Emphasis circles on creative moments. Small scoreboard showing "+1 pt for skill move, +2 pts for nutmeg, 1 pt for goal". Show players spread across pitch with focus on creative dribbling. Add small celebration icons near successful skill moves.'
);

-- ============================================================================
-- LESSON FOR U9 DRIBBLING LESSON 02
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
  'Skills and Speed: Advanced Dribbling',
  'Players develop advanced dribbling skills: speed dribbling with varied touch sizes, specific dribbling moves, control in tight spaces, and creative expression. Focus on confidence, creativity, and game application.',
  'U9',
  'Dribbling',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-speed-dribbling-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-dribbling-moves-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-dribbling-in-tight-spaces-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-creative-dribbling-game-u9'),
  65,
  ARRAY['Dribble at speed with appropriate touch sizes', 'Execute dribbling moves to beat opponents', 'Maintain control in tight, congested spaces', 'Express creativity and confidence with the ball'],
  ARRAY['Speed with control', 'Moves with purpose', 'Calm in congestion', 'Be creative and brave'];

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE sessions IS 'Sessions for U9 Dribbling Lessons 01 and 02';
COMMENT ON TABLE lessons IS 'Lessons 01 and 02 for U9 Dribbling skill';
