-- Alternative solution: Update the RLS policy to allow profile creation during signup
-- This is less secure but simpler if you don't want to use triggers

-- Drop the existing insert policy
drop policy if exists "Users can insert their own profile." on profiles;

-- Create a new policy that allows inserts when the user is authenticated
-- OR when the profile ID matches the authenticated user (for edge cases)
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( 
    auth.uid() = id 
    OR 
    auth.role() = 'authenticated'
  );
