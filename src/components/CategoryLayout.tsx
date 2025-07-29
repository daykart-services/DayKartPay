import React from 'react'
import Footer from './Footer'

interface CategoryLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

const CategoryLayout: React.FC<CategoryLayoutProps> = ({ 
  title, 
  description, 
  children 
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Category Header */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </section>

      {/* Category Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CategoryLayout