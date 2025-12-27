-- Fix: Allow users to insert their own record (fallback if trigger fails)
-- This is needed when the database trigger doesn't run immediately

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Create policy to allow users to insert their own record
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Note: This is a fallback. The trigger should still create the record automatically.
-- This policy allows manual creation if the trigger fails or is slow.

