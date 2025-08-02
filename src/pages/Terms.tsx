import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">Last updated: January 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using DayKart, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials on DayKart's website for personal, non-commercial transitory viewing only.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>This is the grant of a license, not a transfer of title</li>
              <li>Under this license you may not modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Product Information</h2>
            <p className="text-gray-700 mb-4">
              We strive to provide accurate product information, but we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Orders and Payment</h2>
            <p className="text-gray-700 mb-4">
              All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Payment must be made at the time of order</li>
              <li>We accept UPI, credit cards, and cash on delivery</li>
              <li>Prices are subject to change without notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Shipping and Delivery</h2>
            <p className="text-gray-700 mb-4">
              We will make every effort to deliver products within the estimated timeframe, but delivery times are not guaranteed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Returns and Refunds</h2>
            <p className="text-gray-700 mb-4">
              Please refer to our Refund Policy for detailed information about returns and refunds.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall DayKart or its suppliers be liable for any damages arising out of the use or inability to use the materials on the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">Email: support@daykart.com</p>
              <p className="text-gray-700">Phone: +91 9652377187</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Terms