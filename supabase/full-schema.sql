-- ============================================
-- FORCOR.IT - Complete Supabase Schema
-- Run in Supabase SQL Editor (Dashboard > SQL Editor)
-- Admin: shubhboda@gmail.com
-- ============================================

-- 1. CONTACTS (messages from User Panel contact form)
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
CREATE POLICY "Allow public insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read contacts" ON contacts FOR SELECT USING (
  auth.jwt() ->> 'email' = 'shubhboda@gmail.com'
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
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin insert projects" ON projects FOR INSERT WITH CHECK (
  auth.jwt() ->> 'email' = 'shubhboda@gmail.com'
);
CREATE POLICY "Admin update projects" ON projects FOR UPDATE USING (
  auth.jwt() ->> 'email' = 'shubhboda@gmail.com'
);
CREATE POLICY "Admin delete projects" ON projects FOR DELETE USING (
  auth.jwt() ->> 'email' = 'shubhboda@gmail.com'
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
CREATE POLICY "Public read plans" ON plans FOR SELECT USING (true);
CREATE POLICY "Admin insert plans" ON plans FOR INSERT WITH CHECK (
  auth.jwt() ->> 'email' = 'shubhboda@gmail.com'
);
CREATE POLICY "Admin update plans" ON plans FOR UPDATE USING (
  auth.jwt() ->> 'email' = 'shubhboda@gmail.com'
);
CREATE POLICY "Admin delete plans" ON plans FOR DELETE USING (
  auth.jwt() ->> 'email' = 'shubhboda@gmail.com'
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
CREATE POLICY "Users read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin read all profiles" ON user_profiles FOR SELECT USING (
  auth.jwt() ->> 'email' = 'shubhboda@gmail.com'
);

-- 5. TRIGGER: Auto-create user_profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    CASE WHEN NEW.email = 'shubhboda@gmail.com' THEN 'admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. STORAGE: Create bucket "project-images" (public) in Dashboard > Storage
-- Add policies: Public read, Admin upload/delete (auth.jwt()->>'email' = 'shubhboda@gmail.com')

-- 7. REALTIME: Enable in Supabase Dashboard > Database > Replication > add "contacts" table
