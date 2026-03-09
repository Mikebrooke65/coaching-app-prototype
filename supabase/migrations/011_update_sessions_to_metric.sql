-- Migration 011: Update session descriptions to use metric measurements
-- Converts yards to meters in all session content

UPDATE sessions
SET 
  organisation = 'Set up an 18x18 meter square. Players work in pairs without a ball initially. One player (attacker) moves around the area using changes of direction and speed. The partner (defender) mirrors their movement staying 2-3 meters away, maintaining a side-on jockey position. Switch roles every 60 seconds. Progression: Add a ball to the attacker.',
  coaching_points = ARRAY['Stay on your toes, knees bent', 'Side-on body shape, never square', 'Keep 2-3 meters distance', 'Watch the ball, not the feet', 'Small quick steps, don''t cross feet'],
  pitch_layout_description = '18x18 meter square marked with cones at corners. Pairs spread throughout the area. Attacker (orange bib) moves freely within square. Defender (blue bib) mirrors movement staying 2-3 meters away, maintaining side-on position. Arrows show attacker''s random movement patterns and defender''s mirroring response.'
WHERE session_name = 'session-mirror-jockey-u9';

UPDATE sessions
SET 
  organisation = 'Set up multiple 9x9 meter grids. In each grid, one attacker with a ball, one defender. Attacker dribbles slowly in the grid. Defender jockeys and when coach calls "NOW", defender executes a block tackle. Start at 50% speed, gradually increase. Key Rule: Defender must be side-on before attempting tackle.',
  pitch_layout_description = 'Five 9x9 meter grids arranged in a line. Each grid contains one attacker (orange bib) with ball and one defender (blue bib). Attacker dribbles within grid boundaries. Defender jockeys using side-on stance, then executes block tackle when appropriate. Diagram shows defender''s approach angle (45 degrees, not straight on) and tackle execution with planted foot beside ball.'
WHERE session_name = 'session-block-tackle-intro-u9';

UPDATE sessions
SET 
  organisation = 'Set up 14x9 meter channels with a small goal at each end. 1v1 battles. Attacker starts with ball at one end, tries to dribble through and score. Defender must jockey, delay, and choose the right moment to tackle. If defender wins ball, they can counter-attack the opposite goal. Scoring: Goal = 1 point, winning ball with clean tackle = 1 point.',
  pitch_layout_description = 'Three 14x9 meter channels side by side. Each channel has small goal at both ends. Attacker (orange bib) starts at one end with ball, attempts to dribble through and score. Defender (blue bib) starts at opposite end, jockeys backward, forces attacker to one side, and tackles when opportunity arises. Arrows show attacker''s forward movement and defender''s backward jockey, then forward tackle. Dotted line shows defender''s counter-attack if ball is won.'
WHERE session_name = 'session-1v1-tackle-pressure-u9';

UPDATE sessions
SET 
  organisation = '4v4 game on a 27x18 meter pitch with small goals at each end. No goalkeepers. Special Rule: Team earns 1 bonus point for winning the ball with a clean tackle (coach''s judgment). Regular goals = 1 point.',
  pitch_layout_description = '27x18 meter pitch with small goals at each end. Two teams of 4 players (orange vs blue bibs). Standard small-sided game setup. Diagram shows typical game situation with players spread across pitch, highlighting a defending player using correct jockey position before attempting tackle. Arrows indicate ball movement and defensive pressure.'
WHERE session_name = 'session-tackle-game-u9';

COMMENT ON TABLE sessions IS 'All measurements in metric (meters)';
