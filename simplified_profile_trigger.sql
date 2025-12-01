-- SIMPLIFIED Profile Trigger - Without user_type redundancy
-- Run this in your Supabase SQL Editor AFTER dropping the user_type column

-- Step 1: Drop the user_type column (removes redundancy)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_type;

-- Step 2: Create/Update the trigger function to only use 'role'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    name, 
    role, 
    phone, 
    hourly_rate, 
    email_verified,
    updated_at
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', SPLIT_PART(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'customer'),
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'hourly_rate')::numeric,
    false,
    NOW()
  );
  RETURN new;
END;
$$;

-- Step 3: Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Step 4: Verify the trigger was created
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
