import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const PrivacyPolicy: React.FC = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Personal information (name, email address, phone number)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Shipping and billing addresses</li>
                <li>Order history and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>Provide customer support</li>
                <li>Send promotional emails (with your consent)</li>
                <li>Improve our products and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Service providers who assist in our operations</li>
                <li>Payment processors for transaction processing</li>
                <li>Shipping companies for order delivery</li>
                <li>Legal requirements or to protect our rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="mt-4 text-gray-700">
                <p>Email: privacy@daykart.com</p>
                <p>Phone: +91 9652377187</p>
                <p>Address: DayKart Privacy Team, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy