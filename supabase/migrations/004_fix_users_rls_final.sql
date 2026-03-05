-- Drop ALL existing policies on users table to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Authenticated users can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can update profiles" ON users;

-- Create simple, non-recursive policies

-- SELECT: All authenticated users can view all users
-- (No subquery to avoid recursion)
CREATE POLICY "authenticated_users_select"
    ON users FOR SELECT
    TO authenticated
    USING (true);

-- INSERT: Only service role can insert
-- (Used by admin scripts and backend)
CREATE POLICY "service_role_insert"
    ON users FOR INSERT
    TO service_role
    WITH CHECK (true);

-- UPDATE: Users can update their own profile
-- But we need to prevent role changes
CREATE POLICY "users_update_own"
    ON users FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        -- Prevent role changes by checking the role hasn't changed
        AND (
            role = (SELECT role FROM users WHERE id = auth.uid() LIMIT 1)
            OR role IS NULL
        )
    );

-- DELETE: Only service role can delete
CREATE POLICY "service_role_delete"
    ON users FOR DELETE
    TO service_role
    USING (true);
