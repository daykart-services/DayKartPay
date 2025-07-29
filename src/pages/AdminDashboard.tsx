import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Package, Users } from 'lucide-react'
import { supabase, Product, Order } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { isAdmin } = useAuth()

  const [productForm, setProductForm] = useState({
    title: '',
    image_url: '',
    price: '',
    description: '',
    category: 'beds',
    is_featured: false
  })

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      setProducts(productsData || [])
      setOrders(ordersData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const productData = {
        title: productForm.title,
        image_url: productForm.image_url,
        price: parseFloat(productForm.price),
        description: productForm.description,
        category: productForm.category,
        is_featured: productForm.is_featured
      }

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])
        
        if (error) throw error
      }

      setProductForm({ 
        title: '', 
        image_url: '', 
        price: '', 
        description: '', 
        category: 'beds',
        is_featured: false 
      })
      setShowProductForm(false)
      setEditingProduct(null)
      fetchData()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Error deleting order')
    }
  }

  const startEdit = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      title: product.title,
      image_url: product.image_url,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      is_featured: product.is_featured
    })
    setShowProductForm(true)
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">ADMIN DASHBOARD</h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center space-x-8 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 pb-2 border-b-2 ${
              activeTab === 'products' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package size={20} />
            <span className="font-medium">Products ({products.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 pb-2 border-b-2 ${
              activeTab === 'orders' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users size={20} />
            <span className="font-medium">Orders ({orders.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'products' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Product Management</h2>
                <button
                  onClick={() => {
                    setShowProductForm(true)
                    setEditingProduct(null)
                    setProductForm({ 
                      title: '', 
                      image_url: '', 
                      price: '', 
                      description: '', 
                      category: 'beds',
                      is_featured: false 
                    })
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Plus size={20} />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Product Form Modal */}
              {showProductForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-bold mb-4">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={productForm.title}
                          onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                          type="url"
                          value={productForm.image_url}
                          onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="beds">Beds</option>
                          <option value="stationery">Stationery</option>
                          <option value="books">Books</option>
                          <option value="bathware">Bathware</option>
                          <option value="dorm">Dorm</option>
                        </select>
                      </div>
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={productForm.is_featured}
                            onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Featured Product</span>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          required
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          {editingProduct ? 'Update' : 'Add'} Product
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProductForm(false)
                            setEditingProduct(null)
                          }}
                          className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Products List */}
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                      {product.is_featured && (
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            Featured
                          </span>
                        </div>
                      )}
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded mb-4"
                      />
                      <h3 className="font-medium mb-2">{product.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                      <p className="text-lg font-semibold mb-2">₹{product.price}</p>
                      <p className="text-sm text-gray-500 mb-4 capitalize">{product.category}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(product)}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600">Add your first product to get started!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">Order Management</h2>
              
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-gray-600">User ID: {order.user_id}</p>
                          <p className="text-gray-600">Status: <span className="capitalize">{order.status}</span></p>
                          <p className="text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                          <p className="text-gray-600">Products: {order.product_ids.length} items</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">₹{order.total_amount}</p>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="mt-2 flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600">Customer orders will appear here!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard