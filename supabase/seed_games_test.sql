-- Quick setup for testing Games feature
-- Run this in Supabase SQL Editor

-- 1. First, let's see what we have
-- SELECT id, email, first_name, last_name, role FROM users;
-- SELECT id, name, age_group FROM teams;

-- 2. Assign your user to a team (replace with your actual user email and team name)
-- Example: Assign mike@example.com to U9 Lithium team
INSERT INTO team_members (team_id, user_id, role)
SELECT 
  t.id as team_id,
  u.id as user_id,
  'coach' as role
FROM teams t
CROSS JOIN users u
WHERE t.name ILIKE '%lithium%'  -- Change this to match your team name
  AND u.email = 'mike@westcoastrangers.com'  -- Change this to your email
  AND NOT EXISTS (
    SELECT 1 FROM team_members tm 
    WHERE tm.team_id = t.id AND tm.user_id = u.id
  );

-- 3. Add some test games for that team
-- Game 1: Most recent (3 days ago) - completed
INSERT INTO games (team_id, opponent, game_date, venue, home_away, status, team_score, opponent_score)
SELECT 
  t.id,
  'Northern Frogs',
  NOW() - INTERVAL '3 days',
  'Rangers Home Ground',
  'home',
  'completed',
  3,
  2
FROM teams t
WHERE t.name ILIKE '%lithium%'
LIMIT 1;

-- Game 2: 10 days ago - completed with no score yet
INSERT INTO games (team_id, opponent, game_date, venue, home_away, status)
SELECT 
  t.id,
  'Coastal United',
  NOW() - INTERVAL '10 days',
  'Coastal Sports Complex',
  'away',
  'completed'
FROM teams t
WHERE t.name ILIKE '%lithium%'
LIMIT 1;

-- Game 3: 17 days ago - completed
INSERT INTO games (team_id, opponent, game_date, venue, home_away, status, team_score, opponent_score)
SELECT 
  t.id,
  'Valley Rangers',
  NOW() - INTERVAL '17 days',
  'Rangers Home Ground',
  'home',
  'completed',
  1,
  1
FROM teams t
WHERE t.name ILIKE '%lithium%'
LIMIT 1;

-- Game 4: Future game (should NOT appear in Games page)
INSERT INTO games (team_id, opponent, game_date, venue, home_away, status)
SELECT 
  t.id,
  'Harbor Hawks',
  NOW() + INTERVAL '7 days',
  'Harbor Field',
  'away',
  'scheduled'
FROM teams t
WHERE t.name ILIKE '%lithium%'
LIMIT 1;

-- 4. Add some players to the team (for player feedback testing)
-- First, let's create a couple of test players if they don't exist
-- You can skip this if you already have players

-- 5. Verify everything worked
SELECT 'Team Members:' as info;
SELECT u.email, u.first_name, u.last_name, t.name as team_name, tm.role
FROM team_members tm
JOIN users u ON u.id = tm.user_id
JOIN teams t ON t.id = tm.team_id
WHERE u.email = 'mike@westcoastrangers.com';  -- Change to your email

SELECT 'Games:' as info;
SELECT g.opponent, g.game_date, g.venue, g.home_away, g.status, g.team_score, g.opponent_score
FROM games g
JOIN teams t ON t.id = g.team_id
WHERE t.name ILIKE '%lithium%'
ORDER BY g.game_date DESC;
