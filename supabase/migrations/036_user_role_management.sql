-- Migration 036: User Role Management
-- Adds manager role to team_members, user_type to users, competitions framework,
-- invite codes, caregiver approvals, and player-caregiver relationships.

-- ============================================================================
-- 1. Update team_members role constraint to include 'manager'
-- ============================================================================
ALTER TABLE public.team_members
  DROP CONSTRAINT IF EXISTS team_members_role_check;

ALTER TABLE public.team_members
  ADD CONSTRAINT team_members_role_check
  CHECK (role IN ('player', 'coach', 'manager'));

-- Update RLS policy to allow managers to manage team members
DROP POLICY IF EXISTS "Allow admins to manage team members" ON public.team_members;
CREATE POLICY "Allow admins and managers to manage team members"
  ON public.team_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role::text IN ('admin', 'coach', 'manager')
    )
  );

-- ============================================================================
-- 2. Add user_type and privacy_consent_at to users table
-- ============================================================================
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS user_type text NOT NULL DEFAULT 'full'
  CHECK (user_type IN ('full', 'lite'));

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS privacy_consent_at timestamptz;

-- ============================================================================
-- 3. Create competitions table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  competition_type text NOT NULL CHECK (competition_type IN ('wcr', 'other')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS competitions_status_idx ON public.competitions(status);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read competitions"
  ON public.competitions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to manage competitions"
  ON public.competitions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role::text = 'admin'
    )
  );

-- ============================================================================
-- 4. Create competition_teams table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.competition_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(competition_id, team_id)
);

CREATE INDEX IF NOT EXISTS competition_teams_competition_id_idx ON public.competition_teams(competition_id);
CREATE INDEX IF NOT EXISTS competition_teams_team_id_idx ON public.competition_teams(team_id);

ALTER TABLE public.competition_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read competition_teams"
  ON public.competition_teams FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to manage competition_teams"
  ON public.competition_teams FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role::text = 'admin'
    )
  );

-- ============================================================================
-- 5. Create invite_codes table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.invite_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  competition_id uuid REFERENCES public.competitions(id),
  created_by uuid NOT NULL REFERENCES public.users(id),
  recipient_email text NOT NULL,
  recipient_phone text,
  redeemed_by uuid REFERENCES public.users(id),
  redeemed_at timestamptz,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS invite_codes_code_idx ON public.invite_codes(code);
CREATE INDEX IF NOT EXISTS invite_codes_team_id_idx ON public.invite_codes(team_id);
CREATE INDEX IF NOT EXISTS invite_codes_created_by_idx ON public.invite_codes(created_by);

ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read invite_codes"
  ON public.invite_codes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow coaches and managers to create invite codes for their teams"
  ON public.invite_codes FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role::text = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = invite_codes.team_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('coach', 'manager')
    )
  );

CREATE POLICY "Allow admins to manage invite_codes"
  ON public.invite_codes FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role::text = 'admin'
    )
  );

-- ============================================================================
-- 6. Create caregiver_approvals table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.caregiver_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.users(id),
  new_caregiver_email text NOT NULL,
  new_caregiver_first_name text NOT NULL,
  new_caregiver_last_name text NOT NULL,
  requested_by uuid NOT NULL REFERENCES public.users(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'escalated')),
  responded_by uuid REFERENCES public.users(id),
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS caregiver_approvals_player_id_idx ON public.caregiver_approvals(player_id);
CREATE INDEX IF NOT EXISTS caregiver_approvals_status_idx ON public.caregiver_approvals(status);

ALTER TABLE public.caregiver_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read caregiver_approvals"
  ON public.caregiver_approvals FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow caregivers to respond to approvals"
  ON public.caregiver_approvals FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.player_caregivers
      WHERE player_caregivers.player_id = caregiver_approvals.player_id
      AND player_caregivers.caregiver_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role::text = 'admin'
    )
  );

CREATE POLICY "Allow coaches/managers to create caregiver approvals"
  ON public.caregiver_approvals FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role::text = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.user_id = auth.uid()
      AND team_members.role IN ('coach', 'manager')
    )
  );

-- ============================================================================
-- 7. Create player_caregivers table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.player_caregivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  caregiver_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(player_id, caregiver_id)
);

CREATE INDEX IF NOT EXISTS player_caregivers_player_id_idx ON public.player_caregivers(player_id);
CREATE INDEX IF NOT EXISTS player_caregivers_caregiver_id_idx ON public.player_caregivers(caregiver_id);

ALTER TABLE public.player_caregivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read player_caregivers"
  ON public.player_caregivers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to manage player_caregivers"
  ON public.player_caregivers FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role::text = 'admin'
    )
  );
