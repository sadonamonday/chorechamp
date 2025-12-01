-- Fix for signup database error
-- Problem: phone column has UNIQUE constraint but clients don't provide phone numbers
-- Solution: Replace the UNIQUE constraint with a partial unique index that only applies to non-NULL values

-- Step 1: Drop the existing UNIQUE constraint on phone
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_phone_key;

-- Step 2: Create a partial unique index that allows multiple NULLs but ensures non-NULL phone numbers are unique
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique_idx 
ON public.profiles(phone) 
WHERE phone IS NOT NULL;

-- This allows:
-- - Multiple users can have NULL phone (clients who don't provide phone)
-- - Users with phone numbers must have unique phone numbers (taskers)
