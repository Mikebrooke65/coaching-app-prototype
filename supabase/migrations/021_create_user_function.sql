-- Function to create a new user (admin only)
-- This is called from the frontend via supabase.rpc()
CREATE OR REPLACE FUNCTION create_new_user(
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
  v_user_id UUID;
  v_calling_user_role TEXT;
  v_result JSON;
BEGIN
  -- Check if calling user is admin
  SELECT role INTO v_calling_user_role
  FROM users
  WHERE id = auth.uid();
  
  IF v_calling_user_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can create users';
  END IF;
  
  -- Validate required fields
  IF p_email IS NULL OR p_first_name IS NULL OR p_last_name IS NULL THEN
    RAISE EXCEPTION 'Email, first name, and last name are required';
  END IF;
  
  -- Generate a random password if not provided
  IF p_password IS NULL THEN
    p_password := encode(gen_random_bytes(9), 'base64');
  END IF;
  
  -- Create user in auth.users (this requires service role, so we'll return instructions)
  -- Since we can't directly create auth users from a function, we'll insert into users table
  -- and return the data needed for the frontend to complete the auth creation
  
  -- For now, just create a placeholder UUID and insert into users table
  -- The frontend will need to handle auth creation
  v_user_id := gen_random_uuid();
  
  -- Insert into users table
  INSERT INTO users (id, email, first_name, last_name, cellphone, role, active)
  VALUES (v_user_id, p_email, p_first_name, p_last_name, p_cellphone, p_role, p_active);
  
  -- Add to team if provided
  IF p_team_id IS NOT NULL THEN
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (p_team_id, v_user_id, CASE WHEN p_role = 'coach' THEN 'coach' ELSE 'player' END);
  END IF;
  
  -- Return result
  v_result := json_build_object(
    'success', true,
    'user_id', v_user_id,
    'email', p_email,
    'password', p_password,
    'message', 'User record created. Auth user must be created separately.'
  );
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users (function checks for admin internally)
GRANT EXECUTE ON FUNCTION create_new_user TO authenticated;
