import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { supabase, Product, type Product as ProductType } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { usePayment } from '../hooks/usePayment'
import { useCart } from '../hooks/useCart'
import EnhancedQRGenerator from '../components/EnhancedQRGenerator'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { user } = useAuth()
  const { processPayment, processing } = usePayment()
  const { addToCart: addToCartHook } = useCart()
  const navigate = useNavigate()

  // Mock multiple images for demonstration
  const productImages = product ? [
    product.image_url,
    // Add some variation for demo - in real app these would be different images
    product.image_url.replace('w=800', 'w=800&sat=-20'),
    product.image_url.replace('w=800', 'w=800&blur=1'),
    product.image_url.replace('w=800', 'w=800&sepia=50'),
  ] : []

  useEffect(() => {
    if (id) {
      fetchProduct()
      fetchRelatedProducts()
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

  const fetchRelatedProducts = async () => {
    if (!product) return

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(4)

      if (error) throw error
      setRelatedProducts(data || [])
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  useEffect(() => {
    if (product) {
      fetchRelatedProducts()
    }
  }, [product])

  const addToCart = async () => {
    if (!user) {
      alert('Please login to add items to your cart')
      navigate('/auth')
      return
    }

    if (!product) return

    setAddingToCart(true)
    try {
      const result = await addToCartHook(product.id, 1)
      if (!result.success) {
        alert(result.error || 'Failed to add item to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Unable to add item to cart. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  const buyNow = async () => {
    if (!user) {
      alert('Please login to make a purchase')
      navigate('/auth')
      return
    }

    if (!product) return

    try {
      setShowPaymentModal(true)
    } catch (error) {
      console.error('Error initiating buy now:', error)
      alert('Unable to proceed with purchase. Please try again.')
    }
  }

  const handlePaymentSuccess = async () => {
    if (!product || !user) return

    try {
      const paymentData = {
        amount: product.price,
        items: [{
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1
        }],
        paymentMethod: 'phonepe' as const
      }

      const result = await processPayment(paymentData)
      
      if (result.success) {
        // Close payment modal first
        setShowPaymentModal(false)
        
        // Show success message
        alert('Payment successful! Your order has been placed.')
        
        // Navigate to orders page
        navigate('/dashboard?tab=orders')
      } else {
        alert(`Payment failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert('An error occurred during purchase. Please try again.')
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
    <div className="min-h-screen bg-gray-50">
      {/* Product Detail Section */}
      <section className="py-8 bg-white">
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
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              {/* Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Category Badge */}
              <div>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full capitalize mb-4">
                  {product.category}
                </span>
              </div>
              
              {/* Product Title and Price */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price}
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(4.8) 124 reviews</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">In Stock</span>
                <span className="text-gray-500">• Fast Delivery Available</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={buyNow}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center space-x-2 px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <ShoppingCart size={20} />
                  <span>{processing ? 'Processing...' : 'Buy Now'}</span>
                </button>
                
                <button
                  onClick={addToCart}
                  disabled={addingToCart}
                  className="flex-1 flex items-center justify-center space-x-2 px-8 py-4 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                >
                  <ShoppingCart size={20} />
                  <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </button>
              </div>

              {/* Product Features */}
              <div className="pt-6 border-t border-gray-200">
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
              
              {/* Shipping Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Shipping Information</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Free delivery on orders above ₹500</li>
                  <li>• Standard delivery: 3-5 business days</li>
                  <li>• Express delivery: 1-2 business days</li>
                  <li>• Easy returns within 30 days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You May Also Like Section */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <Link to={`/product/${relatedProduct.id}`}>
                    <img
                      src={relatedProduct.image_url}
                      alt={relatedProduct.title}
                      className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {relatedProduct.title}
                      </h3>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{relatedProduct.price}
                      </p>
                      <button className="mt-2 w-full py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors">
                        Quick View
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Payment Modal */}
      {showPaymentModal && product && (
        <EnhancedQRGenerator
          amount={product.price}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          merchantName="DAYKART"
          merchantUPI="9652377187-2@ybl"
          merchantId="Saviti PS Murthy"
        />
      )}
    </div>
  )
}

export default ProductDetail