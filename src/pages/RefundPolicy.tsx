import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Return Window</h2>
              <p className="text-gray-700 mb-4">
                You have 30 days from the date of delivery to return most items for a full refund. Some items may have different return periods as specified in the product description.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Eligible Items</h2>
              <p className="text-gray-700 mb-4">To be eligible for a return, items must be:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>In original condition and packaging</li>
                <li>Unused and undamaged</li>
                <li>Include all original accessories and documentation</li>
                <li>Have original tags and labels attached</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Non-Returnable Items</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Personalized or customized items</li>
                <li>Perishable goods</li>
                <li>Items damaged by misuse or normal wear</li>
                <li>Digital products or downloads</li>
                <li>Items returned after 30 days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Return Process</h2>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Contact our customer service team to initiate a return</li>
                <li>Receive return authorization and shipping instructions</li>
                <li>Package items securely in original packaging</li>
                <li>Ship items using provided return label</li>
                <li>Track your return shipment</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Refund Processing</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Refunds are processed within 5-7 business days after we receive your return</li>
                <li>Refunds are issued to the original payment method</li>
                <li>Shipping costs are non-refundable unless the return is due to our error</li>
                <li>You are responsible for return shipping costs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Exchanges</h2>
              <p className="text-gray-700 mb-4">
                We offer exchanges for defective items or wrong items sent. Contact us within 7 days of delivery for exchange requests.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Damaged or Defective Items</h2>
              <p className="text-gray-700 mb-4">
                If you receive a damaged or defective item:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Contact us immediately with photos of the damage</li>
                <li>We will provide a prepaid return label</li>
                <li>Full refund or replacement will be provided</li>
                <li>No return shipping charges apply</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Cancellations</h2>
              <p className="text-gray-700 mb-4">
                Orders can be cancelled within 2 hours of placement. After this time, orders may have already been processed and shipped.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact for Returns</h2>
              <p className="text-gray-700">
                For return requests or questions about our refund policy:
              </p>
              <div className="mt-4 text-gray-700">
                <p>Email: returns@daykart.com</p>
                <p>Phone: +91 9652377187</p>
                <p>Hours: Monday-Friday, 9 AM - 6 PM IST</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RefundPolicy