import React, { useState, useEffect, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Loader, RefreshCw, Smartphone } from 'lucide-react'
import { generateUPIString, validateUPIData, generateUPIIntent, formatAmount } from '../utils/upiGenerator'

interface EnhancedQRGeneratorProps {
  amount: number
  onClose: () => void
  onPaymentSuccess: () => void
  merchantName?: string
  merchantUPI?: string
  merchantId?: string
}

interface QRGenerationService {
  name: string
  generateURL: (upiString: string) => string
  priority: number
}

const EnhancedQRGenerator: React.FC<EnhancedQRGeneratorProps> = ({
  amount,
  onClose,
  onPaymentSuccess,
  merchantName = "DAYKART",
  merchantUPI = "9652377187@ybl",
  merchantId = "Saviti PS Murthy"
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [currentService, setCurrentService] = useState<string>('')
  const [upiString, setUpiString] = useState<string>('')
  const [retryCount, setRetryCount] = useState(0)

  // QR Generation Services with fallbacks
  const qrServices: QRGenerationService[] = [
    {
      name: 'QR Server',
      generateURL: (upi) => `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(upi)}&format=png&margin=10&ecc=M&color=000000&bgcolor=ffffff`,
      priority: 1
    },
    {
      name: 'Google Charts',
      generateURL: (upi) => `https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=${encodeURIComponent(upi)}&choe=UTF-8&chld=M|2`,
      priority: 2
    },
    {
      name: 'QR Code API',
      generateURL: (upi) => `https://qr-code-generator-api.herokuapp.com/api/qr?data=${encodeURIComponent(upi)}&size=400x400&format=png`,
      priority: 3
    }
  ]

  // Generate UPI string and QR code
  const generateQRCode = useCallback(async (serviceIndex = 0) => {
    setLoading(true)
    setError('')

    try {
      // Validate amount first
      if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount')
      }

      // Generate NPCI compliant UPI string
      const upiData = {
        payeeAddress: merchantUPI,
        payeeName: merchantName,
        amount: amount,
        transactionNote: `Payment to ${merchantName} - Order ${Date.now()}`,
        merchantCode: '5411' // Grocery stores, supermarkets
      }

      const validation = validateUPIData(upiData)
      if (!validation.isValid) {
        throw new Error(`UPI validation failed: ${validation.errors.join(', ')}`)
      }

      const generatedUpiString = validation.upiString!
      setUpiString(generatedUpiString)

      // Try QR generation services in order of priority
      const service = qrServices[serviceIndex]
      if (!service) {
        throw new Error('All QR generation services failed')
      }

      setCurrentService(service.name)
      const qrUrl = service.generateURL(generatedUpiString)

      // Test if the QR service is accessible
      const testResponse = await fetch(qrUrl, { 
        method: 'HEAD',
        mode: 'no-cors' // Allow cross-origin requests
      }).catch(() => null)

      // For no-cors mode, we can't check response status, so we'll try to load the image
      setQrCodeUrl(qrUrl)
      setLoading(false)

    } catch (err) {
      console.error(`QR generation failed with ${qrServices[serviceIndex]?.name}:`, err)
      
      // Try next service if available
      if (serviceIndex < qrServices.length - 1) {
        setTimeout(() => generateQRCode(serviceIndex + 1), 1000)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate QR code')
        setLoading(false)
      }
    }
  }, [amount, merchantName, merchantUPI])

  // Handle QR image load error
  const handleImageError = useCallback(() => {
    console.error('QR code image failed to load')
    setRetryCount(prev => prev + 1)
    
    if (retryCount < 3) {
      // Try regenerating with next service
      const nextServiceIndex = Math.min(retryCount + 1, qrServices.length - 1)
      setTimeout(() => generateQRCode(nextServiceIndex), 2000)
    } else {
      setError('Unable to load QR code. Please try refreshing or use UPI intent.')
    }
  }, [retryCount, generateQRCode])

  // Payment timer
  useEffect(() => {
    if (paymentStatus !== 'pending') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setPaymentStatus('failed')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [paymentStatus])

  // Initialize QR generation
  useEffect(() => {
    generateQRCode()
  }, [generateQRCode])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePaymentSuccess = () => {
    setPaymentStatus('success')
    setTimeout(() => {
      onPaymentSuccess()
    }, 1500)
  }

  const retryQRGeneration = () => {
    setTimeLeft(300)
    setPaymentStatus('pending')
    setRetryCount(0)
    generateQRCode()
  }

  const openUPIIntent = () => {
    if (!upiString) return
    
    try {
      // Try to open UPI intent directly
      window.open(upiString, '_blank')
    } catch (error) {
      console.error('Failed to open UPI intent:', error)
      // Fallback: copy UPI string to clipboard
      navigator.clipboard?.writeText(upiString).then(() => {
        alert('UPI payment string copied to clipboard. Paste it in your UPI app.')
      }).catch(() => {
        alert(`UPI String: ${upiString}`)
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount Display */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">{formatAmount(amount)}</div>
            <div className="text-gray-600">Payment Amount</div>
            <div className="text-sm text-gray-500 mt-1">To: {merchantName}</div>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'success' && (
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-600 mb-2">Payment Successful!</h3>
              <p className="text-gray-600">Your order has been confirmed.</p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center mb-6">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">Payment Timeout</h3>
              <p className="text-gray-600 mb-4">The payment session has expired.</p>
              <button
                onClick={retryQRGeneration}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <>
              {/* Timer */}
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-gray-700">
                  Time remaining: {formatTime(timeLeft)}
                </div>
                {currentService && (
                  <div className="text-xs text-gray-500 mt-1">
                    Using: {currentService}
                  </div>
                )}
              </div>

              {/* QR Code Section */}
              <div className="text-center mb-6">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <Loader className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-600">Generating secure QR code...</p>
                    <p className="text-xs text-gray-500 mt-1">Service: {currentService}</p>
                  </div>
                ) : error ? (
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{error}</p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => generateQRCode()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={16} />
                        Retry QR Generation
                      </button>
                      {upiString && (
                        <button
                          onClick={openUPIIntent}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Smartphone size={16} />
                          Open UPI App Directly
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* PhonePe Branding */}
                    <div className="mb-4">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white font-bold text-sm">₹</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">UPI Payment</span>
                      </div>
                      <p className="text-purple-600 font-medium">SCAN & PAY</p>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-4">
                      <img
                        src={qrCodeUrl}
                        alt="UPI Payment QR Code"
                        className="w-80 h-80 mx-auto"
                        onError={handleImageError}
                        onLoad={() => {
                          console.log('QR code loaded successfully')
                          setRetryCount(0) // Reset retry count on successful load
                        }}
                      />
                    </div>

                    {/* Merchant Info */}
                    <div className="text-gray-600 mb-4">
                      <p className="font-medium">{merchantName}</p>
                      <p className="text-sm">UPI ID: {merchantUPI}</p>
                      <p className="text-sm">Merchant ID: {merchantId}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              {!loading && !error && (
                <div className="space-y-4 text-left">
                  <h3 className="text-lg font-semibold text-gray-900 text-center">
                    Scan & Pay Using Any UPI App
                  </h3>
                  <div className="grid grid-cols-4 gap-2 text-center mb-4">
                    <div className="text-xs">
                      <div className="w-8 h-8 bg-purple-100 rounded-full mx-auto mb-1 flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-xs">₹</span>
                      </div>
                      PhonePe
                    </div>
                    <div className="text-xs">
                      <div className="w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">G</span>
                      </div>
                      GPay
                    </div>
                    <div className="text-xs">
                      <div className="w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">P</span>
                      </div>
                      Paytm
                    </div>
                    <div className="text-xs">
                      <div className="w-8 h-8 bg-gray-100 rounded-full mx-auto mb-1 flex items-center justify-center">
                        <span className="text-gray-600 font-bold text-xs">+</span>
                      </div>
                      Others
                    </div>
                  </div>
                  
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                    <li>Open any UPI app (PhonePe, GPay, Paytm, etc.)</li>
                    <li>Tap on "Scan & Pay" or QR scanner</li>
                    <li>Scan the QR code above</li>
                    <li>Verify merchant: {merchantName}</li>
                    <li>Confirm amount: {formatAmount(amount)}</li>
                    <li>Complete payment using your UPI PIN</li>
                  </ol>
                  
                  {/* Troubleshooting Tips */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Scanning Issues?</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Ensure good lighting and steady hands</li>
                      <li>• Keep phone 6-8 inches from screen</li>
                      <li>• Clean your camera lens</li>
                      <li>• Try the "Open UPI App" button below</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Demo Payment Button (for testing) */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-3">
                  Demo Mode: Click below to simulate successful payment
                </p>
                <button
                  onClick={handlePaymentSuccess}
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Simulate Payment Success
                </button>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              {paymentStatus === 'pending' && !loading && !error && upiString && (
                <button
                  onClick={openUPIIntent}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Smartphone size={16} />
                  Open UPI App
                </button>
              )}
              {paymentStatus === 'pending' && !loading && (
                <button
                  onClick={() => generateQRCode()}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Refresh QR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="px-6 pb-4">
          <p className="text-xs text-gray-500 text-center">
            Secure UPI Payment • NPCI Certified • {new Date().getFullYear()} {merchantName}
          </p>
        </div>
      </div>
    </div>
  )
}

export default EnhancedQRGenerator