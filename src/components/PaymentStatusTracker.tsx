import React, { useState, useEffect } from 'react'
import { CheckCircle, Clock, AlertCircle, CreditCard } from 'lucide-react'

interface PaymentStatusTrackerProps {
  orderId: string
  amount: number
  onStatusChange?: (status: string) => void
}

type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed'

const PaymentStatusTracker: React.FC<PaymentStatusTrackerProps> = ({
  orderId,
  amount,
  onStatusChange
}) => {
  const [status, setStatus] = useState<PaymentStatus>('pending')
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status)
    }
  }, [status, onStatusChange])

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />
      case 'processing':
        return <CreditCard className="w-6 h-6 text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-500" />
      default:
        return <Clock className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'pending':
        return 'Waiting for payment confirmation...'
      case 'processing':
        return 'Processing your payment...'
      case 'completed':
        return 'Payment completed successfully!'
      case 'failed':
        return 'Payment failed. Please try again.'
      default:
        return 'Unknown status'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-4 mb-4">
        {getStatusIcon()}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Payment Status
          </h3>
          <p className="text-gray-600">{getStatusMessage()}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Order ID:</span>
          <span className="font-mono text-sm">{orderId.slice(0, 8)}...</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount:</span>
          <span className="font-semibold">₹{amount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Time Elapsed:</span>
          <span className="font-mono text-sm">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Initiated</span>
          <span>Processing</span>
          <span>Completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              status === 'pending' ? 'w-1/3 bg-yellow-500' :
              status === 'processing' ? 'w-2/3 bg-blue-500' :
              status === 'completed' ? 'w-full bg-green-500' :
              'w-1/3 bg-red-500'
            }`}
          />
        </div>
      </div>

      {/* Demo Controls */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-3">Demo Controls:</p>
        <div className="flex space-x-2">
          <button
            onClick={() => setStatus('processing')}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Processing
          </button>
          <button
            onClick={() => setStatus('completed')}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Complete
          </button>
          <button
            onClick={() => setStatus('failed')}
            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Failed
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentStatusTracker