import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, ShoppingBag } from 'lucide-react'
import type { Product } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

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
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      alert('Please login to add items to your cart')
      navigate('/auth')
      return
    }

    setIsAddingToCart(true)
    try {
      const result = await addToCart(product.id, 1)
      if (!result.success) {
        alert(result.error || 'Failed to add item to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Unable to add item to cart. Please try again.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      alert('Please login to make a purchase')
      navigate('/auth')
      return
    }
    
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
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Add to Cart"
              >
                <ShoppingCart size={20} className="text-gray-600" />
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
            <div className="flex space-x-2">
              <button
                onClick={handleBuyNow}
                className="px-3 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-1"
              >
                <ShoppingBag size={16} />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard