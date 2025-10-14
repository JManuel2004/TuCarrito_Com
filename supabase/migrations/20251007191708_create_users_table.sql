/*
  # Create Users Registration and Validation System

  ## Overview
  This migration creates the necessary tables and security policies for user registration 
  with simulated identity verification for the TuCarrito.com platform.

  ## New Tables
  
  ### `user_profiles`
  - `id` (uuid, primary key) - Links to auth.users
  - `full_name` (text) - User's full name
  - `email` (text) - User's email address
  - `phone` (text) - Contact phone number
  - `id_number` (text) - Identity document number
  - `user_type` (text) - Either 'buyer' or 'seller'
  - `validation_status` (text) - Status: 'pending', 'approved', 'rejected'
  - `created_at` (timestamptz) - Registration timestamp
  - `validated_at` (timestamptz) - Validation completion timestamp

  ## Security
  - Enable RLS on `user_profiles` table
  - Policy: Users can read their own profile
  - Policy: Users can insert their own profile during registration
  - Policy: Users can update their own profile (except validation_status)

  ## Important Notes
  - The validation_status defaults to 'pending' to simulate identity verification
  - Users cannot login (access platform) until validation_status is 'approved'
  - No external services are connected - this is a simulated validation process
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  id_number text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('buyer', 'seller')),
  validation_status text NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  validated_at timestamptz,
  UNIQUE(email),
  UNIQUE(id_number)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Anyone can insert during registration (before auth)
CREATE POLICY "Anyone can create profile during registration"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile (but not validation_status)
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    validation_status = (SELECT validation_status FROM user_profiles WHERE id = auth.uid())
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_validation_status ON user_profiles(validation_status);