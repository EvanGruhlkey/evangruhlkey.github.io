-- Fix for "new row violates row-level security" error
-- Run this in your Supabase SQL Editor

-- Add INSERT policy for users table
-- This allows service role to insert users during signup
CREATE POLICY "Allow service role to insert users" ON users
  FOR INSERT 
  WITH CHECK (true);

-- Alternative: If you want to allow authenticated users to insert their own data
-- (This is the more secure approach if using Supabase Auth directly)
-- DROP POLICY IF EXISTS "Allow service role to insert users" ON users;
-- CREATE POLICY "Users can insert own data" ON users
--   FOR INSERT 
--   WITH CHECK (auth.uid() = id);


