-- Allow admins to view all quiz results
CREATE POLICY "Admins can view all quiz results"
  ON public.quiz_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

-- Allow admins to view all student streaks
CREATE POLICY "Admins can view all student streaks"
  ON public.student_streaks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );
