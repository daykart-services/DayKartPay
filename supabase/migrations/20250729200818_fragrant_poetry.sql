/*
  # Update product categories

  1. Changes
    - Update existing 'stationary' category to 'stationery'
    - Add 'books' category
    - Remove 'new-collections' category (products moved to other categories)

  2. Data Migration
    - Update existing products with old category names
    - Ensure all products have valid categories
*/

-- Update stationary to stationery
UPDATE products 
SET category = 'stationery' 
WHERE category = 'stationary';

-- Update new-collections to books (or distribute to other categories)
UPDATE products 
SET category = 'books' 
WHERE category = 'new-collections';

-- Add some sample products if none exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products LIMIT 1) THEN
    INSERT INTO products (title, description, image_url, price, category, is_featured) VALUES
    ('Comfortable Single Bed', 'Perfect single bed for hostel rooms with sturdy construction', 'https://images.pexels.com/photos/1034596/pexels-photo-1034596.jpeg?auto=compress&cs=tinysrgb&w=800', 5999.00, 'beds', true),
    ('Study Desk Lamp', 'Adjustable LED desk lamp for late night studies', 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800', 899.00, 'stationery', true),
    ('Academic Notebook Set', 'Set of 5 high-quality notebooks for different subjects', 'https://images.pexels.com/photos/159751/book-address-book-learning-learn-159751.jpeg?auto=compress&cs=tinysrgb&w=800', 299.00, 'books', false),
    ('Bathroom Essentials Kit', 'Complete bathroom kit with towels and accessories', 'https://images.pexels.com/photos/6899224/pexels-photo-6899224.jpeg?auto=compress&cs=tinysrgb&w=800', 1299.00, 'bathware', true),
    ('Dorm Storage Box', 'Multi-purpose storage solution for dorm rooms', 'https://images.pexels.com/photos/4857781/pexels-photo-4857781.jpeg?auto=compress&cs=tinysrgb&w=800', 799.00, 'dorm', false),
    ('Premium Mattress', 'Orthopedic mattress for comfortable sleep', 'https://images.pexels.com/photos/1034596/pexels-photo-1034596.jpeg?auto=compress&cs=tinysrgb&w=800', 8999.00, 'beds', true);
  END IF;
END $$;