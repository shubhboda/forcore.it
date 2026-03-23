-- ============================================
-- ADMIN PANEL - Full Database Schema
-- Run in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================

-- 1. PROJECTS TABLE (Our Work section)
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

-- 2. PLANS TABLE (Pricing section)
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

-- 3. USER PROFILES (extends Supabase auth.users)
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

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROJECTS POLICIES
-- Public read, Admin only write (via service role or admin check in app)
-- ============================================
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin insert projects" ON projects FOR INSERT WITH CHECK (
  auth.jwt() ->> 'email' = 'support.forcore.it@gmail.com'
);
CREATE POLICY "Admin update projects" ON projects FOR UPDATE USING (
  auth.jwt() ->> 'email' = 'support.forcore.it@gmail.com'
);
CREATE POLICY "Admin delete projects" ON projects FOR DELETE USING (
  auth.jwt() ->> 'email' = 'support.forcore.it@gmail.com'
);

-- ============================================
-- PLANS POLICIES
-- ============================================
CREATE POLICY "Public read plans" ON plans FOR SELECT USING (true);
CREATE POLICY "Admin insert plans" ON plans FOR INSERT WITH CHECK (
  auth.jwt() ->> 'email' = 'support.forcore.it@gmail.com'
);
CREATE POLICY "Admin update plans" ON plans FOR UPDATE USING (
  auth.jwt() ->> 'email' = 'support.forcore.it@gmail.com'
);
CREATE POLICY "Admin delete plans" ON plans FOR DELETE USING (
  auth.jwt() ->> 'email' = 'support.forcore.it@gmail.com'
);

-- ============================================
-- USER PROFILES POLICIES
-- ============================================
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can read all profiles" ON user_profiles FOR SELECT USING (
  auth.jwt() ->> 'email' = 'support.forcore.it@gmail.com'
);

-- ============================================
-- STORAGE: Create bucket 'project-images' from Supabase Dashboard > Storage
-- Then add policies for public read, admin upload/delete
-- ============================================

-- ============================================
-- TRIGGER: Auto-create user_profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    CASE WHEN NEW.email = 'support.forcore.it@gmail.com' THEN 'admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Seed only if tables are empty (run after schema)
-- INSERT INTO projects (name, description, tags, image_url, sort_order) 
-- SELECT * FROM (VALUES ...) v WHERE NOT EXISTS (SELECT 1 FROM projects LIMIT 1);
