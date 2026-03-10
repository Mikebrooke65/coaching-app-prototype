-- Add score fields to events table for game events
ALTER TABLE events
ADD COLUMN team_score INTEGER,
ADD COLUMN opponent_score INTEGER;

-- Add comment
COMMENT ON COLUMN events.team_score IS 'Score for the home team (only for game events)';
COMMENT ON COLUMN events.opponent_score IS 'Score for the opponent team (only for game events)';
