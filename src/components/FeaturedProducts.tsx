import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from './ProductGrid'

const FeaturedProducts: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link 
            to="/products" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Products →
          </Link>
        </div>
        
        <ProductGrid showFeaturedOnly={true} limit={6} />
      </div>
    </section>
  )
}

export default FeaturedProducts