-- Fix for public invitation lookup
-- The admin_invitations table has RLS enabled and no public access policy.
-- We need a secure function to allow anon users to fetch invitation details by token.

CREATE OR REPLACE FUNCTION public.get_invitation_details(_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation_record RECORD;
BEGIN
  -- Select invitation details if token matches and is valid
  SELECT 
    id,
    target_email,
    full_name,
    is_super_admin,
    status,
    expires_at,
    invited_by
  INTO invitation_record
  FROM admin_invitations
  WHERE token = _token
    AND status = 'pending'
    AND expires_at > NOW();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invitation');
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'invitation', jsonb_build_object(
      'id', invitation_record.id,
      'target_email', invitation_record.target_email,
      'full_name', invitation_record.full_name,
      'is_super_admin', invitation_record.is_super_admin,
      'status', invitation_record.status,
      'expires_at', invitation_record.expires_at
    )
  );
END;
$$;

-- Grant execute permission to anon (public) and authenticated users
GRANT EXECUTE ON FUNCTION public.get_invitation_details(TEXT) TO anon, authenticated;

-- Comment
COMMENT ON FUNCTION public.get_invitation_details(TEXT) IS 'Securely fetches invitation details by token for public access during setup';
