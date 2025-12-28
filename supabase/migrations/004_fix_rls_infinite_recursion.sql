-- Fix infinite recursion in RLS policies for users table
-- The issue: "Admins can view all users" policy queries public.users, causing infinite recursion
-- Solution: Use a SECURITY DEFINER function to check admin status (bypasses RLS)

-- Step 1: Create a function to check if current user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- SECURITY DEFINER allows this function to bypass RLS
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all usage logs" ON public.usage_logs;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Step 3: Recreate policies without circular references

-- Policy 1: Users can SELECT their own record
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Admins can view all users (using function that bypasses RLS)
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Policy 3: Users can UPDATE their own record
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Users can INSERT their own record (fallback if trigger fails)
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Step 4: Fix admin policy for usage_logs table
DROP POLICY IF EXISTS "Admins can view all usage logs" ON public.usage_logs;

CREATE POLICY "Admins can view all usage logs"
  ON public.usage_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

