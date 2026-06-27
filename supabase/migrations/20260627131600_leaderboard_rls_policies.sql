-- Allow authenticated users to view profiles, students, and quiz results
-- This is necessary to show the National Leaderboards and calculate monthly/annual rankings.

CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view all students"
ON public.students
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view all quiz results"
ON public.quiz_results
FOR SELECT
TO authenticated
USING (true);

-- Create the topic counts views for Student Practice Zone
CREATE OR REPLACE VIEW public.topic_question_counts_year6 AS
SELECT subject, topic, COUNT(*)::integer as questions_count
FROM public.quiz_questions_year6
WHERE topic IS NOT NULL
GROUP BY subject, topic;

CREATE OR REPLACE VIEW public.topic_question_counts_year9 AS
SELECT subject, topic, COUNT(*)::integer as questions_count
FROM public.quiz_questions_year9
WHERE topic IS NOT NULL
GROUP BY subject, topic;

GRANT SELECT ON public.topic_question_counts_year6 TO anon, authenticated;
GRANT SELECT ON public.topic_question_counts_year9 TO anon, authenticated;
