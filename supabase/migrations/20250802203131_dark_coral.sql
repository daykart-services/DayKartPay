/*
  # Fix profiles RLS policies

  1. Security
    - Enable RLS on profiles table
    - Add policy for users to insert their own profile
    - Add policy for users to view their own profile
    - Add policy for users to update their own profile
*/

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create policy for INSERT operations
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policy for SELECT operations
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policy for UPDATE operations
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow public read access to referral codes for referral system
CREATE POLICY "Public can read referral codes"
  ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (referral_code IS NOT NULL);