-- Allow admins to manage Year 6 quiz questions
CREATE POLICY "Admins can insert year 6 questions"
  ON public.quiz_questions_year6 FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

CREATE POLICY "Admins can update year 6 questions"
  ON public.quiz_questions_year6 FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

CREATE POLICY "Admins can delete year 6 questions"
  ON public.quiz_questions_year6 FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

-- Allow admins to manage Year 6 quiz options
CREATE POLICY "Admins can insert year 6 options"
  ON public.quiz_options_year6 FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

CREATE POLICY "Admins can update year 6 options"
  ON public.quiz_options_year6 FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

CREATE POLICY "Admins can delete year 6 options"
  ON public.quiz_options_year6 FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

-- Allow admins to manage Year 9 quiz questions
CREATE POLICY "Admins can insert year 9 questions"
  ON public.quiz_questions_year9 FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

CREATE POLICY "Admins can update year 9 questions"
  ON public.quiz_questions_year9 FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

CREATE POLICY "Admins can delete year 9 questions"
  ON public.quiz_questions_year9 FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

-- Allow admins to manage Year 9 quiz options
CREATE POLICY "Admins can insert year 9 options"
  ON public.quiz_options_year9 FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

CREATE POLICY "Admins can update year 9 options"
  ON public.quiz_options_year9 FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );

CREATE POLICY "Admins can delete year 9 options"
  ON public.quiz_options_year9 FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
  );
