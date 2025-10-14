/*
  # Create Vehicles Table

  ## Overview
  This migration creates the vehicles table for the TuCarrito.com platform
  to store vehicle listings published by sellers.

  ## New Tables
  
  ### `vehicles`
  - `id` (uuid, primary key) - Unique identifier for the vehicle
  - `user_id` (uuid) - Links to auth.users (seller)
  - `user_email` (text) - Seller's email for contact
  - `user_name` (text) - Seller's name
  - `user_phone` (text) - Seller's phone for contact
  - `brand` (text) - Vehicle brand (e.g., Toyota, Chevrolet)
  - `model` (text) - Vehicle model (e.g., Corolla, Spark)
  - `year` (integer) - Manufacturing year
  - `price` (numeric) - Price in COP
  - `description` (text) - Detailed description of the vehicle
  - `mileage` (integer) - Kilometers traveled
  - `transmission` (text) - 'manual' or 'automatic'
  - `fuel_type` (text) - 'gasoline', 'diesel', 'electric', or 'hybrid'
  - `images` (text[]) - Array of image URLs or base64 encoded strings
  - `status` (text) - 'active', 'sold', or 'inactive'
  - `created_at` (timestamptz) - Publication timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on `vehicles` table
  - Policy: Anyone can read active vehicles
  - Policy: Users can insert their own vehicles if they are sellers
  - Policy: Users can update their own vehicles
  - Policy: Users can delete their own vehicles

  ## Indexes
  - Create index on user_id for efficient queries
  - Create index on status for filtering active vehicles
  - Create index on brand and model for search functionality
  - Create index on price for price-based filtering
*/

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  user_name text NOT NULL,
  user_phone text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  price numeric NOT NULL CHECK (price > 0),
  description text,
  mileage integer DEFAULT 0 CHECK (mileage >= 0),
  transmission text NOT NULL CHECK (transmission IN ('manual', 'automatic')),
  fuel_type text NOT NULL CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')),
  images text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active vehicles
CREATE POLICY "Anyone can view active vehicles"
  ON vehicles
  FOR SELECT
  USING (status = 'active');

-- Policy: Sellers can view all their own vehicles
CREATE POLICY "Users can view their own vehicles"
  ON vehicles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Sellers can insert their own vehicles
CREATE POLICY "Sellers can insert vehicles"
  ON vehicles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND user_type IN ('seller', 'both')
      AND validation_status = 'approved'
    )
  );

-- Policy: Users can update their own vehicles
CREATE POLICY "Users can update their own vehicles"
  ON vehicles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own vehicles
CREATE POLICY "Users can delete their own vehicles"
  ON vehicles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_model ON vehicles(model);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE vehicles IS 'Vehicle listings published by sellers on TuCarrito.com platform';
