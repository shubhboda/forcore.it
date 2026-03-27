-- =====================================================
-- BULLETPROOF FIX FOR MISSING USER PROFILES & SIGNUP ERRORS
-- Run this in your Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Ensure the user_profiles table has the exact needed columns
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure RLS policies are correct and bulletproof
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read and update their own profile
DROP POLICY IF EXISTS "Users read own profile" ON public.user_profiles;
CREATE POLICY "Users read own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON public.user_profiles;
CREATE POLICY "Users update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- Allow frontend code (AuthContext) to easily insert the profile when missing
DROP POLICY IF EXISTS "Allow insert own profile" ON public.user_profiles;
CREATE POLICY "Allow insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin read policy
DROP POLICY IF EXISTS "Admin read all profiles" ON public.user_profiles;
CREATE POLICY "Admin read all profiles" ON public.user_profiles FOR SELECT USING (
  auth.jwt() ->> 'email' = 'shubhboda@gmail.com'
);

-- 3. Bulletproof Server-Side Trigger (Guarantees profile is created instantly on signup)
-- The SECURITY DEFINER tag circumvents RLS for the function's internal execution, eliminating "Database error saving new user".
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    CASE WHEN NEW.email = 'shubhboda@gmail.com' THEN 'admin' ELSE 'user' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Map the trigger purely to the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ALL DONE! User profiles will now sync flawlessly.
