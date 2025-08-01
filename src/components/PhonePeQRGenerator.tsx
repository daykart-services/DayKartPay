import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface PhonePeQRGeneratorProps {
  amount: number
  onClose: () => void
  onPaymentSuccess: () => void
  merchantName?: string
  merchantId?: string
}

const PhonePeQRGenerator: React.FC<PhonePeQRGeneratorProps> = ({
  amount,
  onClose,
  onPaymentSuccess,
  merchantName = "DAYKART",
  merchantId = "Saviti PS Murthy"
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending')
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes timeout

  useEffect(() => {
    generateQRCode()
    startPaymentTimer()
  }, [amount])

  const generateQRCode = async () => {
    setLoading(true)
    setError('')

    try {
      // Validate amount
      if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount')
      }

      // Format amount to 2 decimal places
      const formattedAmount = amount.toFixed(2)

      // Generate PhonePe UPI payment string with proper format
      const transactionNote = `Payment to ${merchantName} - Order ${Date.now()}`
      const upiString = `upi://pay?pa=merchant@phonepe&pn=${encodeURIComponent(merchantName)}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&mc=0000&mode=02&purpose=00`

      // Generate QR code using multiple fallback services
      let qrApiUrl
      try {
        // Primary QR service with better error handling
        qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(upiString)}&format=png&margin=20&ecc=M`
        
        // Test if the QR service is accessible
        const testResponse = await fetch(qrApiUrl, { method: 'HEAD' })
        if (!testResponse.ok) {
          throw new Error('Primary QR service unavailable')
        }
      } catch (serviceError) {
        // Fallback to alternative QR service
        qrApiUrl = `https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=${encodeURIComponent(upiString)}&choe=UTF-8&chld=M|2`
      }
      
      setQrCodeUrl(qrApiUrl)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code')
      setLoading(false)
    }
  }

  const startPaymentTimer = () => {
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
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePaymentSuccess = () => {
    setPaymentStatus('success')
    setTimeout(() => {
      onPaymentSuccess()
      onClose()
    }, 2000)
  }

  const retryQRGeneration = () => {
    setTimeLeft(300)
    setPaymentStatus('pending')
    generateQRCode()
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
            <div className="text-3xl font-bold text-gray-900 mb-2">₹{amount.toFixed(2)}</div>
            <div className="text-gray-600">Payment Amount</div>
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
              </div>

              {/* QR Code Section */}
              <div className="text-center mb-6">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <Loader className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-600">Generating QR code...</p>
                  </div>
                ) : error ? (
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                      onClick={generateQRCode}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* PhonePe Branding */}
                    <div className="mb-4">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white font-bold text-sm">₹</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">PhonePe</span>
                      </div>
                      <p className="text-purple-600 font-medium">ACCEPTED HERE</p>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-4">
                      <img
                        src={qrCodeUrl}
                        alt="PhonePe Payment QR Code"
                        className="w-80 h-80 mx-auto"
                        onError={(e) => {
                          console.error('QR code image failed to load:', qrCodeUrl)
                          setError('Failed to load QR code. Please try again.')
                          // Try to regenerate with fallback service
                          setTimeout(() => {
                            generateQRCode()
                          }, 2000)
                        }}
                        onLoad={() => {
                          console.log('QR code loaded successfully')
                        }}
                      />
                    </div>

                    {/* Merchant Info */}
                    <div className="text-gray-600 mb-4">
                      <p className="font-medium">{merchantName}</p>
                      <p className="text-sm">Merchant ID: {merchantId}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              {!loading && !error && (
                <div className="space-y-4 text-left">
                  <h3 className="text-lg font-semibold text-gray-900 text-center">
                    Scan & Pay Using PhonePe App
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                    <li>Open your PhonePe app</li>
                    <li>Tap on "Scan & Pay" option</li>
                    <li>Scan the QR code above</li>
                    <li>Verify the merchant: {merchantName}</li>
                    <li>Confirm the amount: ₹{amount.toFixed(2)}</li>
                    <li>Complete the payment using your preferred method</li>
                  </ol>
                  
                  {/* Troubleshooting Tips */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Scanning Issues?</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Ensure good lighting and steady hands</li>
                      <li>• Keep phone 6-8 inches from screen</li>
                      <li>• Clean your camera lens</li>
                      <li>• Try refreshing if QR appears blurry</li>
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
              {paymentStatus === 'pending' && !loading && !error && (
                <button
                  onClick={() => window.open('phonepe://pay', '_blank')}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Open PhonePe App
                </button>
              )}
              {paymentStatus === 'pending' && !loading && (
                <button
                  onClick={generateQRCode}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Refresh QR Code
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="px-6 pb-4">
          <p className="text-xs text-gray-500 text-center">
            © 2025, All rights reserved, PhonePe Internet Pvt Ltd.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PhonePeQRGenerator