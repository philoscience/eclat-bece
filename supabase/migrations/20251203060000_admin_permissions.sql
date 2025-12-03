-- Allow admins to view all profiles (needed for user management)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

-- Allow admins to view all user_roles (needed for checking existing roles)
CREATE POLICY "Admins can view all user_roles"
  ON public.user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

-- Allow super admins to insert/update/delete user_roles
CREATE POLICY "Super admins can manage user_roles"
  ON public.user_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_super_admin = TRUE
        AND is_active = TRUE
    )
  );
