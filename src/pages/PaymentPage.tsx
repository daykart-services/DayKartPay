import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Footer from '../components/Footer'

const PaymentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span>Back to Cart</span>
          </Link>
        </div>
      </div>

      {/* Payment Section */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">Scan the QR code below to complete your order</p>
          </div>

          {/* QR Code */}
          <div className="mb-8">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 inline-block">
              <img
                src="/phonepe.png"
                alt="PhonePe QR Code"
                className="w-64 h-64 mx-auto"
                onError={(e) => {
                  // Fallback if image doesn't load
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFkZCBRUiBDb2RlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4 text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 text-center">Payment Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Open your PhonePe app</li>
              <li>Tap on "Scan & Pay" option</li>
              <li>Scan the QR code above</li>
              <li>Enter the payment amount</li>
              <li>Complete the payment</li>
            </ol>
          </div>

          {/* Payment Status */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">
              💡 Your order will be confirmed automatically after successful payment
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Cart
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PaymentPage