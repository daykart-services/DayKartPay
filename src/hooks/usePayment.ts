import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface PaymentData {
  amount: number
  items: any[]
  paymentMethod: 'phonepe' | 'upi' | 'card' | 'cod'
  transactionId?: string
  isCod?: boolean
  codAmount?: number
  upfrontAmount?: number
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
      
      if (Math.abs(calculatedTotal - paymentData.amount) > 0.01 && !paymentData.isCod) {
        throw new Error('Payment amount mismatch with cart total')
      }

      // Generate unique order reference
      const orderRef = `DK${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      // Create order in database
      const orderData = {
        user_id: user.id,
        products: paymentData.items,
        total_amount: calculatedTotal,
        status: 'completed',
        payment_method: paymentData.paymentMethod || 'phonepe',
        transaction_id: paymentData.transactionId || orderRef,
        payment_status: paymentData.isCod ? 'partial' : 'paid',
        order_status: 'pending',
        is_cod: paymentData.isCod || false,
        cod_amount: paymentData.codAmount || 0,
        upfront_amount: paymentData.upfrontAmount || paymentData.amount
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()

      if (orderError) throw orderError

      // Process referral rewards if applicable
      await processReferralReward(user.id, calculatedTotal)

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

  const processReferralReward = async (userId: string, orderAmount: number) => {
    try {
      // Check if user was referred and order amount is >= 1999
      if (orderAmount < 1999) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('referred_by, referral_activated')
        .eq('id', userId)
        .single()

      if (!profile?.referred_by || profile.referral_activated) return

      // Mark referral as activated and add reward to referrer
      await supabase
        .from('profiles')
        .update({ referral_activated: true })
        .eq('id', userId)

      // Add reward to referrer
      await supabase
        .from('profiles')
        .update({ 
          total_referral_rewards: supabase.sql`total_referral_rewards + 50`,
          pending_referral_rewards: supabase.sql`pending_referral_rewards - 50`
        })
        .eq('id', profile.referred_by)

      // Create referral transaction record
      await supabase
        .from('referral_transactions')
        .insert([{
          referrer_id: profile.referred_by,
          referred_id: userId,
          reward_amount: 50,
          status: 'completed',
          completed_at: new Date().toISOString()
        }])

    } catch (error) {
      console.error('Error processing referral reward:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: status })
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