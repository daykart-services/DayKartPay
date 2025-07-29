// UPI Payment String Generator - NPCI 2.0 Compliant
// Fixes PhonePe "Unable to scan QR" issues

export interface UPIPaymentData {
  payeeAddress: string
  payeeName: string
  amount: number
  transactionNote?: string
  transactionRef?: string
  merchantCode?: string
  currency?: string
}

export interface UPIValidationResult {
  isValid: boolean
  errors: string[]
  upiString?: string
}

/**
 * Generates NPCI 2.0 compliant UPI payment string
 * Fixes common PhonePe scanning issues by including all required parameters
 */
export const generateUPIString = (data: UPIPaymentData): string => {
  const {
    payeeAddress,
    payeeName,
    amount,
    transactionNote = `Payment to ${payeeName}`,
    transactionRef = generateTransactionRef(),
    merchantCode = '0000',
    currency = 'INR'
  } = data

  // Format amount to 2 decimal places (required by NPCI)
  const formattedAmount = amount.toFixed(2)
  
  // Encode parameters to handle special characters
  const encodedPayeeName = encodeURIComponent(payeeName)
  const encodedTransactionNote = encodeURIComponent(transactionNote)
  
  // Build UPI string with all NPCI required parameters
  const upiParams = [
    `pa=${payeeAddress}`,                    // Payee Address (required)
    `pn=${encodedPayeeName}`,               // Payee Name (required)
    `am=${formattedAmount}`,                // Amount (required)
    `cu=${currency}`,                       // Currency (required)
    `tn=${encodedTransactionNote}`,         // Transaction Note (required)
    `tr=${transactionRef}`,                 // Transaction Reference (recommended)
    `mc=${merchantCode}`,                   // Merchant Code (required for merchants)
    `mode=02`,                             // Collection mode (02 = default)
    `purpose=00`,                          // Purpose code (00 = default)
    `orgid=000000`,                        // Organization ID (default)
    `sign=`                                // Digital signature (empty for basic UPI)
  ]

  // Use proper UPI scheme (lowercase as per NPCI spec)
  return `upi://pay?${upiParams.join('&')}`
}

/**
 * Validates UPI payment data before QR generation
 */
export const validateUPIData = (data: UPIPaymentData): UPIValidationResult => {
  const errors: string[] = []

  // Validate payee address (UPI ID format)
  if (!data.payeeAddress) {
    errors.push('Payee address is required')
  } else if (!isValidUPIAddress(data.payeeAddress)) {
    errors.push('Invalid UPI address format')
  }

  // Validate payee name
  if (!data.payeeName || data.payeeName.trim().length === 0) {
    errors.push('Payee name is required')
  } else if (data.payeeName.length > 50) {
    errors.push('Payee name must be less than 50 characters')
  }

  // Validate amount
  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0')
  } else if (data.amount > 100000) {
    errors.push('Amount cannot exceed ₹1,00,000')
  } else if (!Number.isFinite(data.amount)) {
    errors.push('Amount must be a valid number')
  }

  // Validate transaction note length
  if (data.transactionNote && data.transactionNote.length > 100) {
    errors.push('Transaction note must be less than 100 characters')
  }

  const isValid = errors.length === 0
  let upiString: string | undefined

  if (isValid) {
    try {
      upiString = generateUPIString(data)
    } catch (error) {
      errors.push('Failed to generate UPI string')
    }
  }

  return { isValid, errors, upiString }
}

/**
 * Validates UPI address format
 */
export const isValidUPIAddress = (address: string): boolean => {
  // UPI address format: username@bank
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/
  return upiRegex.test(address) && address.length >= 5 && address.length <= 50
}

/**
 * Generates unique transaction reference
 */
export const generateTransactionRef = (): string => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `DK${timestamp.slice(-8)}${random}`
}

/**
 * Creates UPI intent URL for fallback (direct app opening)
 */
export const generateUPIIntent = (data: UPIPaymentData): string => {
  const validation = validateUPIData(data)
  if (!validation.isValid || !validation.upiString) {
    throw new Error(`Invalid UPI data: ${validation.errors.join(', ')}`)
  }
  
  // Return the UPI string that can be used as intent URL
  return validation.upiString
}

/**
 * Format amount for display
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}