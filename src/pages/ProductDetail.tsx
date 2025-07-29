import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react'
import { supabase, Product } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Footer from '../components/Footer'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addingToWishlist, setAddingToWishlist] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    if (!id) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    if (!user) {
      alert('Please login to add items to your cart')
      navigate('/auth')
      return
    }

    if (!product) return

    setAddingToCart(true)
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
    } finally {
      setAddingToCart(false)
    }
  }

  const addToWishlist = async () => {
    if (!user) {
      alert('Please login to add items to your wishlist')
      navigate('/auth')
      return
    }

    if (!product) return

    setAddingToWishlist(true)
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
    } finally {
      setAddingToWishlist(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Return to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Product Detail Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full capitalize mb-4">
                  {product.category}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>
                <p className="text-3xl font-bold text-gray-900 mb-6">
                  ₹{product.price}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={addToCart}
                  disabled={addingToCart}
                  className="flex-1 flex items-center justify-center space-x-2 px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <ShoppingCart size={20} />
                  <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </button>
                
                <button
                  onClick={addToWishlist}
                  disabled={addingToWishlist}
                  className="flex-1 flex items-center justify-center space-x-2 px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Heart size={20} />
                  <span>{addingToWishlist ? 'Adding...' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Product Features */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    High-quality materials
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Durable construction
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Perfect for hostel use
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Easy maintenance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ProductDetail