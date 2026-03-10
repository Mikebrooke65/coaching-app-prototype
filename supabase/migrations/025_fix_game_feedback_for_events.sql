-- Update game_feedback to reference events instead of games table
-- Since games are now stored as events with type='game'

-- Drop the existing foreign key constraint
ALTER TABLE game_feedback
DROP CONSTRAINT game_feedback_game_id_fkey;

-- Add new foreign key to events table
ALTER TABLE game_feedback
ADD CONSTRAINT game_feedback_game_id_fkey 
FOREIGN KEY (game_id) 
REFERENCES events(id) 
ON DELETE CASCADE;

-- Update comment to reflect the change
COMMENT ON COLUMN game_feedback.game_id IS 'References events.id where event_type = game';
