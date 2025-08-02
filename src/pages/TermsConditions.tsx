import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const TermsConditions: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using DayKart, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily download one copy of the materials on DayKart's website for personal, non-commercial transitory viewing only.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>This is the grant of a license, not a transfer of title</li>
                <li>Under this license you may not modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Product Information</h2>
              <p className="text-gray-700 mb-4">
                We strive to provide accurate product information, but we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Orders and Payment</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>All orders are subject to acceptance and availability</li>
                <li>We reserve the right to refuse or cancel any order</li>
                <li>Payment must be received before order processing</li>
                <li>Prices are subject to change without notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Shipping and Delivery</h2>
              <p className="text-gray-700 mb-4">
                Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Returns and Refunds</h2>
              <p className="text-gray-700 mb-4">
                Please refer to our Refund Policy for detailed information about returns, exchanges, and refunds.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. User Accounts</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to accept responsibility for all activities under your account</li>
                <li>We reserve the right to terminate accounts that violate these terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall DayKart or its suppliers be liable for any damages arising out of the use or inability to use the materials on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <div className="mt-4 text-gray-700">
                <p>Email: support@daykart.com</p>
                <p>Phone: +91 9652377187</p>
                <p>Address: DayKart Customer Service, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsConditions