/*
  # Safe Database Structure for Content Management

  ## Overview
  This migration ensures the database has the correct structure without destroying existing data.
  It creates tables only if they don't exist and preserves all existing content.

  ## Tables

  ### user_content
  Stores all site content including text, images, SEO settings, and configuration.
  - `id` (uuid, primary key) - Unique identifier for each content version
  - `content` (jsonb) - JSON object containing all site content
  - `created_at` (timestamptz) - Timestamp when this version was created
  - `updated_at` (timestamptz) - Timestamp when this version was last modified

  ## Security

  ### Row Level Security (RLS)
  - RLS is enabled on all tables to protect data
  - Public users can read content (SELECT)
  - Only service_role (backend/Edge Functions) can write content
  - This prevents unauthorized modifications from the client

  ## Important Notes
  - This migration is SAFE and will NOT delete existing data
  - Uses IF NOT EXISTS to prevent errors if tables already exist
  - Uses IF EXISTS for policies to allow safe re-application
  - All operations are idempotent (can be run multiple times safely)
*/

-- Create user_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_content table
ALTER TABLE user_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow safe re-application)
DROP POLICY IF EXISTS "Anyone can read content" ON user_content;
DROP POLICY IF EXISTS "Public read access" ON user_content;
DROP POLICY IF EXISTS "Service role can write content" ON user_content;

-- Create policy for public read access
CREATE POLICY "Anyone can read content"
  ON user_content
  FOR SELECT
  TO public
  USING (true);

-- Create policy for service role write access
-- Note: Client-side writes should go through Edge Functions with service_role key
CREATE POLICY "Service role can write content"
  ON user_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries on created_at
CREATE INDEX IF NOT EXISTS idx_user_content_created_at ON user_content(created_at DESC);
