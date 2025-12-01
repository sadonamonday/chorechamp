# Database Schema Analysis - role vs user_type

## Current Situation

Your `profiles` table has TWO columns that serve the same purpose:

1. **`role`** - text with CHECK constraint (customer, tasker, admin) - DEFAULT 'customer'
2. **`user_type`** - text NOT NULL - DEFAULT 'customer'

## Analysis Results

### ✅ What's Actually Being Used in Your Code:

**ONLY `role` is being used:**

- `AuthContext.jsx` line 128: `const isAdmin = () => user?.role === 'admin';`
- `AuthContext.jsx` line 129: `const isTasker = () => user?.role === 'tasker';`
- `Login.jsx` line 47: `if (result.user && result.user.role === 'admin')`
- `AuthCallback.jsx` line 63: `const role = profile?.role || 'client';`

**`user_type` is NEVER referenced in your frontend code.**

## Recommendation: **Drop the `user_type` column**

### Reasons:
1. ✅ **`role` is actively used** in your authentication and authorization logic
2. ✅ **`role` has a proper CHECK constraint** ensuring only valid values ('customer', 'tasker', 'admin')
3. ✅ **`user_type` is redundant** and adds unnecessary complexity
4. ✅ **Simpler schema** = easier to maintain

## Three User Types

You are correct, you only need:
1. **customer** (previously called 'client' - we fixed this)
2. **tasker**
3. **admin**

## Implementation Plan

### Step 1: Drop the `user_type` column from the database

```sql
-- Remove the user_type column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_type;
```

### Step 2: Update the profile trigger to only use `role`

```sql
-- Simplified trigger function that only sets 'role'
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, 
    name, 
    role, 
    phone, 
    hourly_rate, 
    email_verified,
    updated_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'hourly_rate')::numeric,
    false,
    now()
  );
  return new;
end;
$$;

-- Recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Step 3: Verify everything still works

After dropping `user_type`:
- Test signup as customer
- Test signup as tasker
- Test login
- Test admin panel access (if exists)

## Alternative: Keep user_type and Drop role

If for some reason you want to keep `user_type` instead:

### Cons of this approach:
- ❌ Requires updating ALL your frontend code
- ❌ `user_type` has no CHECK constraint (less data validation)
- ❌ More work and potential for bugs

### Required changes:
1. Update `AuthContext.jsx` (isAdmin, isTasker functions)
2. Update `Login.jsx`
3. Update `AuthCallback.jsx`
4. Add CHECK constraint to `user_type`
5. Drop `role` column

**This is NOT recommended** - stick with `role`.

## Terminology Note

You mentioned "client" - this was inconsistent with your schema. The correct terms are:
- ✅ **customer** (someone who posts tasks)
- ✅ **tasker** (someone who completes tasks)
- ✅ **admin** (platform administrator)

We already fixed the code to use 'customer' instead of 'client' in `RegisterClient.jsx`.

## Final Recommendation

**Action:** Drop the `user_type` column and use only `role`.

This will:
- ✅ Eliminate redundancy
- ✅ Simplify your schema
- ✅ Align with your existing code
- ✅ Make future development clearer
