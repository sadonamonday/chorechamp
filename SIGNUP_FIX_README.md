# Signup Fix - Instructions

## Problem
The signup functionality is failing with a 500 Internal Server Error from Supabase. This is caused by a missing or incorrect database trigger that should automatically create a profile when a user signs up.

## Root Causes
1. **Missing/Incorrect Database Trigger**: The `handle_new_user()` trigger function is either not installed in your Supabase database or has an incorrect schema
2. **Schema Mismatch**: The `profiles` table has both a `role` and `user_type` column, but the trigger wasn't setting `user_type` (which is NOT NULL)
3. **Role Value Mismatch**: The client was sending 'client' but the schema expects 'customer'

## What Was Fixed

### 1. Frontend Changes (Already Applied)
- ✅ Updated `RegisterClient.jsx` to use 'customer' instead of 'client' for the role parameter

### 2. Database Changes (You Need to Apply These)

#### **IMPORTANT: You must run the SQL trigger in your Supabase database**

1. **Open your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project (teppzagymejhzzgycxmr)

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and paste the entire contents of `fixed_profile_trigger.sql`**
   - This file contains the corrected trigger function that:
     - Sets both `role` and `user_type` columns
     - Defaults to 'customer' if no role is specified
     - Properly extracts username, phone, and hourly_rate from metadata
     - Sets email_verified to false initially

4. **Run the SQL**
   - Click the "Run" button or press Ctrl+Enter (Cmd+Enter on Mac)
   - You should see a success message

5. **Verify the trigger was created**
   - Run this query to check:
     ```sql
     SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
     ```
   - You should see one row returned

## Testing the Fix

After running the SQL trigger:

1. Open your application in the browser
2. Try to register as a new client
3. The signup should now work without errors
4. Check the Supabase dashboard -> Authentication -> Users to see the new user
5. Check Table Editor -> profiles to confirm the profile was created automatically

## Additional Notes

- The trigger will automatically create a profile for EVERY new user that signs up
- The `username` will be extracted from the signup metadata, or default to the email prefix if not provided
- Email verification is set to false by default (users need to verify their email)
- All new profiles will be set to 'customer' role unless specified otherwise during signup

## If Issues Persist

1. Check Supabase logs: Dashboard -> Logs -> select "Postgres Logs"
2. Look for any error messages related to the trigger
3. Verify that Row Level Security (RLS) policies on the `profiles` table allow inserts from the trigger function
4. Make sure the `auth.users` table exists and is accessible

## Row Level Security (RLS) Note

If you're still getting errors after running the trigger, you may need to check your RLS policies on the `profiles` table. The trigger runs with `security definer` which should bypass RLS, but verify that:

```sql
-- Check current RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

If needed, you can temporarily disable RLS on profiles table for testing:
```sql
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

But this is NOT recommended for production. Instead, ensure proper RLS policies are in place.
