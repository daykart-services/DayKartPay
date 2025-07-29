/*
  # Add payment_method column to orders table

  1. Changes
    - Add `payment_method` column to `orders` table
    - Set default value to 'phonepe' for existing records
    - Allow text values like 'phonepe', 'upi', 'card', etc.

  2. Security
    - No RLS changes needed as existing policies cover the new column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_method text DEFAULT 'phonepe';
  END IF;
END $$;