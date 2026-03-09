-- Migration 016: U9 Intercepting Lessons 01 and 02
-- Both lessons for Intercepting skill

-- ============================================================================
-- SESSIONS FOR U9 INTERCEPTING LESSON 01
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
  'session-read-the-pass-u9',
  'U9',
  'warmup',
  20,
  'Read the Pass',
  'Set up a 20x20 meter square. Groups of 3: two attackers passing between themselves, one defender in middle without ball. Defender watches passer''s body language and tries to predict pass direction. When defender thinks they know where pass is going, they call "NOW!" and attempt to intercept. Start with slow, obvious passes. Progress to faster, disguised passes. Switch roles every 90 seconds.',
  ARRAY['Cones (8) for square boundary', 'Bibs (3 colors)', 'Balls (1 per group)'],
  ARRAY['Watch the passer''s eyes and body', 'Anticipate pass direction', 'Time your movement', 'Accelerate to the ball', 'Stay patient, don''t guess too early', 'Read, then react'],
  ARRAY['Demonstrate reading body language: eyes, hips, foot position', 'Practice with slow, obvious passes (3 minutes)', 'Increase pass speed slightly (3 minutes)', 'Switch roles (repeat both speeds)', 'Add disguised passes: look one way, pass another (4 minutes)', 'Emphasize patience and reading skills'],
  ARRAY['Read passer''s body language', 'Anticipate pass direction', 'Time interception attempts'],
  '20x20 meter square marked with cones at corners. Groups of 3: two orange players (attackers without football (soccer ball)) positioned 8 meters apart, one blue player (defender without ball) in middle. One orange player has football (soccer ball) preparing to pass. Dotted lines show potential pass directions. Blue defender watching passer with emphasis on eye contact. Arrows show defender''s anticipated movement to intercept. Small inset showing key body language cues: eyes, hips, foot angle.'
),
(
  'session-cutting-passing-lanes-u9',
  'U9',
  'skill_intro',
  15,
  'Cutting Passing Lanes',
  'Set up five 12x12 meter grids. 3v1 in each grid (3 attackers vs 1 defender). Attackers in triangle formation trying to keep possession. Defender positions to block passing lane to one player, forcing pass to other side. Key concept: You can''t cover everyone, so cut off the most dangerous pass. Defender gets 1 point for interception, attackers get 1 point for 5 consecutive passes.',
  ARRAY['Cones (20) for 5 grids', 'Balls (1 per grid)', 'Bibs (2 colors)'],
  ARRAY['Position between ball and target player', 'Cut off the dangerous pass', 'Force them to pass where you want', 'Stay on your toes, ready to move', 'Adjust position as ball moves', 'Intercept with confidence'],
  ARRAY['Set up grids in triangle formation, explain passing lane concept', 'Demonstrate cutting lane: position blocks one pass option', 'First round: slow pace, defender focuses on positioning (4 minutes)', 'Second round: increase pace (4 minutes)', 'Switch roles (repeat both rounds)', 'Discuss: Which pass is most dangerous to block?'],
  ARRAY['Understand passing lane concept', 'Position to block dangerous passes', 'Force opponents into less dangerous options'],
  'Five 12x12 meter grids arranged in a row. Focus on center grid showing 3v1: 3 orange players (one with football (soccer ball), two without) in triangle formation vs 1 blue player (defender without ball) in center. Dotted lines show passing lanes between orange players. Blue defender positioned to block one passing lane with emphasis. Shaded zone shows blocked lane. Other passing lanes shown as open with arrows. Small annotation "BLOCK MOST DANGEROUS PASS". Scoreboard showing point system.'
),
(
  'session-interception-timing-u9',
  'U9',
  'progressive',
  15,
  'Interception Timing',
  'Set up three 18x12 meter channels. 3v2 in each channel (3 attackers vs 2 defenders). Attackers try to pass through channel. Defenders work together: one pressures ball, other reads and intercepts passes. Emphasis on second defender timing their run to intercept. Too early = attacker adjusts, too late = pass complete. Defenders score 2 points for interception, attackers score 1 point for successful pass through channel.',
  ARRAY['Cones (18) for 3 channels', 'Balls (3)', 'Bibs (2 colors)'],
  ARRAY['First defender: pressure the ball', 'Second defender: read and intercept', 'Time your run perfectly', 'Don''t go too early', 'Accelerate at the right moment', 'Communicate with partner'],
  ARRAY['Set up channels, explain press and intercept roles', 'Demonstrate timing: wait, read, accelerate', 'First round: focus on timing (5 minutes)', 'Second round: increase speed (5 minutes)', 'Track points, celebrate good interceptions', 'Cool down: discuss perfect timing'],
  ARRAY['Time interception runs effectively', 'Work with teammates to create interception opportunities', 'Balance patience with decisive action'],
  'Three 18x12 meter channels side by side. Focus on center channel showing 3v2: 3 orange players (one with football (soccer ball), two without) vs 2 blue players (both without ball). First blue defender pressuring ball carrier. Second blue defender positioned to read pass, with dotted arrow showing timed run to intercept. Emphasis on timing with three stages shown: 1) "TOO EARLY" with X, 2) "PERFECT TIMING" with checkmark, 3) "TOO LATE" with X. Scoreboard showing 2 pts for interception.'
),
(
  'session-interception-game-u9',
  'U9',
  'game',
  15,
  'Interception Game',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Special Rule: Interceptions are worth 2 bonus points (must win ball in the air or cut out a pass cleanly - no tackling). Regular goals = 1 point. This encourages players to read the game and intercept rather than just tackle.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)'],
  ARRAY['Read the game constantly', 'Anticipate passes', 'Position to intercept', 'Time your movement', 'Celebrate interceptions', 'Think ahead of the play'],
  ARRAY['Explain rules: interceptions worth 2 bonus points', 'Demonstrate what counts as interception vs tackle', 'Play 2 x 6-minute halves with 3-minute break', 'Coach calls out good interceptions loudly', 'During break: ask "How did you know the pass was coming?"', 'Second half: continue, track interception points', 'Cool down: praise best interception examples'],
  ARRAY['Apply interception skills in game context', 'Read game situations to anticipate passes', 'Value interceptions as primary defensive tool'],
  '30x20 meter pitch with small goals at each end. 4v4 game: 4 orange players vs 4 blue players. One orange player has football (soccer ball) preparing to pass. Blue defender positioned to intercept with emphasis circle. Dotted line shows anticipated pass path. Solid arrow shows defender''s interception run. Large annotation "+2 BONUS PTS FOR INTERCEPTION". Small inset showing difference between interception (cutting out pass) vs tackle. Multiple players spread across pitch in game positions.'
);

