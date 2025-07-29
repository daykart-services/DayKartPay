// Payment validation utilities

export interface PaymentValidationResult {
  isValid: boolean
  errors: string[]
}

export const validatePaymentAmount = (amount: number): PaymentValidationResult => {
  const errors: string[] = []

  if (!amount || isNaN(amount)) {
    errors.push('Payment amount is required')
  } else if (amount <= 0) {
    errors.push('Payment amount must be greater than zero')
  } else if (amount > 100000) {
    errors.push('Payment amount cannot exceed ₹1,00,000')
  } else if (!Number.isFinite(amount)) {
    errors.push('Payment amount must be a valid number')
  }

  // Check for proper decimal places (max 2)
  const decimalPlaces = (amount.toString().split('.')[1] || '').length
  if (decimalPlaces > 2) {
    errors.push('Payment amount cannot have more than 2 decimal places')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateCartItems = (items: any[]): PaymentValidationResult => {
  const errors: string[] = []

  if (!items || !Array.isArray(items)) {
    errors.push('Cart items must be an array')
  } else if (items.length === 0) {
    errors.push('Cart cannot be empty')
  } else {
    items.forEach((item, index) => {
      if (!item.id) {
        errors.push(`Item ${index + 1}: Product ID is required`)
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Valid quantity is required`)
      }
      if (!item.price || item.price <= 0) {
        errors.push(`Item ${index + 1}: Valid price is required`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateUPIString = (upiString: string): PaymentValidationResult => {
  const errors: string[] = []

  if (!upiString) {
    errors.push('UPI string is required')
  } else {
    // Basic UPI format validation
    if (!upiString.startsWith('upi://pay?')) {
      errors.push('Invalid UPI string format')
    }

    // Check for required parameters with better validation
    const requiredParams = ['pa', 'pn', 'am', 'cu']
    requiredParams.forEach(param => {
      if (!upiString.includes(`${param}=`)) {
        errors.push(`Missing required parameter: ${param}`)
      }
    })
    
    // Validate UPI ID format
    const paMatch = upiString.match(/pa=([^&]+)/)
    if (paMatch && paMatch[1]) {
      const upiId = decodeURIComponent(paMatch[1])
      if (!upiId.includes('@') || upiId.length < 5) {
        errors.push('Invalid UPI ID format')
      }
    }
    
    // Validate amount format
    const amMatch = upiString.match(/am=([^&]+)/)
    if (amMatch && amMatch[1]) {
      const amount = parseFloat(decodeURIComponent(amMatch[1]))
      if (isNaN(amount) || amount <= 0) {
        errors.push('Invalid amount in UPI string')
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export const sanitizeAmount = (amount: number): number => {
  // Round to 2 decimal places and ensure it's a positive number
  return Math.max(0, Math.round(amount * 100) / 100)
}

export const generateTransactionId = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `TXN${timestamp}${random}`.toUpperCase()
}

export const isValidPhoneNumber = (phone: string): boolean => {
  // Indian phone number validation
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}