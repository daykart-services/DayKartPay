/*
  # Add image_urls column to products table

  1. Changes
    - Add `image_urls` column of type text[] (text array) to products table
    - Set default value to empty array for existing records
    - Allow storing multiple image URLs for each product

  2. Security
    - No RLS changes needed as existing policies cover the new column
*/

-- Add image_urls column to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image_urls'
  ) THEN
    ALTER TABLE products ADD COLUMN image_urls text[] DEFAULT '{}';
  END IF;
END $$;

-- Update existing products to populate image_urls with current image_url
UPDATE products 
SET image_urls = ARRAY[image_url] 
WHERE image_urls IS NULL OR image_urls = '{}';