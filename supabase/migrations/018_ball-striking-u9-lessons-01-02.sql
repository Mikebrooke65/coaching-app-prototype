-- Migration 018: U9 Ball Striking Lessons 01 and 02
-- Both lessons for Ball Striking skill

-- ============================================================================
-- SESSIONS FOR U9 BALL STRIKING LESSON 01
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
  'session-striking-technique-u9',
  'U9',
  'warmup',
  20,
  'Striking Technique',
  'Set up a 20x20 meter square with goals at opposite ends. Players in pairs, one ball per pair. Players practice striking stationary ball to partner 10 meters away. Focus on technique: plant foot beside ball, strike with laces, follow through toward target. Progress to striking rolling ball, then moving ball. Switch roles every 2 minutes. Emphasize technique over power.',
  ARRAY['Cones (8) for square boundary', 'Small goals or markers (4)', 'Balls (1 per pair)', 'Bibs (optional)'],
  ARRAY['Plant foot beside the ball', 'Strike with laces (top of foot)', 'Ankle locked and firm', 'Follow through toward target', 'Keep head down on contact', 'Body over the ball'],
  ARRAY['Demonstrate striking technique slowly: plant, strike, follow through', 'Practice with stationary ball (3 minutes)', 'Progress to rolling ball (3 minutes)', 'Switch roles (repeat both)', 'Add moving ball: dribble then strike (4 minutes)', 'Emphasize technique checklist at each stage'],
  ARRAY['Develop proper striking technique', 'Strike ball with laces consistently', 'Maintain balance and follow through'],
  '20x20 meter square marked with cones at corners. Small goals or markers at opposite ends. Pairs of orange players (one with football (soccer ball), one without) positioned 10 meters apart. Player with ball striking to partner. Arrows show ball path. Large inset diagram showing striking technique in three stages: 1) plant foot beside ball, 2) strike with laces/ankle locked, 3) follow through toward target. Emphasis on technique with checkmarks for correct form.'
),
(
  'session-shooting-accuracy-u9',
  'U9',
  'skill_intro',
  15,
  'Shooting Accuracy',
  'Set up five shooting stations with small goals (3 meters wide). Place cones 8 meters from each goal. Players take turns shooting at goal, aiming for corners. Use targets in corners (cones or markers) for visual aim points. Start with stationary ball, progress to one-touch shooting from pass. Score 2 points for goal in corners, 1 point for goal in center. Emphasizes accuracy over power.',
  ARRAY['Cones (15) for stations and markers', 'Small goals (5)', 'Balls (10)', 'Target markers (10) for corners'],
  ARRAY['Pick your target before you shoot', 'Aim for corners, not center', 'Side-foot for accuracy', 'Keep shot low', 'Follow through toward target', 'Accuracy first, power second'],
  ARRAY['Set up stations with goals and corner targets', 'Demonstrate aiming for corners', 'Practice with stationary ball (4 minutes)', 'Progress to one-touch from pass (4 minutes)', 'Competition: most corner goals wins (4 minutes)', 'Discuss: Why aim for corners?'],
  ARRAY['Shoot with accuracy to corners', 'Choose target before striking', 'Value placement over power'],
  'Five shooting stations arranged in a row. Each station has small goal (3 meters wide) with target markers in both corners. Orange player positioned 8 meters from goal with football (soccer ball). Dotted lines show aiming lines to both corners. Arrows show shot paths to corners. Emphasis on corner targets with annotation "2 PTS CORNERS, 1 PT CENTER". Small inset showing side-foot technique for accuracy. Scoreboard visible.'
),
(
  'session-shooting-under-pressure-u9',
  'U9',
  'progressive',
  15,
  'Shooting Under Pressure',
  'Set up three 15x12 meter areas with goals at one end. 2v1 in each area: two attackers try to create shooting opportunity, one defender tries to block. Attackers score 2 points for goal, 1 point for shot on target. Defender scores 1 point for block. Play for 60 seconds then rotate. Emphasizes quick shooting decisions under pressure.',
  ARRAY['Cones (18) for 3 areas', 'Small goals (3)', 'Balls (3)', 'Bibs (2 colors)'],
  ARRAY['Shoot early when you have space', 'Don''t wait for perfect moment', 'Get shot away quickly', 'Shoot across your body if needed', 'Follow up rebounds', 'Be decisive'],
  ARRAY['Set up areas with goals, explain scoring system', 'Demonstrate quick shooting: see space, shoot immediately', 'First round: 2v1, 60 seconds each (5 minutes)', 'Switch roles (5 minutes)', 'Track points, celebrate quick decisions', 'Cool down: discuss when to shoot'],
  ARRAY['Shoot quickly under defensive pressure', 'Make decisive shooting decisions', 'Create and exploit shooting opportunities'],
  'Three 15x12 meter areas side by side. Each area has small goal at one end. Focus on center area showing 2v1: 2 orange players (one with football (soccer ball), one without) vs 1 blue player (defender without ball). Orange player with ball in shooting position. Arrows show quick shot toward goal. Blue defender attempting to block. Emphasis on quick decision-making with annotation "SHOOT EARLY". Scoreboard showing "2 pts goal, 1 pt on target, 1 pt block".'
),
(
  'session-shooting-game-u9',
  'U9',
  'game',
  15,
  'Shooting Game',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Special Rule: Goals from outside designated shooting zone (marked 8 meters from goal) are worth 2 points. Goals from inside zone = 1 point. This encourages players to shoot from distance and take chances.',
  ARRAY['Cones (8) for pitch boundaries', 'Markers (8) for shooting zones', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)'],
  ARRAY['Look for shooting opportunities', 'Shoot from distance', 'Strike ball with confidence', 'Follow up your shots', 'Support shooter for rebounds', 'Celebrate all shooting attempts'],
  ARRAY['Mark shooting zones 8 meters from each goal', 'Explain rules: 2 points outside zone, 1 point inside', 'Play 2 x 6-minute halves with 3-minute break', 'Encourage distance shooting loudly', 'During break: ask "When should you shoot from distance?"', 'Second half: continue, track zone goals', 'Cool down: highlight best strikes'],
  ARRAY['Apply shooting in game situations', 'Shoot with confidence from distance', 'Recognize shooting opportunities'],
  '30x20 meter pitch with small goals at each end. Shooting zones marked with dotted lines 8 meters from each goal. 4v4 game: 4 orange players vs 4 blue players. One orange player with football (soccer ball) outside shooting zone preparing to shoot. Emphasis on shooting zone with shaded area. Large annotation "2 PTS OUTSIDE ZONE, 1 PT INSIDE ZONE". Arrows showing shot from distance. Multiple players spread across pitch with focus on shooting action.'
);

