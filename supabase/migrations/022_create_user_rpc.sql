-- RPC function to create users (admin only)
-- This bypasses Edge Functions and uses database-level logic

CREATE OR REPLACE FUNCTION create_user_rpc(
  p_email TEXT,
  p_first_name TEXT,
  p_last_name TEXT,
  p_password TEXT DEFAULT NULL,
  p_role TEXT DEFAULT 'player',
  p_active BOOLEAN DEFAULT true,
  p_cellphone TEXT DEFAULT NULL,
  p_team_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_calling_user_role TEXT;
  v_new_user_id UUID;
  v_generated_password TEXT;
BEGIN
  -- Check if calling user is admin
  SELECT role INTO v_calling_user_role
  FROM users
  WHERE id = auth.uid();
  
  IF v_calling_user_role != 'admin' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Only admins can create users'
    );
  END IF;
  
  -- Validate required fields
  IF p_email IS NULL OR p_first_name IS NULL OR p_last_name IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Email, first_name, and last_name are required'
    );
  END IF;
  
  -- Generate password if not provided
  IF p_password IS NULL OR p_password = '' THEN
    v_generated_password := encode(gen_random_bytes(9), 'base64');
  ELSE
    v_generated_password := p_password;
  END IF;
  
  -- Note: We cannot create auth users from a database function
  -- The frontend will need to handle this separately, or we use a workaround
  -- For now, we'll create a placeholder user record and return instructions
  
  -- Generate a new UUID for the user
  v_new_user_id := gen_random_uuid();
  
  -- Insert into users table
  INSERT INTO users (id, email, first_name, last_name, cellphone, role, active)
  VALUES (v_new_user_id, p_email, p_first_name, p_last_name, p_cellphone, p_role, p_active);
  
  -- Add to team if provided
  IF p_team_id IS NOT NULL THEN
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (p_team_id, v_new_user_id, CASE WHEN p_role = 'coach' THEN 'coach' ELSE 'player' END);
  END IF;
  
  -- Return success with note about auth user creation
  RETURN json_build_object(
    'success', true,
    'user_id', v_new_user_id,
    'email', p_email,
    'password', v_generated_password,
    'note', 'User record created. Auth user must be created via Supabase Auth API (requires service role key).'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute to authenticated users (function checks admin internally)
GRANT EXECUTE ON FUNCTION create_user_rpc TO authenticated;

COMMENT ON FUNCTION create_user_rpc IS 'Creates a new user record. Admin only. Note: Auth user creation requires separate API call with service role.';
