import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, ShoppingBag, Loader } from 'lucide-react'
import type { Product } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../hooks/useCart'

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
      navigate('/auth')
      return
    }

    setIsAddingToCart(true)
    try {
      await addToCart(product.id, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/product/${product.id}`)
  }

  return (
    <div className={`group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 ${className}`}>
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-64 object-cover object-center group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Featured Badge */}
          {product.is_featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
                Featured
              </span>
            </div>
          )}

          {/* Hover Actions */}
          {showActions && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                  title="Add to Cart"
                >
                  {isAddingToCart ? (
                    <Loader size={20} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={20} />
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                  title="Buy Now"
                >
                  <ShoppingBag size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {product.category}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {(product as any).stock_quantity !== undefined && (
                <span className="text-xs text-gray-500">
                  {(product as any).stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              )}
            </div>
            
            <button
              onClick={handleBuyNow}
              className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
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