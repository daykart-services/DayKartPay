import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useCart = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchCartCount = useCallback(async () => {
    if (!user) {
      setCartItemsCount(0)
      return
    }

    try {
      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (error) throw error
      setCartItemsCount(count || 0)
    } catch (error) {
      console.error('Error fetching cart count:', error)
      setCartItemsCount(0)
    }
  }, [user])

  useEffect(() => {
    fetchCartCount()
  }, [fetchCartCount])

  useEffect(() => {
    if (!user) {
      setCartItemsCount(0)
      return
    }

    // Subscribe to real-time cart changes
    const subscription = supabase
      .channel('cart_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Cart change detected:', payload)
          fetchCartCount()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, fetchCartCount])

  // Show success notification
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-x-0 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`
    notification.textContent = message
    document.body.appendChild(notification)
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
    }, 10)
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('cart_items')
        .insert([
          { user_id: user.id, product_id: productId, quantity }
        ])

      if (error) {
        if (error.code === '23505') {
          // Item already in cart, update quantity
          const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', user.id)
            .eq('product_id', productId)

          if (updateError) throw updateError
          showNotification('Item quantity updated in cart!')
        } else {
          throw error
        }
      } else {
        showNotification('Added to cart!')
      }

      // Fetch actual count to ensure accuracy
      await fetchCartCount()
      return { success: true }
    } catch (error) {
      console.error('Error adding to cart:', error)
      showNotification('Failed to add to cart', 'error')
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add to cart' }
    } finally {
      setLoading(false)
    }
  }, [user, fetchCartCount])

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (error) throw error

      showNotification('Removed from cart!')
      // Fetch actual count to ensure accuracy
      await fetchCartCount()
      return { success: true }
    } catch (error) {
      console.error('Error removing from cart:', error)
      showNotification('Failed to remove from cart', 'error')
      return { success: false, error: error instanceof Error ? error.message : 'Failed to remove from cart' }
    }
  }, [user, fetchCartCount])

  const updateCartQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (error) throw error

      showNotification('Cart updated!')
      // Immediately update count
      await fetchCartCount()
      return { success: true }
    } catch (error) {
      console.error('Error updating cart quantity:', error)
      showNotification('Failed to update cart', 'error')
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update quantity' }
    }
  }, [user, fetchCartCount])

  const clearCart = useCallback(async () => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      // Immediately update count
      setCartItemsCount(0)
      showNotification('Cart cleared!')
      return { success: true }
    } catch (error) {
      console.error('Error clearing cart:', error)
      showNotification('Failed to clear cart', 'error')
      return { success: false, error: error instanceof Error ? error.message : 'Failed to clear cart' }
    }
  }, [user])

  // Force refresh cart count - useful for manual updates
  const refreshCartCount = useCallback(() => {
    fetchCartCount()
  }, [fetchCartCount])

  return { 
    cartItemsCount, 
    loading,
    fetchCartCount,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    refreshCartCount
  }
}