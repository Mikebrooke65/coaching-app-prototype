-- Drop existing policies that cause circular dependencies
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;

-- Recreate policies without circular dependencies
-- Allow users to view their own profile
-- (This policy already exists and is fine)

-- Allow authenticated users to view other users (needed for team assignments, etc.)
-- We'll rely on application logic to filter sensitive data
CREATE POLICY "Authenticated users can view all users"
    ON users FOR SELECT
    TO authenticated
    USING (true);

-- Only service role can insert users (via admin panel or scripts)
CREATE POLICY "Service role can insert users"
    ON users FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Users can update their own profile (except role)
-- Admins can update any user (checked in application layer)
CREATE POLICY "Users can update profiles"
    ON users FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (
        -- Users can only update their own profile
        auth.uid() = id
        -- And cannot change their role
        AND role = (SELECT role FROM users WHERE id = auth.uid())
    );
