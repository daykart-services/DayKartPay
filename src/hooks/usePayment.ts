import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface PaymentData {
  amount: number
  items: any[]
  paymentMethod: 'phonepe' | 'upi' | 'card'
}

interface PaymentResult {
  success: boolean
  orderId?: string
  error?: string
}

export const usePayment = () => {
  const [processing, setProcessing] = useState(false)
  const { user } = useAuth()

  const processPayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    setProcessing(true)

    try {
      // Validate payment data
      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new Error('Invalid payment amount')
      }

      if (!paymentData.items || paymentData.items.length === 0) {
        throw new Error('No items in cart')
      }

      // Additional validation for payment integrity
      const calculatedTotal = paymentData.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0)
      
      if (Math.abs(calculatedTotal - paymentData.amount) > 0.01) {
        throw new Error('Payment amount mismatch with cart total')
      }

      // Generate unique order reference
      const orderRef = `DK${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      // Create order in database
      const orderData = {
        user_id: user.id,
        products: paymentData.items,
        total_amount: paymentData.amount,
        status: 'completed', // Mark as completed for demo purposes
        payment_method: paymentData.paymentMethod || 'phonepe'
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()

      if (orderError) throw orderError

      // Clear cart after successful order creation
      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (clearCartError) {
        console.error('Error clearing cart:', clearCartError)
        // Don't fail the payment if cart clearing fails
      }

      return {
        success: true,
        orderId: order.id
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      }
    } finally {
      setProcessing(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error updating order status:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update order' }
    }
  }

  return {
    processPayment,
    updateOrderStatus,
    processing
  }
}