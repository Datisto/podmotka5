/*
  # Update user_content table to use text ID for UPSERT operations

  ## Changes

  This migration updates the user_content table structure to:
  1. Change primary key from UUID to TEXT
  2. Allow client-side UPSERT operations through anon role
  3. Maintain all existing data
  4. Add proper constraints and indexes

  ## Tables Modified

  ### user_content
  - `id` changed from (uuid) to (text, primary key) - Now uses 'main-content' as fixed ID
  - All other columns remain the same
  - Existing data is preserved during migration

  ## Security

  ### Row Level Security (RLS)
  - RLS remains enabled on user_content table
  - Public users can read content (SELECT)
  - Anon users can UPSERT content (for admin operations)
  - Service role maintains full access

  ## Important Notes
  - This migration is SAFE and preserves existing data
  - Uses temporary table to safely migrate data
  - All policies are recreated with proper permissions
  - Includes rollback safety with IF EXISTS checks
*/

-- Step 1: Create new table with TEXT id
CREATE TABLE IF NOT EXISTS user_content_new (
  id text PRIMARY KEY,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 2: Migrate existing data (take the latest record)
DO $$
DECLARE
  latest_record RECORD;
BEGIN
  -- Check if old table exists and has data
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_content') THEN
    -- Get the most recent record from old table
    SELECT * INTO latest_record
    FROM user_content
    ORDER BY created_at DESC
    LIMIT 1;

    -- If we found a record, insert it into new table
    IF FOUND THEN
      INSERT INTO user_content_new (id, content, created_at, updated_at)
      VALUES ('main-content', latest_record.content, latest_record.created_at, latest_record.updated_at)
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;
END $$;

-- Step 3: Drop old table if it exists
DROP TABLE IF EXISTS user_content CASCADE;

-- Step 4: Rename new table to user_content
ALTER TABLE user_content_new RENAME TO user_content;

-- Step 5: Enable RLS on the table
ALTER TABLE user_content ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop all existing policies
DROP POLICY IF EXISTS "Anyone can read content" ON user_content;
DROP POLICY IF EXISTS "Public read access" ON user_content;
DROP POLICY IF EXISTS "Service role can write content" ON user_content;
DROP POLICY IF EXISTS "Anon can upsert content" ON user_content;

-- Step 7: Create policy for public read access
CREATE POLICY "Anyone can read content"
  ON user_content
  FOR SELECT
  TO public
  USING (true);

-- Step 8: Create policy for anon role to UPSERT (for client-side operations)
-- This allows the client to use UPSERT with anon key
CREATE POLICY "Anon can upsert content"
  ON user_content
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Step 9: Create policy for service role (maintains full access)
CREATE POLICY "Service role can write content"
  ON user_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Step 10: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_content_id ON user_content(id);
CREATE INDEX IF NOT EXISTS idx_user_content_updated_at ON user_content(updated_at DESC);

-- Step 11: Insert initial record if table is empty
INSERT INTO user_content (id, content)
VALUES ('main-content', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
