# Apply Migration 004: Fix RLS Infinite Recursion

## Problem
The error "infinite recursion detected in policy for relation 'users'" occurs because the "Admins can view all users" policy queries the `public.users` table within its own check, causing an infinite loop.

## Solution
This migration creates a `SECURITY DEFINER` function that bypasses RLS to check admin status, then updates the policies to use this function instead of directly querying the users table.

## Steps to Apply

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `hoiijlxgruwpmbafwjot`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste the Migration**
   - Open the file: `MCN_FRONTEND/supabase/migrations/004_fix_rls_infinite_recursion.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click "Run" or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
   - Wait for "Success" message

5. **Verify**
   - Try signing in again on your frontend
   - The infinite recursion error should be gone

## What This Migration Does

1. Creates `public.is_admin(user_id UUID)` function that bypasses RLS using `SECURITY DEFINER`
2. Drops the problematic "Admins can view all users" policy
3. Recreates it using the new function (no more recursion)
4. Also fixes the "Admins can view all usage logs" policy
5. Keeps all other policies intact

## After Applying

Once applied, users should be able to:
- Sign in without the infinite recursion error
- View their own profile
- Admins can view all users (without recursion)

