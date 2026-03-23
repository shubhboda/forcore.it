-- =====================================================
-- FORCOR.IT - Supabase Database Setup
-- Supabase Dashboard > SQL Editor > New query > Paste & Run
-- =====================================================

-- 1. CONTACTS (contact form messages)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  project_type TEXT,
  budget TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Remove old policies if they exist
DROP POLICY IF EXISTS "Allow public insert" ON contacts;
DROP POLICY IF EXISTS "Allow public insert contacts" ON contacts;
CREATE POLICY "Allow public insert contacts" ON contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read contacts" ON contacts;
CREATE POLICY "Admin read contacts" ON contacts FOR SELECT USING (
  auth.jwt() ->> 'email' = 'support.forcor.it@gmail.com'
);

-- 2. PROJECTS (Our Work section)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read projects" ON projects;
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin insert projects" ON projects;
CREATE POLICY "Admin insert projects" ON projects FOR INSERT WITH CHECK (
  auth.jwt() ->> 'email' = 'support.forcor.it@gmail.com'
);

DROP POLICY IF EXISTS "Admin update projects" ON projects;
CREATE POLICY "Admin update projects" ON projects FOR UPDATE USING (
  auth.jwt() ->> 'email' = 'support.forcor.it@gmail.com'
);

DROP POLICY IF EXISTS "Admin delete projects" ON projects;
CREATE POLICY "Admin delete projects" ON projects FOR DELETE USING (
  auth.jwt() ->> 'email' = 'support.forcor.it@gmail.com'
);

-- 3. PLANS (Pricing section)
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  price TEXT NOT NULL,
  features JSONB DEFAULT '[]',
  cta TEXT DEFAULT 'Get Started',
  popular BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read plans" ON plans;
CREATE POLICY "Public read plans" ON plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin insert plans" ON plans;
CREATE POLICY "Admin insert plans" ON plans FOR INSERT WITH CHECK (
  auth.jwt() ->> 'email' = 'support.forcor.it@gmail.com'
);

DROP POLICY IF EXISTS "Admin update plans" ON plans;
CREATE POLICY "Admin update plans" ON plans FOR UPDATE USING (
  auth.jwt() ->> 'email' = 'support.forcor.it@gmail.com'
);

DROP POLICY IF EXISTS "Admin delete plans" ON plans;
CREATE POLICY "Admin delete plans" ON plans FOR DELETE USING (
  auth.jwt() ->> 'email' = 'support.forcor.it@gmail.com'
);

-- 4. USER PROFILES
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON user_profiles;
CREATE POLICY "Users read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users update own profile" ON user_profiles;
CREATE POLICY "Users update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin read all profiles" ON user_profiles;
CREATE POLICY "Admin read all profiles" ON user_profiles FOR SELECT USING (
  auth.jwt() ->> 'email' = 'support.forcor.it@gmail.com'
);

-- Allow trigger & users to insert own profile
DROP POLICY IF EXISTS "Allow insert own profile" ON user_profiles;
CREATE POLICY "Allow insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Optional: DB trigger (client also creates profile if this fails)
-- Run this if you want server-side profile creation:
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO user_profiles (id, email, full_name, avatar_url, role)
--   VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url',
--     CASE WHEN NEW.email = 'support.forcor.it@gmail.com' THEN 'admin' ELSE 'user' END)
--   ON CONFLICT (id) DO NOTHING;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
