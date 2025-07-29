/*
  # Create DayKart eCommerce Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `title` (text, product name)
      - `image_url` (text, product image)  
      - `price` (numeric, product price)
      - `description` (text, product description)
      - `category` (text, product category)
      - `created_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_ids` (text array, list of product IDs)
      - `status` (text, order status)
      - `total_amount` (numeric, total order value)
      - `created_at` (timestamp)

    - `cart`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (uuid, references products)
      - `quantity` (integer, item quantity)
      - `created_at` (timestamp)

    - `wishlist`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `product_id` (uuid, references products)
      - `created_at` (timestamp)

    - `subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique email)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to products
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'beds',
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_ids text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Products policies (public read, no restrictions for admin operations)
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Products can be inserted by anyone"
  ON products
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Products can be updated by anyone"
  ON products
  FOR UPDATE
  TO authenticated, anon
  USING (true);

CREATE POLICY "Products can be deleted by anyone"
  ON products
  FOR DELETE
  TO authenticated, anon
  USING (true);

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Orders can be viewed by everyone"
  ON orders
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Orders can be deleted by anyone"
  ON orders
  FOR DELETE
  TO authenticated, anon
  USING (true);

-- Cart policies
CREATE POLICY "Users can manage their own cart"
  ON cart
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users can manage their own wishlist"
  ON wishlist
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Subscribers policies
CREATE POLICY "Anyone can subscribe"
  ON subscribers
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Subscribers are viewable by everyone"
  ON subscribers
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Insert sample products
INSERT INTO products (title, image_url, price, description, category) VALUES
  ('Luxury Memory Foam Mattress', 'https://images.pexels.com/photos/6899224/pexels-photo-6899224.jpeg?auto=compress&cs=tinysrgb&w=800', 199, 'Premium memory foam mattress with cooling technology for the perfect night''s sleep.', 'beds'),
  ('Smart Shower System', 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 299, 'Digital shower system with temperature control and water-saving technology.', 'bathware'),
  ('Smart Home Hub', 'https://images.pexels.com/photos/4238516/pexels-photo-4238516.jpeg?auto=compress&cs=tinysrgb&w=800', 199, 'Central control hub for all your smart home devices with voice control.', 'dorm'),
  ('Premium Desk Organizer', 'https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&cs=tinysrgb&w=800', 49, 'Elegant wooden desk organizer to keep your workspace tidy and organized.', 'stationary'),
  ('Modern Bedside Table', 'https://images.pexels.com/photos/1034596/pexels-photo-1034596.jpeg?auto=compress&cs=tinysrgb&w=800', 129, 'Minimalist bedside table with built-in wireless charging pad.', 'beds'),
  ('Premium Notebook Set', 'https://images.pexels.com/photos/159711/notes-macbook-study-conference-159711.jpeg?auto=compress&cs=tinysrgb&w=800', 25, 'High-quality notebook set perfect for students and professionals.', 'stationary')
ON CONFLICT DO NOTHING;