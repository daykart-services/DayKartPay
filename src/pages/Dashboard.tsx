import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ShoppingCart, Heart, Package, User, Gift } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, CartItem, WishlistItem, Order } from '../lib/supabase'
import { usePayment } from '../hooks/usePayment'
import { useCart } from '../hooks/useCart'
import EnhancedQRGenerator from '../components/EnhancedQRGenerator'
import ReferralSystem from '../components/ReferralSystem'

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams()
  const initialTab = (searchParams.get('tab') as 'profile' | 'cart' | 'liked' | 'orders' | 'referrals') || 'profile'
  const [activeTab, setActiveTab] = useState<'profile' | 'cart' | 'liked' | 'orders' | 'referrals'>(initialTab)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  })
  const [editingProfile, setEditingProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const { user } = useAuth()
  const { processPayment, processing } = usePayment()
  const { removeFromCart: removeCartItem } = useCart()

  useEffect(() => {
    // Update tab from URL params
    const tab = searchParams.get('tab') as 'profile' | 'cart' | 'liked' | 'orders' | 'referrals'
    if (tab && ['profile', 'cart', 'liked', 'orders', 'referrals'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

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

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setCartItems(cartData || [])
      setWishlistItems(wishlistData || [])
      setOrders(ordersData || [])
      
      if (profileData) {
        setProfile({
          fullName: profileData.full_name || '',
          email: profileData.email || user.email || '',
          phone: profileData.phone || '',
          address: profileData.address || ''
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const result = await removeCartItem(itemId)
      if (result.success) {
        fetchUserData()
      } else {
        alert(result.error || 'Failed to remove item from cart')
      }
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

  const updateProfile = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          phone: profile.phone,
          address: profile.address
        })
        .eq('id', user.id)

      if (error) throw error
      setEditingProfile(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
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

    try {
      setPaymentAmount(total)
      setShowPaymentModal(true)
    } catch (error) {
      console.error('Error initiating checkout:', error)
      alert('Unable to proceed to checkout. Please try again.')
    }
  }

  const handlePaymentSuccess = async () => {
    if (!user) {
      alert('Please login to complete payment')
      return
    }

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
        // Close payment modal first
        setShowPaymentModal(false)
        
        // Show success message
        alert('Payment successful! Your order has been placed.')
        
        // Refresh data to show updated cart and orders
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
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 pb-2 border-b-2 ${
              activeTab === 'profile' 
                ? 'border-black text-black' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <User size={20} />
            <span className="font-medium">Profile</span>
          </button>
          
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
          
          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex items-center space-x-2 pb-2 border-b-2 ${
              activeTab === 'referrals' 
                ? 'border-black text-black' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Gift size={20} />
            <span className="font-medium">Referrals</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm min-h-96">
          {activeTab === 'profile' && (
            <div className="p-8">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
                  <button
                    onClick={() => editingProfile ? updateProfile() : setEditingProfile(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingProfile ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {editingProfile ? (
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.fullName || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <p className="text-gray-900 py-2">{profile.email}</p>
                    <p className="text-sm text-gray-500">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {editingProfile ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complete Address
                    </label>
                    {editingProfile ? (
                      <textarea
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your complete address"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.address || 'Not provided'}</p>
                    )}
                  </div>

                  {editingProfile && (
                    <div className="flex space-x-4">
                      <button
                        onClick={updateProfile}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingProfile(false)}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
                </div>
              ) : (
                <div>
                  <div className="text-center py-12">
                    <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600">Start shopping and add items to your cart!</p>
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
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-gray-600 mt-1">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              order.order_status === 'pending' ? 'bg-gray-100 text-gray-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {(order.order_status || order.status || 'pending').charAt(0).toUpperCase() + (order.order_status || order.status || 'pending').slice(1)}
                            </span>
                          </p>
                          <p className="text-gray-600 mt-2">
                            Ordered on {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">₹{order.total_amount}</p>
                          <p className="text-sm text-gray-500">Total Amount</p>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      {order.products && Array.isArray(order.products) && order.products.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-gray-900 mb-3">Items ({order.products.length})</h4>
                          <div className="space-y-2">
                            {order.products.slice(0, 3).map((item: any, index: number) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">{item.title || `Item ${index + 1}`}</span>
                                <span className="text-gray-600">
                                  {item.quantity ? `${item.quantity}x ` : ''}₹{item.price || 0}
                                </span>
                              </div>
                            ))}
                            {order.products.length > 3 && (
                              <p className="text-sm text-gray-500">
                                +{order.products.length - 3} more items
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600">Your order history will appear here!</p>
                  <Link
                    to="/products"
                    className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="p-8">
              <ReferralSystem />
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
          merchantUPI="9652377187-2@ybl"
          merchantId="Saviti PS Murthy"
        />
      )}
    </div>
  )
}

export default Dashboard