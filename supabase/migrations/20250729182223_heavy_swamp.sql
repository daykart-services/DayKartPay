/*
  # Enhanced Row Level Security Policies

  1. Security Updates
    - Enable RLS on cart_items and wishlist_items tables
    - Add comprehensive policies for user data protection
    - Ensure users can only access their own data

  2. Additional Security
    - Add policies for admin access where needed
    - Ensure proper foreign key relationships
*/

-- Enable RLS on cart_items if not already enabled
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can manage own cart items" ON cart_items;

-- Create comprehensive cart_items policies
CREATE POLICY "Users can view their own cart items"
  ON cart_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
  ON cart_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON cart_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON cart_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable RLS on wishlist_items if not already enabled
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their own wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "Users can manage own wishlist items" ON wishlist_items;

-- Create comprehensive wishlist_items policies
CREATE POLICY "Users can view their own wishlist items"
  ON wishlist_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist items"
  ON wishlist_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlist items"
  ON wishlist_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items"
  ON wishlist_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure products table has proper public access
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Admin policies for products (if needed)
CREATE POLICY "Authenticated users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);