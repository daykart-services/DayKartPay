import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* DayKart */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DayKart</h3>
              <p className="text-gray-600 text-sm">
                New Collection of Hostel needs 2025
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">EXPLORE</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/" className="hover:text-gray-900">Home</Link></li>
                <li><Link to="/products" className="hover:text-gray-900">All Products</Link></li>
                <li><Link to="/beds" className="hover:text-gray-900">Beds</Link></li>
                <li><Link to="/stationery" className="hover:text-gray-900">Stationery</Link></li>
                <li><Link to="/books" className="hover:text-gray-900">Books</Link></li>
                <li><Link to="/bathware" className="hover:text-gray-900">Bathware</Link></li>
                <li><Link to="/dorm" className="hover:text-gray-900">Dorm</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SUPPORT</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/terms" className="hover:text-gray-900">Terms & Conditions</Link></li>
                <li><Link to="/refund" className="hover:text-gray-900">Refund Policy</Link></li>
                <li><Link to="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link to="/shipping" className="hover:text-gray-900">Shipping Policy</Link></li>
                <li><Link to="/contact" className="hover:text-gray-900">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          {/* Admin Login and Social Media */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col items-center space-y-4">
              {/* Admin Login Button */}
              <Link
                to="/admin-login"
                className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                Admin Portal
              </Link>
              
              {/* Social Media Icons */}
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Youtube size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Twitter size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer