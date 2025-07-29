import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'
import ProductCard from './ProductCard'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

interface ProductGridProps {
  category?: string
  limit?: number
  showFeaturedOnly?: boolean
  className?: string
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  category, 
  limit, 
  showFeaturedOnly = false,
  className = '' 
}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [category, limit, showFeaturedOnly])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      if (showFeaturedOnly) {
        query = query.eq('is_featured', true)
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" className={`py-12 ${className}`} />
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorMessage message={error} onRetry={fetchProducts} />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">
          {category 
            ? `No products available in the ${category} category yet.`
            : 'No products available at the moment.'
          }
        </p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid