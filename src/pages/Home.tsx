import React from 'react'
import { Link } from 'react-router-dom'
import FeaturedProducts from '../components/FeaturedProducts'
import VideoSection from '../components/VideoSection'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-600 mb-4">New Collection 2025</p>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                PREMIUM<br />
                HOSTEL ESSENTIALS
              </h1>
              <p className="text-gray-700 text-lg mb-8">
                Discover our curated collection of high-quality products designed specifically for modern hostel living. From comfortable bedding to essential study accessories.
              </p>
              <Link
                to="/products"
                className="inline-block px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Shop Now
              </Link>
            </div>
            
            <div className="relative flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-gray-100 to-gray-200 mx-auto relative overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://images.pexels.com/photos/1034596/pexels-photo-1034596.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Premium Hostel Products"
                  className="relative z-10 w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Video Section - Only on Home Page */}
      <VideoSection />

      {/* Admin Portal Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrator Access</h3>
            <p className="text-gray-600 mb-6">Manage products, orders, and system settings</p>
            <Link
              to="/admin-login"
              className="inline-block px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home