-- Remove the incorrect student record for the admin user 'solabschools@gmail.com'
-- This user is an admin but was accidentally created as a student as well

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the user_id for the email
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'solabschools@gmail.com';
  
  -- If user exists, delete from students table
  IF v_user_id IS NOT NULL THEN
    DELETE FROM public.students WHERE user_id = v_user_id;
  END IF;
END $$;
