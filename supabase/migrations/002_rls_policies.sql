-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_caregivers ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can insert users"
    ON users FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update users"
    ON users FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM users WHERE id = auth.uid()));

-- Teams table policies
CREATE POLICY "Admins can manage teams"
    ON teams FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view assigned teams"
    ON teams FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_teams
            WHERE user_teams.team_id = teams.id
            AND user_teams.user_id = auth.uid()
        )
    );

-- User-Teams table policies
CREATE POLICY "Admins can manage user-team assignments"
    ON user_teams FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view own team assignments"
    ON user_teams FOR SELECT
    USING (user_id = auth.uid());

-- Skills table policies
CREATE POLICY "Everyone can view skills"
    ON skills FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage skills"
    ON skills FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Sessions table policies
CREATE POLICY "Everyone can view published sessions"
    ON sessions FOR SELECT
    USING (status = 'published' OR EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins can manage sessions"
    ON sessions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Lessons table policies
CREATE POLICY "Everyone can view published lessons"
    ON lessons FOR SELECT
    USING (status = 'published' OR EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins can manage lessons"
    ON lessons FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Lesson-Sessions table policies
CREATE POLICY "Everyone can view lesson sessions"
    ON lesson_sessions FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage lesson sessions"
    ON lesson_sessions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Delivery records policies
CREATE POLICY "Coaches can view own delivery records"
    ON delivery_records FOR SELECT
    USING (
        coach_id = auth.uid() AND deleted_at IS NULL
    );

CREATE POLICY "Coaches can view team delivery records (no coach attribution)"
    ON delivery_records FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_teams
            WHERE user_teams.team_id = delivery_records.team_id
            AND user_teams.user_id = auth.uid()
        )
        AND deleted_at IS NULL
    );

CREATE POLICY "Admins can view all delivery records"
    ON delivery_records FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Coaches can create delivery records"
    ON delivery_records FOR INSERT
    WITH CHECK (
        coach_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('coach', 'manager', 'admin')
        )
    );

CREATE POLICY "Coaches can update own delivery records"
    ON delivery_records FOR UPDATE
    USING (coach_id = auth.uid() AND deleted_at IS NULL)
    WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can delete own delivery records"
    ON delivery_records FOR UPDATE
    USING (coach_id = auth.uid() AND deleted_at IS NULL)
    WITH CHECK (coach_id = auth.uid() AND deleted_at IS NOT NULL);

-- Session feedback policies
CREATE POLICY "Coaches can view own session feedback"
    ON session_feedback FOR SELECT
    USING (coach_id = auth.uid());

CREATE POLICY "Admins can view all session feedback"
    ON session_feedback FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Coaches can create session feedback"
    ON session_feedback FOR INSERT
    WITH CHECK (
        coach_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('coach', 'manager', 'admin')
        )
    );

-- Lesson feedback policies
CREATE POLICY "Coaches can view own lesson feedback"
    ON lesson_feedback FOR SELECT
    USING (coach_id = auth.uid());

CREATE POLICY "Admins can view all lesson feedback"
    ON lesson_feedback FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Coaches can create lesson feedback"
    ON lesson_feedback FOR INSERT
    WITH CHECK (
        coach_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('coach', 'manager', 'admin')
        )
    );

-- Game feedback policies
CREATE POLICY "Coaches can view own game feedback"
    ON game_feedback FOR SELECT
    USING (coach_id = auth.uid());

CREATE POLICY "Admins can view all game feedback"
    ON game_feedback FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Coaches can create game feedback"
    ON game_feedback FOR INSERT
    WITH CHECK (
        coach_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('coach', 'manager', 'admin')
        )
    );

-- Announcements policies
CREATE POLICY "Users can view published announcements"
    ON announcements FOR SELECT
    USING (
        status = 'published'
        AND publish_date <= NOW()
        AND (expiration_date IS NULL OR expiration_date > NOW())
        AND (
            audience = 'all'
            OR audience::text = (SELECT role::text FROM users WHERE id = auth.uid())
        )
    );

CREATE POLICY "Admins can manage announcements"
    ON announcements FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Player-Caregivers policies
CREATE POLICY "Admins can manage player-caregiver links"
    ON player_caregivers FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Caregivers can view own player links"
    ON player_caregivers FOR SELECT
    USING (caregiver_id = auth.uid());

CREATE POLICY "Players can view own caregiver links"
    ON player_caregivers FOR SELECT
    USING (player_id = auth.uid());
