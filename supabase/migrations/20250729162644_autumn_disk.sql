/*
  # Add is_featured column to products table

  1. Changes
    - Add `is_featured` boolean column to products table with default value false
    - Update existing products to set some as featured for demonstration

  2. Security
    - No RLS changes needed as products table policies already exist
*/

-- Add is_featured column to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE products ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;

-- Update some existing products to be featured for demonstration
UPDATE products 
SET is_featured = true 
WHERE title IN (
  'Luxury Memory Foam Mattress',
  'Smart Shower System', 
  'Smart Home Hub'
) AND is_featured IS NOT NULL;