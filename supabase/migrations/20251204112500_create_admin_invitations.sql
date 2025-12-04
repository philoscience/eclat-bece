-- Create admin invitations table
CREATE TABLE IF NOT EXISTS public.admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invited_by UUID REFERENCES public.admins(id) ON DELETE SET NULL NOT NULL,
  token TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  is_super_admin BOOLEAN DEFAULT FALSE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')) DEFAULT 'pending' NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_invitations_token ON public.admin_invitations(token);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_target_user ON public.admin_invitations(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_status ON public.admin_invitations(status);
CREATE INDEX IF NOT EXISTS idx_admin_invitations_expires_at ON public.admin_invitations(expires_at);

-- Enable RLS
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Super admins can view all invitations
CREATE POLICY "Super admins can view all invitations"
  ON public.admin_invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_super_admin = TRUE
        AND is_active = TRUE
    )
  );

-- Super admins can create invitations
CREATE POLICY "Super admins can create invitations"
  ON public.admin_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_super_admin = TRUE
        AND is_active = TRUE
    )
  );

-- Super admins can update invitations (for revocation)
CREATE POLICY "Super admins can update invitations"
  ON public.admin_invitations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_super_admin = TRUE
        AND is_active = TRUE
    )
  );

-- Invited users can view their own pending invitations
CREATE POLICY "Users can view their own invitations"
  ON public.admin_invitations FOR SELECT
  USING (target_user_id = auth.uid() AND status = 'pending');

-- Function to generate secure invitation token
CREATE OR REPLACE FUNCTION public.generate_invitation_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_token TEXT;
  token_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate a random 32-character token
    new_token := encode(gen_random_bytes(24), 'base64');
    -- Remove URL-unsafe characters
    new_token := replace(replace(replace(new_token, '/', '_'), '+', '-'), '=', '');
    
    -- Check if token already exists
    SELECT EXISTS(
      SELECT 1 FROM public.admin_invitations WHERE admin_invitations.token = new_token
    ) INTO token_exists;
    
    -- Exit loop if token is unique
    EXIT WHEN NOT token_exists;
  END LOOP;
  
  RETURN new_token;
END;
$$;

-- Function to accept admin invitation
CREATE OR REPLACE FUNCTION public.accept_admin_invitation(_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation_record RECORD;
  new_admin_id UUID;
  result JSONB;
BEGIN
  -- Get invitation details
  SELECT * INTO invitation_record
  FROM admin_invitations
  WHERE token = _token
    AND status = 'pending'
    AND expires_at > NOW()
  FOR UPDATE;

  -- Check if invitation exists and is valid
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired invitation'
    );
  END IF;

  -- Check if user is accepting their own invitation
  IF invitation_record.target_user_id != auth.uid() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'This invitation is not for your account'
    );
  END IF;

  -- Check if user already has admin role
  IF EXISTS (SELECT 1 FROM admins WHERE user_id = invitation_record.target_user_id) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User is already an admin'
    );
  END IF;

  -- Add admin role to user_roles
  INSERT INTO user_roles (user_id, role)
  VALUES (invitation_record.target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Create admin record
  INSERT INTO admins (
    user_id,
    full_name,
    is_super_admin,
    created_by,
    is_active
  )
  VALUES (
    invitation_record.target_user_id,
    invitation_record.full_name,
    invitation_record.is_super_admin,
    invitation_record.invited_by,
    TRUE
  )
  RETURNING id INTO new_admin_id;

  -- Update invitation status
  UPDATE admin_invitations
  SET status = 'accepted',
      accepted_at = NOW()
  WHERE id = invitation_record.id;

  -- Log the acceptance
  PERFORM log_admin_action(
    invitation_record.invited_by,
    'accept_invitation',
    'admin',
    new_admin_id,
    jsonb_build_object(
      'invitation_id', invitation_record.id,
      'new_admin_id', new_admin_id,
      'is_super_admin', invitation_record.is_super_admin
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'admin_id', new_admin_id,
    'is_super_admin', invitation_record.is_super_admin
  );
END;
$$;

-- Function to expire old invitations (can be run via cron or manually)
CREATE OR REPLACE FUNCTION public.expire_old_invitations()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  UPDATE admin_invitations
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$;

-- Grant permissions
GRANT SELECT ON public.admin_invitations TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_invitation_token() TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_admin_invitation(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.expire_old_invitations() TO authenticated;

-- Comments
COMMENT ON TABLE public.admin_invitations IS 'Stores pending admin invitations with 24-hour expiration';
COMMENT ON FUNCTION public.accept_admin_invitation(TEXT) IS 'Accepts an admin invitation and creates admin record';
COMMENT ON FUNCTION public.expire_old_invitations() IS 'Marks expired invitations as expired (run periodically)';
