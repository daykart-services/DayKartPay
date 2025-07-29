/*
  # Complete DayKart eCommerce Schema

  1. New Tables
    - `categories` - Product categories with slug-based routing
    - Enhanced `products` table with featured status and proper relationships
    - `profiles` - User profiles linked to auth.users
    - `cart_items` - Shopping cart functionality
    - `wishlist_items` - User wishlist functionality
    - `orders` - Order management system
    - `newsletter_subscribers` - Newsletter subscription

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admin access
    - Proper foreign key relationships

  3. Sample Data
    - Categories for all product types
    - Sample products for each category
    - Admin user profile setup
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enhanced products table
DO $$
BEGIN
  -- Add is_featured column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE products ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
  
  -- Add category_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE products ADD COLUMN category_id uuid REFERENCES categories(id);
  END IF;
END $$;

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table if not exists
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create wishlist_items table if not exists
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table if not exists
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  products jsonb NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create newsletter_subscribers table if not exists
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, admin write)
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Cart items policies
CREATE POLICY "Users can manage own cart items"
  ON cart_items FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Wishlist items policies
CREATE POLICY "Users can manage own wishlist items"
  ON wishlist_items FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Orders policies
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Newsletter subscribers policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read newsletter subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
  ('Beds', 'beds', 'Comfortable beds and mattresses for hostel rooms'),
  ('Stationary', 'stationary', 'Essential stationery items for students'),
  ('Bathware', 'bathware', 'Bathroom essentials and accessories'),
  ('Dorm', 'dorm', 'Dorm room essentials and furniture'),
  ('New Collections', 'new-collections', 'Latest arrivals and trending products')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (title, description, image_url, price, category, is_featured) VALUES
  (
    'Luxury Memory Foam Mattress',
    'Premium memory foam mattress with cooling technology for the perfect night''s sleep. Designed specifically for hostel comfort.',
    'https://images.pexels.com/photos/6899224/pexels-photo-6899224.jpeg?auto=compress&cs=tinysrgb&w=800',
    199.00,
    'beds',
    true
  ),
  (
    'Smart Shower System',
    'Digital shower system with temperature control and water-saving technology. Perfect for modern hostel bathrooms.',
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    299.00,
    'bathware',
    true
  ),
  (
    'Smart Home Hub',
    'Central control hub for all your smart home devices with voice control. Ideal for tech-savvy students.',
    'https://images.pexels.com/photos/4238516/pexels-photo-4238516.jpeg?auto=compress&cs=tinysrgb&w=800',
    199.00,
    'dorm',
    true
  ),
  (
    'Premium Study Desk',
    'Ergonomic study desk with built-in storage and cable management. Perfect for long study sessions.',
    'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800',
    149.00,
    'stationary',
    false
  ),
  (
    'Compact Wardrobe',
    'Space-saving wardrobe solution for small hostel rooms. Includes hanging space and drawers.',
    'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
    179.00,
    'new-collections',
    false
  ),
  (
    'Orthopedic Pillow Set',
    'Set of 2 orthopedic pillows designed for optimal neck and spine support during sleep.',
    'https://images.pexels.com/photos/1034596/pexels-photo-1034596.jpeg?auto=compress&cs=tinysrgb&w=800',
    49.00,
    'beds',
    false
  ),
  (
    'Waterproof Shower Caddy',
    'Rust-resistant shower caddy with multiple compartments for all your bathroom essentials.',
    'https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=800',
    29.00,
    'bathware',
    false
  ),
  (
    'LED Desk Lamp',
    'Adjustable LED desk lamp with USB charging port and multiple brightness levels.',
    'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800',
    39.00,
    'stationary',
    false
  )
ON CONFLICT DO NOTHING;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();