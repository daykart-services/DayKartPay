import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const Refund: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">Last updated: January 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Return Window</h2>
            <p className="text-gray-700 mb-4">
              You have 7 days from the date of delivery to return most items for a full refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligible Items</h2>
            <p className="text-gray-700 mb-4">
              To be eligible for a return, items must be:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>In original condition and packaging</li>
              <li>Unused and undamaged</li>
              <li>Accompanied by original receipt or proof of purchase</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Non-Returnable Items</h2>
            <p className="text-gray-700 mb-4">
              The following items cannot be returned:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Personal care items</li>
              <li>Items damaged by misuse</li>
              <li>Custom or personalized items</li>
              <li>Items returned after 7 days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Return Process</h2>
            <p className="text-gray-700 mb-4">
              To initiate a return:
            </p>
            <ol className="list-decimal list-inside text-gray-700 mb-4">
              <li>Contact our customer service team</li>
              <li>Provide your order number and reason for return</li>
              <li>Receive return authorization and instructions</li>
              <li>Package items securely and ship to our return address</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Refund Processing</h2>
            <p className="text-gray-700 mb-4">
              Once we receive your returned item:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>We will inspect the item within 2-3 business days</li>
              <li>If approved, refund will be processed to original payment method</li>
              <li>Refunds typically appear within 5-7 business days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Shipping Costs</h2>
            <p className="text-gray-700 mb-4">
              Return shipping costs are the responsibility of the customer unless the item was defective or we made an error.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Exchanges</h2>
            <p className="text-gray-700 mb-4">
              We currently do not offer direct exchanges. Please return the item for a refund and place a new order for the desired item.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Damaged or Defective Items</h2>
            <p className="text-gray-700 mb-4">
              If you receive a damaged or defective item:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Contact us immediately with photos of the damage</li>
              <li>We will provide a prepaid return label</li>
              <li>Full refund or replacement will be provided</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For returns and refunds, contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">Email: returns@daykart.com</p>
              <p className="text-gray-700">Phone: +91 9652377187</p>
              <p className="text-gray-700">Hours: Monday-Friday, 9 AM - 6 PM IST</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Refund