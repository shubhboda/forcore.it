-- =====================================================
-- FIX: "Database error saving new user"
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. DROP the trigger (this is causing signup to fail)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Ensure user_profiles has INSERT policy
DROP POLICY IF EXISTS "Allow insert own profile" ON user_profiles;
CREATE POLICY "Allow insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Done! Signup will work. Profile is created by the app after login.
