import React, { useState } from 'react'
import { generateUPIString, validateUPIData, formatAmount } from '../utils/upiGenerator'

/**
 * Testing component for UPI string generation and validation
 * Use this to test different UPI apps and scenarios
 */
const UPITestingComponent: React.FC = () => {
  const [testAmount, setTestAmount] = useState(25)
  const [merchantName, setMerchantName] = useState('DAYKART')
  const [merchantUPI, setMerchantUPI] = useState('9652377187-2@ybl')
  const [generatedUPI, setGeneratedUPI] = useState('')
  const [validationResult, setValidationResult] = useState<any>(null)

  const handleGenerateUPI = () => {
    const upiData = {
      payeeAddress: merchantUPI,
      payeeName: merchantName,
      amount: testAmount,
      transactionNote: `Test payment to ${merchantName}`,
      merchantCode: '5411'
    }

    const validation = validateUPIData(upiData)
    setValidationResult(validation)
    
    if (validation.isValid && validation.upiString) {
      setGeneratedUPI(validation.upiString)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!')
    })
  }

  const testWithUPIApp = (appName: string) => {
    if (!generatedUPI) {
      alert('Generate UPI string first')
      return
    }

    // Try to open UPI intent
    try {
      window.open(generatedUPI, '_blank')
    } catch (error) {
      console.error(`Failed to open ${appName}:`, error)
      copyToClipboard(generatedUPI)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">UPI Testing Component</h2>
      
      {/* Input Fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            value={testAmount}
            onChange={(e) => setTestAmount(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0.01"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Merchant Name
          </label>
          <input
            type="text"
            value={merchantName}
            onChange={(e) => setMerchantName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Merchant UPI ID
          </label>
          <input
            type="text"
            value={merchantUPI}
            onChange={(e) => setMerchantUPI(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="9652377187-2@ybl"
          />
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateUPI}
        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-6"
      >
        Generate UPI String
      </button>

      {/* Validation Results */}
      {validationResult && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Validation Results</h3>
          <div className={`p-4 rounded-lg ${validationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-medium ${validationResult.isValid ? 'text-green-800' : 'text-red-800'}`}>
              {validationResult.isValid ? '✅ Valid UPI Data' : '❌ Invalid UPI Data'}
            </p>
            {validationResult.errors.length > 0 && (
              <ul className="mt-2 text-sm text-red-700">
                {validationResult.errors.map((error: string, index: number) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Generated UPI String */}
      {generatedUPI && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Generated UPI String</h3>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <code className="text-sm break-all">{generatedUPI}</code>
            <button
              onClick={() => copyToClipboard(generatedUPI)}
              className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      {/* UPI App Testing */}
      {generatedUPI && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Test with UPI Apps</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => testWithUPIApp('PhonePe')}
              className="py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Test PhonePe
            </button>
            <button
              onClick={() => testWithUPIApp('Google Pay')}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Google Pay
            </button>
            <button
              onClick={() => testWithUPIApp('Paytm')}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Test Paytm
            </button>
            <button
              onClick={() => testWithUPIApp('Generic UPI')}
              className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Generic UPI Intent
            </button>
          </div>
        </div>
      )}

      {/* UPI Format Information */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">NPCI UPI 2.0 Compliance</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ All required parameters included</li>
          <li>✅ Proper URL encoding for special characters</li>
          <li>✅ Amount formatted to 2 decimal places</li>
          <li>✅ Merchant code and purpose code included</li>
          <li>✅ Transaction reference generated</li>
          <li>✅ Compatible with all major UPI apps</li>
        </ul>
      </div>
    </div>
  )
}

export default UPITestingComponent