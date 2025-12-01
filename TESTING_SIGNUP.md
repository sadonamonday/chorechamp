# Testing the Fixed Signup

## ✅ Changes Applied

You've successfully run `simplified_profile_trigger.sql` which:
1. Dropped the redundant `user_type` column
2. Created the `handle_new_user()` trigger function
3. Set up the trigger to auto-create profiles on signup

## 🧪 Testing Steps

### Test 1: Customer Signup

1. **Open your app** (should be running at http://localhost:5173)
2. **Navigate to Register** 
3. **Click "Join as a Client"** or go to `/register-client`
4. **Fill in the form:**
   - Username: testcustomer1
   - Email: testcustomer1@test.com
   - Password: password123
   - Confirm Password: password123
5. **Click "Create Account"**

**Expected Result:**
✅ "Registration successful! Please check your email to verify your account"
✅ No 500 error in console
✅ User appears in Supabase Auth → Users
✅ Profile created in Table Editor → profiles with role = 'customer'

### Test 2: Tasker Signup

1. **Navigate to Register**
2. **Click "Join as a Tasker"** or go to `/register-tasker`
3. **Fill in the form:**
   - Username: testtasker1
   - Email: testtasker1@test.com
   - Phone: 0123456789
   - Skills: Cleaning, Gardening
   - Hourly Rate: 50
   - Password: password123
   - Confirm Password: password123
4. **Click "Create Tasker Account"**

**Expected Result:**
✅ Registration successful
✅ Profile created with role = 'tasker'
✅ Phone and hourly_rate are populated

### Test 3: Verify in Supabase Dashboard

1. **Go to Supabase Dashboard**
2. **Authentication → Users**
   - Should see your test users listed
3. **Table Editor → profiles**
   - Should see profiles for both users
   - Check that `role` column has correct values ('customer' or 'tasker')
   - Check that `user_type` column is GONE (no longer exists)

### Test 4: Console Check

**Open Browser DevTools (F12) → Console**

Before signup, you should have seen:
❌ `Failed to load resource: the server responded with a status of 500`
❌ `POST https://teppzagymejhzzgycxmr.supabase.co/auth/v1/signup 500`

After the fix:
✅ No 500 errors
✅ Signup completes successfully

## 🐛 If You Still See Errors

### Error: "Database error saving new user"
**Cause:** RLS policy might be blocking the trigger
**Fix:** The trigger uses `SECURITY DEFINER` so it should bypass RLS, but check:
```sql
-- Verify RLS policies on profiles table
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### Error: "column user_type does not exist"
**Cause:** The column was already dropped
**Fix:** This is actually good! It means the cleanup worked. The error might be from cached queries.

### Error: "null value in column user_type violates not-null constraint"
**Cause:** The DROP COLUMN command didn't run
**Fix:** Manually run:
```sql
ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_type;
```

## 🎯 Quick Verification Query

Run this in Supabase SQL Editor to check your current schema:

```sql
-- Check profiles table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

You should see:
- ✅ `role` column exists
- ✅ `user_type` column does NOT exist

## 📊 What Happens on Signup (Behind the Scenes)

1. User fills out signup form
2. Frontend calls `supabase.auth.signUp()` with:
   - email
   - password
   - metadata: {username, role, phone, hourly_rate}
3. Supabase creates user in `auth.users` table
4. **Trigger fires:** `on_auth_user_created`
5. **Trigger function runs:** `handle_new_user()`
6. Function extracts metadata and creates profile in `profiles` table
7. User sees success message

## ✨ Success Indicators

You'll know everything is working when:
- ✅ No console errors during signup
- ✅ Success message appears
- ✅ User can log in after email verification
- ✅ Profile data is correctly stored in database
- ✅ Role-based features work (e.g., isTasker(), isAdmin())

---

**Ready to test? Let me know the results!** 🚀
