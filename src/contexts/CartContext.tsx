import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import type { CartItem, Product } from '../types'

interface CartContextType {
  cartItems: CartItem[]
  cartItemsCount: number
  loading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<{ success: boolean; error?: string }>
  removeFromCart: (itemId: string) => Promise<{ success: boolean; error?: string }>
  updateCartQuantity: (itemId: string, quantity: number) => Promise<{ success: boolean; error?: string }>
  clearCart: () => Promise<{ success: boolean; error?: string }>
  refreshCart: () => Promise<void>
  getTotalAmount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([])
      return
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products(*)
        `)
        .eq('user_id', user.id)

      if (error) throw error
      setCartItems(data || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCartItems([])
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    if (!user) {
      showNotification('Please login to add items to cart', 'error')
      return { success: false, error: 'User not authenticated' }
    }

    setLoading(true)
    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.product_id === productId)
      
      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)

        if (error) throw error
        showNotification('Cart updated!')
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert([
            { user_id: user.id, product_id: productId, quantity }
          ])

        if (error) throw error
        showNotification('Added to cart!')
      }

      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error('Error adding to cart:', error)
      showNotification('Failed to add to cart', 'error')
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add to cart' }
    } finally {
      setLoading(false)
    }
  }, [user, cartItems, fetchCart])

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (error) throw error

      showNotification('Removed from cart!')
      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error('Error removing from cart:', error)
      showNotification('Failed to remove from cart', 'error')
      return { success: false, error: error instanceof Error ? error.message : 'Failed to remove from cart' }
    }
  }, [user, fetchCart])

  const updateCartQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (error) throw error

      showNotification('Cart updated!')
      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error('Error updating cart quantity:', error)
      showNotification('Failed to update cart', 'error')
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update quantity' }
    }
  }, [user, fetchCart])

  const clearCart = useCallback(async () => {
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setCartItems([])
      showNotification('Cart cleared!')
      return { success: true }
    } catch (error) {
      console.error('Error clearing cart:', error)
      showNotification('Failed to clear cart', 'error')
      return { success: false, error: error instanceof Error ? error.message : 'Failed to clear cart' }
    }
  }, [user])

  const refreshCart = useCallback(async () => {
    await fetchCart()
  }, [fetchCart])

  const getTotalAmount = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.products?.price || 0
      return total + (price * item.quantity)
    }, 0)
  }, [cartItems])

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const value = {
    cartItems,
    cartItemsCount,
    loading,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    refreshCart,
    getTotalAmount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}