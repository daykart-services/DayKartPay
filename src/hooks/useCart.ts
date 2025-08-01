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

    setLoading(true)
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
    } finally {
      setLoading(false)
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

  const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

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
        } else {
          throw error
        }
      }

      // Immediately update count
      await fetchCartCount()
      return { success: true }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add to cart' }
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

      // Immediately update count
      await fetchCartCount()
      return { success: true }
    } catch (error) {
      console.error('Error removing from cart:', error)
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

      // Immediately update count
      await fetchCartCount()
      return { success: true }
    } catch (error) {
      console.error('Error updating cart quantity:', error)
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
      return { success: true }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Failed to clear cart' }
    }
  }, [user])

  return { 
    cartItemsCount, 
    loading,
    fetchCartCount,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
  }
}