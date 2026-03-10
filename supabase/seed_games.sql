-- Seed some games for testing
-- This assumes you have teams and users already seeded

-- Insert some past games for U9 Lithium team
-- Replace the team_id with actual team ID from your database
INSERT INTO public.games (team_id, opponent, game_date, venue, home_away, status, team_score, opponent_score)
SELECT 
  t.id,
  'Northern Frogs',
  NOW() - INTERVAL '3 days',
  'Rangers Home Ground',
  'home',
  'completed',
  3,
  2
FROM public.teams t
WHERE t.name ILIKE '%lithium%'
LIMIT 1;

INSERT INTO public.games (team_id, opponent, game_date, venue, home_away, status, team_score, opponent_score)
SELECT 
  t.id,
  'Coastal United',
  NOW() - INTERVAL '10 days',
  'Coastal Sports Complex',
  'away',
  'completed',
  1,
  1
FROM public.teams t
WHERE t.name ILIKE '%lithium%'
LIMIT 1;

INSERT INTO public.games (team_id, opponent, game_date, venue, home_away, status)
SELECT 
  t.id,
  'Valley Rangers',
  NOW() - INTERVAL '17 days',
  'Rangers Home Ground',
  'home',
  'completed'
FROM public.teams t
WHERE t.name ILIKE '%lithium%'
LIMIT 1;

-- Insert a future game (should not appear in past games list)
INSERT INTO public.games (team_id, opponent, game_date, venue, home_away, status)
SELECT 
  t.id,
  'Harbor Hawks',
  NOW() + INTERVAL '7 days',
  'Harbor Field',
  'away',
  'scheduled'
FROM public.teams t
WHERE t.name ILIKE '%lithium%'
LIMIT 1;
