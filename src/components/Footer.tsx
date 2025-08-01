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
              <p className="text-gray-600 text-sm mb-4">
                Your trusted partner for premium hostel essentials and student lifestyle products.
              </p>
              <p className="text-gray-600 text-sm">
                Quality products, affordable prices, fast delivery.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">EXPLORE</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/" className="hover:text-gray-900 transition-colors">Home</Link></li>
                <li><Link to="/products" className="hover:text-gray-900 transition-colors">All Products</Link></li>
                <li><Link to="/beds" className="hover:text-gray-900 transition-colors">Beds</Link></li>
                <li><Link to="/stationery" className="hover:text-gray-900 transition-colors">Stationery</Link></li>
                <li><Link to="/books" className="hover:text-gray-900 transition-colors">Books</Link></li>
                <li><Link to="/bathware" className="hover:text-gray-900 transition-colors">Bathware</Link></li>
                <li><Link to="/dorm" className="hover:text-gray-900 transition-colors">Dorm</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SUPPORT</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/terms" className="hover:text-gray-900 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/refund" className="hover:text-gray-900 transition-colors">Refund Policy</Link></li>
                <li><Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/shipping" className="hover:text-gray-900 transition-colors">Shipping Policy</Link></li>
                <li><Link to="/contact" className="hover:text-gray-900 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mt-8 pt-8 border-t border-gray-200">
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Facebook">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Instagram">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="YouTube">
              <Youtube size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Twitter">
              <Twitter size={24} />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              © 2025 DayKart. All rights reserved. Made with ❤️ for students.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer