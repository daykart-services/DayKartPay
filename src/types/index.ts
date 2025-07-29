// Type definitions for DayKart eCommerce application

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  created_at: string
}

export interface Product {
  id: string
  title: string
  description: string
  image_url: string
  price: number
  category: string
  category_id?: string
  is_featured: boolean
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  is_admin: boolean
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  products?: Product
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  products?: Product
}

export interface Order {
  id: string
  user_id: string
  products: any[]
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_method?: string
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  subscribed_at: string
}