-- ============================================================================
-- LESSON FOR U9 INTERCEPTING LESSON 01
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
  'Read and Cut: Introduction to Intercepting',
  'Players learn to read the game and anticipate passes. Focus on reading body language, understanding passing lanes, timing interception runs, and valuing interceptions as a primary defensive skill.',
  'U9',
  'Intercepting',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-read-the-pass-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-cutting-passing-lanes-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-interception-timing-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-interception-game-u9'),
  65,
  ARRAY['Read passer''s body language to anticipate passes', 'Position to cut off dangerous passing lanes', 'Time interception runs with precision', 'Value interceptions over tackles as defensive tool'],
  ARRAY['Read before you react', 'Block the dangerous pass', 'Timing is everything', 'Intercept first, tackle second'];

-- ============================================================================
-- SESSIONS FOR U9 INTERCEPTING LESSON 02
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
  'session-scanning-for-interceptions-u9',
  'U9',
  'warmup',
  20,
  'Scanning for Interceptions',
  'Set up a 20x20 meter square. 4v4 possession game. Defending team focuses on constant scanning (looking around) to see passing options before ball is played. Coach calls "SCAN!" every 10 seconds to remind defenders to check surroundings. Defenders score 1 point for each interception. Attackers score 1 point for 6 consecutive passes. Emphasizes awareness and anticipation.',
  ARRAY['Cones (8) for square boundary', 'Bibs (2 colors)', 'Balls (2)'],
  ARRAY['Scan constantly - look around', 'Check over your shoulder', 'See the whole picture', 'Anticipate next pass', 'Position yourself early', 'Stay alert and aware'],
  ARRAY['Demonstrate scanning: head on swivel, checking surroundings', 'Practice scanning without ball (1 minute)', 'Play 4v4, coach calls "SCAN!" regularly (4 minutes)', 'Switch roles (4 minutes)', 'Remove coach prompts: players self-scan (4 minutes each role)', 'Discuss: What did you see when you scanned?'],
  ARRAY['Develop constant scanning habit', 'Increase awareness of passing options', 'Anticipate play before it happens'],
  '20x20 meter square marked with cones at corners. 4v4 possession game: 4 orange players (one with football (soccer ball), three without) vs 4 blue players (all without ball). Blue defenders shown with head-turn icons indicating scanning. Dotted lines from defenders'' eyes showing their vision of multiple passing options. Speech bubble from coach: "SCAN!". Emphasis on awareness with multiple potential pass paths shown. Small inset showing proper scanning technique: head movement, checking shoulders.'
),
(
  'session-intercepting-through-balls-u9',
  'U9',
  'skill_intro',
  15,
  'Intercepting Through Balls',
  'Set up five 15x10 meter channels with end zones. 2v1 in each channel: two attackers try to play through ball into end zone, one defender tries to intercept. Attacker 1 passes to Attacker 2 running into space. Defender must read pass early and sprint to intercept. Key concept: See the run, anticipate the pass, get there first. Defender scores 2 points for interception, attackers score 1 point for successful through ball.',
  ARRAY['Cones (20) for 5 channels and end zones', 'Balls (5)', 'Bibs (2 colors)'],
  ARRAY['Watch for forward runs', 'Anticipate through balls', 'Sprint to intercept', 'Get your body in the way', 'Be brave and committed', 'Timing and speed are key'],
  ARRAY['Set up channels with end zones, explain through ball concept', 'Demonstrate reading run and intercepting pass', 'First round: slow pace, focus on reading (4 minutes)', 'Second round: increase pace (4 minutes)', 'Switch roles (repeat both rounds)', 'Discuss: How do you know through ball is coming?'],
  ARRAY['Recognize through ball situations', 'Intercept passes into space', 'Use speed and anticipation together'],
  'Five 15x10 meter channels arranged in a row. Each channel has end zone (3 meters deep) at far end. Focus on center channel showing 2v1: orange attacker 1 with football (soccer ball) at near end, orange attacker 2 without ball making forward run toward end zone, blue defender without ball positioned between them. Dotted line shows anticipated through ball pass. Solid arrow shows defender''s sprint to intercept. Emphasis on reading the run early. Small annotation "SEE RUN → ANTICIPATE PASS → INTERCEPT". Scoreboard showing point system.'
),
(
  'session-team-interception-shape-u9',
  'U9',
  'progressive',
  15,
  'Team Interception Shape',
  'Set up three 20x15 meter areas. 4v4 in each area. Defending team works on compressing space to create interception opportunities. When ball is on one side, defenders shift across to make pitch "small" and crowd passing lanes. Coach awards 1 bonus point for interception when team is in good compact shape. Regular goals = 1 point. Emphasizes team positioning for interceptions.',
  ARRAY['Cones (18) for 3 areas', 'Small goals (6)', 'Balls (3)', 'Bibs (2 colors)'],
  ARRAY['Shift together as ball moves', 'Make the pitch small', 'Crowd the passing lanes', 'Stay compact as a team', 'Force them into mistakes', 'Intercept as a unit'],
  ARRAY['Set up areas, explain compressing space concept', 'Demonstrate team shift: ball moves, team shifts together', 'First round: coach guides team shifts (5 minutes)', 'Second round: team self-organizes shifts (5 minutes)', 'Track bonus points for good shape interceptions', 'Cool down: discuss how compression creates interceptions'],
  ARRAY['Work as team to compress space', 'Create interception opportunities through positioning', 'Understand collective defending for interceptions'],
  'Three 20x15 meter areas side by side. Each area has small goals at both ends. Focus on center area showing 4v4: 4 orange players vs 4 blue players. Ball with orange player on left side. Blue team shifted to left side creating compact shape. Shaded zone shows compressed area with crowded passing lanes. Dotted lines show limited passing options. Emphasis on team shape with arrows showing collective shift. Small annotation "COMPRESS SPACE = MORE INTERCEPTIONS". Contrast with small inset showing poor shape (spread out) with X mark.'
),
(
  'session-counter-attack-from-interception-u9',
  'U9',
  'game',
  15,
  'Counter-Attack from Interception',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Special Rule: If a team scores within 5 seconds of making an interception, the goal is worth 3 points. Regular goals = 1 point. This emphasizes quick transition from interception to attack, teaching players to exploit the moment when opponents are disorganized.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)', 'Stopwatch'],
  ARRAY['Intercept and attack immediately', 'Exploit disorganized opponents', 'Move ball forward quickly', 'Support the interception', 'Think attack as you intercept', 'Speed of transition is key'],
  ARRAY['Explain rules: 3 points for goal within 5 seconds of interception', 'Demonstrate quick transition: intercept → immediate forward pass → shoot', 'Play 2 x 6-minute halves with 3-minute break', 'Coach counts 5 seconds loudly after interceptions', 'During break: ask "What makes a good counter-attack?"', 'Second half: continue, celebrate quick transitions', 'Cool down: highlight best counter-attacks'],
  ARRAY['Transition quickly from defense to attack', 'Exploit interception moments', 'Counter-attack with speed and purpose'],
  '30x20 meter pitch with small goals at each end. 4v4 game: 4 orange players vs 4 blue players. Show moment where blue player just intercepted football (soccer ball) from orange team. Large "5 SECONDS!" timer annotation with clock icon. Arrows show rapid forward movement and passing toward goal. Orange players caught out of position (disorganized). Blue team exploiting space with quick counter. Large annotation "3 PTS IF SCORE IN 5 SEC!". Emphasis on speed with motion lines. Show goal-scoring opportunity created from interception.'
);

-- ============================================================================
-- LESSON FOR U9 INTERCEPTING LESSON 02
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
  'Scan and Strike: Advanced Intercepting',
  'Players develop advanced interception skills: constant scanning for awareness, intercepting through balls, team positioning to create interception opportunities, and transitioning quickly to counter-attack after interceptions.',
  'U9',
  'Intercepting',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-scanning-for-interceptions-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-intercepting-through-balls-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-team-interception-shape-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-counter-attack-from-interception-u9'),
  65,
  ARRAY['Scan constantly to increase awareness and anticipation', 'Intercept through balls by reading runs and passes', 'Work as team to compress space and create interceptions', 'Transition quickly to counter-attack after winning ball'],
  ARRAY['Scan, scan, scan', 'Read the run', 'Compress together', 'Intercept and attack'];

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE sessions IS 'Sessions for U9 Intercepting Lessons 01 and 02';
COMMENT ON TABLE lessons IS 'Lessons 01 and 02 for U9 Intercepting skill';
