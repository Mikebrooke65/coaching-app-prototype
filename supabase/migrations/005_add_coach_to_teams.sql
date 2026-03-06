-- Add coach_id column to teams table
ALTER TABLE teams ADD COLUMN coach_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_teams_coach_id ON teams(coach_id);

-- Add comment
COMMENT ON COLUMN teams.coach_id IS 'Primary coach assigned to this team';
