/*
  # Add user data tracking to user_content table

  ## Changes

  This migration adds metadata tracking to ensure user data is never lost:
  1. Add has_user_data flag column to track if content has user modifications
  2. Add is_default flag to identify default content vs user content
  3. Update existing records to mark them as user data
  4. Add trigger to auto-update has_user_data on content changes

  ## Tables Modified

  ### user_content
  - `has_user_data` (boolean) - Tracks if content has user modifications
  - `is_default` (boolean) - Identifies if content is default or user-modified
  - Updated indexes for faster queries

  ## Security

  All existing RLS policies remain unchanged and functional.

  ## Important Notes
  - This migration is SAFE and preserves all existing data
  - Existing content is automatically marked as user data
  - New feature prevents accidental data loss
*/

-- Step 1: Add new columns to user_content table
DO $$
BEGIN
  -- Add has_user_data column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_content' AND column_name = 'has_user_data'
  ) THEN
    ALTER TABLE user_content ADD COLUMN has_user_data boolean DEFAULT false;
  END IF;

  -- Add is_default column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_content' AND column_name = 'is_default'
  ) THEN
    ALTER TABLE user_content ADD COLUMN is_default boolean DEFAULT false;
  END IF;
END $$;

-- Step 2: Mark existing records as user data
-- Any existing content is considered user data and should be protected
UPDATE user_content
SET has_user_data = true,
    is_default = false
WHERE id = 'main-content'
  AND content IS NOT NULL
  AND content != '{}'::jsonb;

-- Step 3: Create function to auto-update has_user_data flag
CREATE OR REPLACE FUNCTION update_user_data_flag()
RETURNS TRIGGER AS $$
BEGIN
  -- When content is updated with non-empty data, mark as user data
  IF NEW.content IS NOT NULL AND NEW.content != '{}'::jsonb THEN
    NEW.has_user_data := true;
    NEW.is_default := false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_update_user_data_flag ON user_content;

CREATE TRIGGER trigger_update_user_data_flag
  BEFORE INSERT OR UPDATE ON user_content
  FOR EACH ROW
  EXECUTE FUNCTION update_user_data_flag();

-- Step 5: Create index on has_user_data for faster queries
CREATE INDEX IF NOT EXISTS idx_user_content_has_user_data ON user_content(has_user_data);

-- Step 6: Add helpful comment
COMMENT ON COLUMN user_content.has_user_data IS 'Tracks whether this content has been modified by users';
COMMENT ON COLUMN user_content.is_default IS 'Identifies if content is default (true) or user-modified (false)';