-- ============================================================================
-- LESSON FOR U9 BALL STRIKING LESSON 01
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
  'Strike It Right: Introduction to Ball Striking',
  'Players learn fundamental ball striking technique for shooting and passing. Focus on proper technique, accuracy over power, shooting under pressure, and taking shooting opportunities in games.',
  'U9',
  'Ball Striking',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-striking-technique-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-shooting-accuracy-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-shooting-under-pressure-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-shooting-game-u9'),
  65,
  ARRAY['Execute proper striking technique with laces', 'Shoot accurately to corners of goal', 'Make quick shooting decisions under pressure', 'Recognize and take shooting opportunities in games'],
  ARRAY['Technique over power', 'Aim for corners', 'Shoot early', 'Be confident'];

-- ============================================================================
-- SESSIONS FOR U9 BALL STRIKING LESSON 02
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
  'session-first-time-striking-u9',
  'U9',
  'warmup',
  20,
  'First Time Striking',
  'Set up a 20x20 meter square. Players in groups of 3 forming triangles. Player 1 passes to Player 2, who strikes first-time to Player 3. Rotate positions. Start with stationary passes, progress to moving passes. Focus on timing, body position, and striking moving ball without controlling first. Distance: 8-10 meters between players.',
  ARRAY['Cones (8) for square boundary', 'Balls (1 per group of 3)', 'Bibs (optional)'],
  ARRAY['Get your body behind the ball', 'Time your approach', 'Strike through the ball', 'Don''t lean back', 'Follow through', 'One touch only - no control'],
  ARRAY['Demonstrate first-time striking: timing and technique', 'Practice in triangles with stationary passes (3 minutes)', 'Progress to rolling passes (3 minutes)', 'Increase pass speed (3 minutes)', 'Add movement: players jog between passes (4 minutes)', 'Emphasize timing and body position'],
  ARRAY['Strike moving ball first-time', 'Time approach to ball', 'Maintain technique on moving ball'],
  '20x20 meter square marked with cones at corners. Groups of 3 orange players forming triangles (8-10 meters apart). Player 1 with football (soccer ball) passing to Player 2 (without ball), who strikes first-time to Player 3 (without ball). Arrows show pass sequence and rotation. Emphasis on first-time strike with annotation "NO CONTROL - STRIKE FIRST TIME". Small inset showing body position for first-time strike: behind ball, balanced.'
),
(
  'session-power-and-placement-u9',
  'U9',
  'skill_intro',
  15,
  'Power and Placement',
  'Set up five shooting stations 10 meters from goals. Players practice two types of shots: 1) Power shot with laces for distance, 2) Placement shot with side-foot for accuracy. Alternate between types. Use targets: power shots aim high, placement shots aim low corners. Key concept: Different situations need different techniques.',
  ARRAY['Cones (10) for stations', 'Small goals (5)', 'Balls (10)', 'Target markers (10)'],
  ARRAY['Power: strike with laces, through the ball', 'Placement: side-foot, pick your spot', 'Power for distance, placement for accuracy', 'Choose right technique for situation', 'Follow through determines height', 'Practice both techniques'],
  ARRAY['Set up stations with goals and targets', 'Demonstrate power shot: laces, follow through high', 'Demonstrate placement shot: side-foot, follow through low', 'Practice power shots (3 minutes)', 'Practice placement shots (3 minutes)', 'Alternate: power, placement, power, placement (4 minutes)', 'Discuss: When to use each technique?'],
  ARRAY['Execute power shots with laces', 'Execute placement shots with side-foot', 'Choose appropriate technique for situation'],
  'Five shooting stations arranged in a row. Each station has small goal 10 meters away with targets. Focus on center station showing two-stage sequence: 1) Orange player with football (soccer ball) performing power shot with laces (high follow-through), 2) Same player performing placement shot with side-foot (low follow-through). Arrows show different shot trajectories: power shot higher, placement shot lower to corner. Small legend showing "POWER = LACES, PLACEMENT = SIDE-FOOT". Target zones marked.'
),
(
  'session-shooting-from-angles-u9',
  'U9',
  'progressive',
  15,
  'Shooting from Angles',
  'Set up three shooting areas with goals. Place cones at different angles: 0 degrees (straight on), 45 degrees (angle), 90 degrees (side). Players practice shooting from each angle. From angles, must shoot across body to far post. Rotate through all three angles. Emphasizes adjusting technique based on shooting angle.',
  ARRAY['Cones (15) for angle markers', 'Small goals (3)', 'Balls (9)', 'Bibs (optional)'],
  ARRAY['Straight on: aim for corners', 'From angle: shoot across to far post', 'Open your body to the goal', 'Strike across the ball', 'Near post is risky from angles', 'Adjust your approach angle'],
  ARRAY['Set up three angle stations: 0°, 45°, 90°', 'Demonstrate shooting from each angle', 'Practice straight on (3 minutes)', 'Practice 45-degree angle (3 minutes)', 'Practice 90-degree angle (3 minutes)', 'Rotate through all angles (3 minutes)', 'Discuss: Why shoot to far post from angles?'],
  ARRAY['Shoot effectively from different angles', 'Adjust technique based on position', 'Aim for far post from angles'],
  'Three shooting areas side by side. Each area has small goal. Show three different shooting positions: 1) 0 degrees (straight on) with player and football (soccer ball) directly in front of goal, 2) 45 degrees (angle) with player at angle to goal, 3) 90 degrees (side) with player at side of goal. Dotted lines show shooting angles to far post from each position. Emphasis on far post targeting from angles with annotation "ANGLES → FAR POST". Small inset showing body position for angled shots.'
),
(
  'session-volleys-and-half-volleys-u9',
  'U9',
  'game',
  15,
  'Volleys and Half-Volleys',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Special Rule: Volley goals (striking ball in air) = 3 points, half-volley goals (striking ball just after bounce) = 2 points, regular goals = 1 point. Coach or players serve balls into play from sideline to create volley opportunities.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (4)', 'Bibs (2 colors)'],
  ARRAY['Watch the ball all the way', 'Time your strike', 'Keep your body over the ball', 'Strike through the ball', 'Don''t lean back', 'Be brave and committed'],
  ARRAY['Explain rules: 3 pts volley, 2 pts half-volley, 1 pt regular', 'Demonstrate volley and half-volley technique', 'Play 2 x 6-minute halves with 3-minute break', 'Serve balls from sideline to create opportunities', 'During break: ask "What makes volleys difficult?"', 'Second half: continue, celebrate all volley attempts', 'Cool down: highlight best volleys'],
  ARRAY['Attempt volleys and half-volleys in games', 'Time striking of moving ball', 'Develop confidence with difficult techniques'],
  '30x20 meter pitch with small goals at each end. 4v4 game: 4 orange players vs 4 blue players. Show two scenarios: 1) Orange player striking volley (ball in air) with emphasis, 2) Another orange player striking half-volley (ball just after bounce). Arrows show ball flight and strikes. Large scoreboard showing "3 PTS VOLLEY, 2 PTS HALF-VOLLEY, 1 PT REGULAR". Coach or player at sideline serving ball into play. Multiple players spread across pitch with focus on volley techniques.'
);

-- ============================================================================
-- LESSON FOR U9 BALL STRIKING LESSON 02
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
  'Strike It Clean: Advanced Ball Striking',
  'Players develop advanced striking skills: first-time striking, power vs placement techniques, shooting from angles, and volleys/half-volleys. Focus on variety, adaptability, and confidence with different striking techniques.',
  'U9',
  'Ball Striking',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-first-time-striking-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-power-and-placement-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-shooting-from-angles-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-volleys-and-half-volleys-u9'),
  65,
  ARRAY['Strike moving ball first-time without controlling', 'Use power and placement techniques appropriately', 'Shoot effectively from different angles', 'Attempt volleys and half-volleys with confidence'],
  ARRAY['First-time, no control', 'Power or placement', 'Angles to far post', 'Be brave with volleys'];

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE sessions IS 'Sessions for U9 Ball Striking Lessons 01 and 02';
COMMENT ON TABLE lessons IS 'Lessons 01 and 02 for U9 Ball Striking skill';
