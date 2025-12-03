-- Allow admins to view all students
CREATE POLICY "Admins can view all students"
  ON public.students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

-- Allow admins to view all parents
CREATE POLICY "Admins can view all parents"
  ON public.parents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

-- Allow admins to view all schools
CREATE POLICY "Admins can view all schools"
  ON public.schools FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );
