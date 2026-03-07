-- Drop existing announcements table if it exists
DROP TABLE IF EXISTS announcements CASCADE;

-- Create announcements table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_ongoing BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  
  -- Targeting filters (all are optional - null means "all")
  target_roles TEXT[], -- ['coach', 'caregiver', 'player', 'manager', 'admin'] or null for all
  target_team_types TEXT[], -- ['First Kicks', 'Fun Football', 'Junior', 'Youth', 'Senior'] or null for all
  target_divisions TEXT[], -- ['Community', 'Academy'] or null for all
  target_age_groups TEXT[], -- ['U9', 'U10', 'U11', etc.] or null for all
  target_team_ids UUID[], -- Specific team IDs or null for all
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_announcements_expires_at ON announcements(expires_at);
CREATE INDEX idx_announcements_is_ongoing ON announcements(is_ongoing);
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies - simplified to avoid casting issues
CREATE POLICY "Users can view relevant announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (
    -- Show if not expired (or is ongoing)
    (is_ongoing = true OR expires_at > NOW() OR expires_at IS NULL)
  );

-- Only admins can manage announcements
CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Function to automatically set expires_at if not ongoing
CREATE OR REPLACE FUNCTION set_announcement_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_ongoing = FALSE AND NEW.expires_at IS NULL THEN
    NEW.expires_at := NEW.created_at + INTERVAL '7 days';
  END IF;
  
  IF NEW.is_ongoing = TRUE THEN
    NEW.expires_at := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER announcement_expiry_trigger
  BEFORE INSERT OR UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION set_announcement_expiry();

COMMENT ON TABLE announcements IS 'Team announcements with automatic 7-day expiry and flexible targeting';


-- Create storage bucket for announcement images
INSERT INTO storage.buckets (id, name, public)
VALUES ('announcements', 'announcements', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Anyone can view announcement images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'announcements');

CREATE POLICY "Admins can upload announcement images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'announcements'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete announcement images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'announcements'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
