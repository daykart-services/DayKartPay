import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }])

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setMessage('Email already subscribed!')
        } else {
          setMessage('Error subscribing. Please try again.')
        }
      } else {
        setMessage('Successfully subscribed!')
        setEmail('')
      }
    } catch (error) {
      setMessage('Error subscribing. Please try again.')
    }
    setLoading(false)

    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <footer className="bg-white">
      {/* Newsletter Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Subscribe and get upto</h2>
          <h3 className="text-4xl font-bold mb-4">10% OFF</h3>
          <p className="text-gray-300 mb-8">Get 10% discount for all products</p>
          
          <form onSubmit={handleSubscribe} className="flex justify-center max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="@email.com"
              className="flex-1 px-4 py-3 rounded-l-lg text-black focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white text-black font-medium rounded-r-lg hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {message && (
            <p className={`mt-4 text-sm ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Video Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/6899224/pexels-photo-6899224.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="How to Book a Product on DayKart"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
              <div className="text-white">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <div className="w-0 h-0 border-l-6 border-r-0 border-t-4 border-b-4 border-l-white border-t-transparent border-b-transparent ml-1"></div>
                </div>
                <div className="text-sm">0:00 / 6:10</div>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-semibold mt-6 mb-2">How to Book a Product on DayKart</h3>
          <p className="text-gray-600">Watch this quick video to learn how to book your favorite products easily on our platform.</p>
        </div>
      </div>

      {/* Links Section */}
      <div className="py-12 border-t border-gray-200">
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
                <li><Link to="/featured" className="hover:text-gray-900">Featured</Link></li>
                <li><Link to="/fancy" className="hover:text-gray-900">Fancy</Link></li>
                <li><Link to="/new" className="hover:text-gray-900">New</Link></li>
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

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mt-8 pt-8 border-t border-gray-200">
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Facebook size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Instagram size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Youtube size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer