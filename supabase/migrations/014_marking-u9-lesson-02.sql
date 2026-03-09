-- Migration 014: U9 Marking Lesson 02
-- Second lesson focusing on switching and communication

-- ============================================================================
-- SESSIONS FOR U9 MARKING LESSON 02
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
  'session-pass-and-follow-u9',
  'U9',
  'warmup',
  20,
  'Pass and Follow',
  'Set up a 20x20 meter square. Players in groups of 3: one attacker with ball, two defenders without ball. Attacker passes to coach at edge of square and follows their pass. Defenders must communicate and decide who marks the attacker. When attacker receives return pass, defenders adjust marking. Rotate roles every 2 minutes. Focus on communication: "I''ve got ball side!" or "I''ve got goal side!"',
  ARRAY['Cones (8) for square boundary', 'Bibs (3 colors)', 'Balls (1 per group)', 'Coaches positioned at edges'],
  ARRAY['Communicate loudly and clearly', 'Decide quickly who marks', 'Don''t both mark the same player', 'Adjust position as ball moves', 'Stay alert and ready'],
  ARRAY['Demonstrate the drill: pass, follow, defenders communicate and mark', 'Practice communication phrases: "I''ve got them!" "You take ball side!"', 'First round: slow pace, emphasize communication (3 minutes)', 'Second round: increase pace (3 minutes)', 'Switch roles (repeat both rounds)', 'Highlight good communication examples'],
  ARRAY['Develop communication between defenders', 'Make quick decisions about marking responsibility', 'Adjust marking as play develops'],
  '20x20 meter square marked with cones at corners. Groups of 3 spread throughout: one orange player (attacker) with football (soccer ball) passing to coach at edge, two blue players (defenders) without football (soccer balls) communicating about marking assignment. Arrows show pass to coach, attacker''s movement following pass, and return pass. Speech bubbles show communication between defenders ("I''ve got them!" "You cover!"). Emphasis on defender communication and quick marking decisions.'
),
(
  'session-switching-marks-u9',
  'U9',
  'skill_intro',
  15,
  'Switching Marks',
  'Set up five 12x12 meter grids with two small goals at opposite ends of each grid. 2v2 in each grid. Defenders are assigned to mark specific attackers (1 marks A, 2 marks B). Coach calls "SWITCH!" and defenders must quickly swap marking assignments. Attackers try to exploit the switch moment. Start with switches every 30 seconds, then progress to defenders choosing when to switch based on positioning.',
  ARRAY['Cones (20) for 5 grids', 'Small goals (10)', 'Balls (5)', 'Bibs (2 colors)', 'Numbered bibs'],
  ARRAY['Call "SWITCH!" loudly', 'Move quickly to new player', 'Don''t leave anyone unmarked', 'Stay organized during switch', 'Communicate constantly', 'Time your switches wisely'],
  ARRAY['Set up grids, assign initial marking pairs', 'Demonstrate switch: call loudly, move quickly to new assignment', 'First round: coach calls switches every 30 seconds (4 minutes)', 'Second round: coach calls switches randomly (3 minutes)', 'Third round: defenders choose when to switch (3 minutes)', 'Discuss: When is a good time to switch?'],
  ARRAY['Execute organized marking switches', 'Communicate during transitions', 'Maintain defensive organization when switching'],
  'Five 12x12 meter grids arranged in a row. Each grid has small goals at opposite ends. Focus on center grid showing 2v2: 2 orange players (one with football (soccer ball), one without) vs 2 blue players (both without football (soccer balls)). Dotted lines show initial marking assignments (blue 1 to orange A, blue 2 to orange B). Curved arrows show switch movement with blue defenders swapping assignments. Large "SWITCH!" text annotation. New dotted lines show switched assignments (blue 1 to orange B, blue 2 to orange A). Emphasis on communication and quick movement during switch.'
),
(
  'session-marking-in-transition-u9',
  'U9',
  'progressive',
  15,
  'Marking in Transition',
  'Set up three 20x15 meter areas with small goals at each end. 3v3 in each area. When a team loses possession, they have 3 seconds to get into marking positions (each defender picks up a player). If defending team is organized within 3 seconds, they get 1 bonus point. Regular goals = 1 point. This emphasizes quick transition to marking after losing the ball.',
  ARRAY['Cones (18) for 3 areas', 'Small goals (6)', 'Balls (3)', 'Bibs (2 colors)', 'Stopwatch or timer'],
  ARRAY['React quickly when you lose the ball', 'Find a player to mark immediately', 'Communicate: "I''ve got number 3!"', 'Get goal side fast', 'Stay organized as a team', 'Don''t all chase the ball'],
  ARRAY['Set up areas, explain 3-second rule and bonus point system', 'Demonstrate good transition: lose ball, quickly find player to mark', 'First round: play 3v3, coach counts 3 seconds loudly (5 minutes)', 'Second round: defenders must self-organize without coach counting (5 minutes)', 'Track bonus points, celebrate good transitions', 'Cool down: discuss importance of quick marking in transitions'],
  ARRAY['Transition quickly from attack to defense', 'Organize marking assignments rapidly', 'Maintain defensive shape after losing possession'],
  'Three 20x15 meter areas side by side. Each area has small goals at both ends. Focus on center area showing transition moment: orange team just lost football (soccer ball) to blue team. Large "3 SECONDS!" timer annotation. Show orange players (now defending, without ball) quickly moving to mark blue players. Dotted arrows show orange players'' rapid movement to find marking assignments. Blue player in center has football (soccer ball). Emphasis circles show organized marking positions. Small annotation showing "+1 bonus pt" for quick organization. Clock icon showing 3-second countdown.'
),
(
  'session-marking-responsibility-game-u9',
  'U9',
  'game',
  15,
  'Marking Responsibility Game',
  '4v4 game on a 30x20 meter pitch with small goals at each end. No goalkeepers. Special Rules: At start of each attack, coach assigns marking pairs (calls out numbers). Defenders must mark their assigned player for that attack. If your assigned player receives a pass, your team loses 1 point. If your assigned player scores, your team loses 3 points. Regular goals = 2 points. This emphasizes preventing your player from getting involved.',
  ARRAY['Cones (8) for pitch boundaries', 'Small goals (2)', 'Balls (2)', 'Bibs (2 colors)', 'Numbered bibs (1-8)'],
  ARRAY['Listen for your marking assignment', 'Deny your player the ball', 'Stay between player and ball', 'Communicate with teammates', 'Take pride in your marking job', 'Celebrate when your player doesn''t touch the ball'],
  ARRAY['Assign numbers to all players, explain special rules clearly', 'Demonstrate: coach calls assignments, defenders mark tightly', 'Play 2 x 6-minute halves with 3-minute break', 'Coach calls new assignments every 60 seconds or after each goal', 'During break: ask "How can you stop your player receiving the ball?"', 'Second half: continue, track points carefully', 'Cool down: praise good marking examples'],
  ARRAY['Take personal responsibility for marking assignment', 'Deny opponent involvement in play', 'Balance individual marking with team defense'],
  '30x20 meter pitch with small goals at each end. 4v4 game: 4 orange players vs 4 blue players. All players have numbers on bibs (1-8). One orange player has football (soccer ball) in midfield. Dotted lines connect current marking pairs based on coach assignment. Speech bubble from coach showing "Blue 5 mark Orange 2! Blue 6 mark Orange 3!" Emphasis on tight marking with one pair highlighted. Small scoreboard showing "-1 pt if player receives pass, -3 pts if player scores, +2 pts for goal". Show defenders working hard to deny their assigned players the ball.'
);

-- ============================================================================
-- LESSON FOR U9 MARKING LESSON 02
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
  'Talk and Switch: Advanced Marking',
  'Players develop communication skills and learn to switch marking assignments. Focus on organizing as a defensive unit, transitioning quickly, and taking responsibility for preventing opponents from getting involved in play.',
  'U9',
  'Marking',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-pass-and-follow-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-switching-marks-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-marking-in-transition-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-marking-responsibility-game-u9'),
  65,
  ARRAY['Communicate effectively with defensive teammates', 'Execute organized marking switches', 'Transition quickly from attack to defense with marking assignments', 'Deny assigned opponent involvement in play'],
  ARRAY['Talk constantly', 'Switch with purpose', 'Organize quickly', 'Your player, your pride'];

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE sessions IS 'Session 2 for U9 Marking focuses on communication and switching';
COMMENT ON TABLE lessons IS 'Lesson 2 for U9 Marking emphasizes teamwork and organization';
