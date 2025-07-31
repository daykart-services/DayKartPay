import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useCart = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCartCount()
      
      // Subscribe to cart changes
      const subscription = supabase
        .channel('cart_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'cart_items',
            filter: `user_id=eq.${user.id}`
          }, 
          () => {
            fetchCartCount()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    } else {
      setCartItemsCount(0)
    }
  }, [user])

  const fetchCartCount = async () => {
    if (!user) return

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
  }

  return { cartItemsCount, fetchCartCount }
}