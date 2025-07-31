import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, ShoppingBag } from 'lucide-react'
import type { Product } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface ProductCardProps {
  product: Product
  showActions?: boolean
  className?: string
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showActions = true, 
  className = '' 
}) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      alert('Please login to add items to your cart')
      return
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .insert([
          { user_id: user.id, product_id: product.id, quantity: 1 }
        ])

      if (error) {
        if (error.code === '23505') {
          // Item already in cart, update quantity
          const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: 1 })
            .eq('user_id', user.id)
            .eq('product_id', product.id)

          if (updateError) throw updateError
          alert('Item quantity updated in cart!')
        } else {
          throw error
        }
      } else {
        alert('Added to cart!')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Unable to add item to cart. Please try again.')
    }
  }

  const addToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      alert('Please login to add items to your wishlist')
      return
    }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert([
          { user_id: user.id, product_id: product.id }
        ])

      if (error) {
        if (error.code === '23505') {
          alert('This item is already in your wishlist!')
        } else {
          throw error
        }
      } else {
        alert('Added to wishlist!')
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      alert('Unable to add item to wishlist. Please try again.')
    }
  }

  const buyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/product/${product.id}`)
  }

  return (
    <div className={`group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
          {showActions && (
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={addToCart}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                title="Add to Cart"
              >
                <ShoppingCart size={20} className="text-gray-600" />
              </button>
              <button
                onClick={buyNow}
                className="p-2 bg-black text-white rounded-full shadow-md hover:bg-gray-800 transition-colors"
                title="Buy Now"
              >
                <ShoppingBag size={20} />
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            <button
              onClick={buyNow}
              className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard