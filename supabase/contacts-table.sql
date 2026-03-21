-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- Creates the contacts table and enables public insert for the contact form

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

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the public contact form)
CREATE POLICY "Allow public insert" ON contacts
  FOR INSERT
  WITH CHECK (true);

-- Note: You can view submissions in Supabase Dashboard > Table Editor
