import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Package } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, CartItem, WishlistItem, Order } from '../lib/supabase'
import { usePayment } from '../hooks/usePayment'
import EnhancedQRGenerator from '../components/EnhancedQRGenerator'
import Footer from '../components/Footer'

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cart' | 'liked' | 'orders'>('cart')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const { user } = useAuth()
  const { processPayment, processing } = usePayment()

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Fetch cart items
      const { data: cartData } = await supabase
        .from('cart_items')
        .select(`
          *,
          products(*)
        `)
        .eq('user_id', user.id)

      // Fetch wishlist items
      const { data: wishlistData } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          products(*)
        `)
        .eq('user_id', user.id)

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setCartItems(cartData || [])
      setWishlistItems(wishlistData || [])
      setOrders(ordersData || [])
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId: string) => {
    if (!user) {
      alert('Please login to manage your cart')
      return
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id) // Additional security check

      if (error) throw error
      fetchUserData()
    } catch (error) {
      console.error('Error removing from cart:', error)
      alert('Unable to remove item from cart. Please try again.')
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    if (!user) {
      alert('Please login to manage your wishlist')
      return
    }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id) // Additional security check

      if (error) throw error
      fetchUserData()
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      alert('Unable to remove item from wishlist. Please try again.')
    }
  }

  const getTotalCartValue = () => {
    return cartItems.reduce((total, item) => {
      const price = item.products?.price || 0
      return total + (price * item.quantity)
    }, 0)
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    const total = getTotalCartValue()
    if (total <= 0) {
      alert('Invalid cart total')
      return
    }

    setPaymentAmount(total)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async () => {
    try {
      const paymentData = {
        amount: paymentAmount,
        items: cartItems.map(item => ({
          id: item.product_id,
          title: item.products?.title,
          price: item.products?.price,
          quantity: item.quantity
        })),
        paymentMethod: 'phonepe' as const
      }

      const result = await processPayment(paymentData)
      
      if (result.success) {
        alert('Payment successful! Your order has been placed.')
        fetchUserData() // Refresh data to show updated cart and orders
      } else {
        alert(`Payment failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred during checkout. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">DASHBOARD</h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center space-x-8 mb-8">
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex items-center space-x-2 pb-2 border-b-2 ${
              activeTab === 'cart' 
                ? 'border-black text-black' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ShoppingCart size={20} />
            <span className="font-medium">Cart ({cartItems.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('liked')}
            className={`flex items-center space-x-2 pb-2 border-b-2 ${
              activeTab === 'liked' 
                ? 'border-black text-black' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Heart size={20} />
            <span className="font-medium">Liked ({wishlistItems.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 pb-2 border-b-2 ${
              activeTab === 'orders' 
                ? 'border-black text-black' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package size={20} />
            <span className="font-medium">Orders</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm min-h-96">
          {activeTab === 'cart' && (
            <div className="p-8">
              {cartItems.length > 0 ? (
                <div>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.products?.image_url || 'https://images.pexels.com/photos/1034596/pexels-photo-1034596.jpeg?auto=compress&cs=tinysrgb&w=200'}
                          alt={item.products?.title || 'Product'}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.products?.title || 'Unknown Product'}</h3>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-lg font-semibold">₹{(item.products?.price || 0) * item.quantity}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total: ₹{getTotalCartValue()}</span>
                      <button 
                        onClick={handleCheckout}
                        disabled={processing}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing ? 'Processing...' : 'Checkout'}
                      </button>
                    </div>
                  </div>
                  {/* Add Footer to Cart Section */}
                  <div className="mt-12">
                    <Footer />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center py-12">
                    <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600">Start shopping and add items to your cart!</p>
                  </div>
                  {/* Add Footer to Empty Cart */}
                  <div className="mt-12">
                    <Footer />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="p-8">
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={item.products?.image_url || 'https://images.pexels.com/photos/1034596/pexels-photo-1034596.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={item.products?.title || 'Product'}
                        className="w-full h-48 object-cover rounded mb-4"
                      />
                      <h3 className="font-medium mb-2">{item.products?.title || 'Unknown Product'}</h3>
                      <p className="text-lg font-semibold mb-4">₹{item.products?.price || 0}</p>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="w-full py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
                      >
                        Remove from Wishlist
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No liked items</h3>
                  <p className="text-gray-600">Add products to your wishlist to see them here!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="p-8">
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-gray-600">Status: {order.status}</p>
                          <p className="text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">₹{order.total_amount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600">Your order history will appear here!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <EnhancedQRGenerator
          amount={paymentAmount}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
          merchantName="DAYKART"
          merchantUPI="merchant@phonepe"
          merchantId="DAYKART001"
        />
      )}
      
      <Footer />
    </div>
  )
}

export default Dashboard