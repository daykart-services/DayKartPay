import React from 'react'
import { Link } from 'react-router-dom'
import FeaturedProducts from '../components/FeaturedProducts'
import Footer from '../components/Footer'

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
                <p className="text-sm text-gray-600 mb-4">New in</p>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                  PREMIUM<br />
                  COLLECTION
                </h1>
                <p className="text-gray-700 text-lg mb-8">
                  Explore our new collection and make yourself feel at home.
                </p>
                <Link
                  to="/products"
                  className="inline-block px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Explore Now
                </Link>
            </div>
            
            <div className="relative flex justify-center">
              <div className="w-80 h-80 bg-black mx-auto relative overflow-hidden rounded-lg">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo7f_bvzfHRsX6r0pqYkgJVNrY76_2qYe1N2jKQ2HBtV_kjK6CFW2mqoo&s"
                  alt="Premium Mattress"
                  className="relative z-10 w-full h-full object-cover object-center"
                />
              </div>
              
              {/* Scroll indicator */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-16">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts />

      {/* Admin Login Button */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            to="/admin-login"
            className="inline-block px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Admin Portal
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home