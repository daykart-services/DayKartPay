import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'
import CategoryLayout from '../components/CategoryLayout'
import ProductGrid from '../components/ProductGrid'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const CategoryPage: React.FC = () => {
  const location = useLocation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Extract category from pathname
  const category = location.pathname.slice(1) // Remove leading slash

  useEffect(() => {
    if (category) {
      fetchCategoryProducts()
    }
  }, [category])

  const fetchCategoryProducts = async () => {
    if (!category) return

    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching category products:', error)
      setError('Failed to load products for this category')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryTitle = () => {
    if (!category) return ''
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getCategoryDescription = () => {
    const descriptions: Record<string, string> = {
      'beds': 'Comfortable beds and mattresses designed for hostel rooms and student accommodation.',
      'stationery': 'Essential stationery items and study accessories for students and professionals.',
      'books': 'Academic books, novels, and reference materials for students and book lovers.',
      'bathware': 'Bathroom essentials and accessories for modern hostel and dorm facilities.',
      'dorm': 'Complete dorm room essentials and furniture for comfortable student living.',
    }
    return descriptions[category] || `Discover our curated collection of ${getCategoryTitle().toLowerCase()} products.`
  }

  if (loading) {
    return (
      <CategoryLayout 
        title={getCategoryTitle()} 
        description={getCategoryDescription()}
      >
        <LoadingSpinner size="lg" className="py-12" />
      </CategoryLayout>
    )
  }

  if (error) {
    return (
      <CategoryLayout 
        title={getCategoryTitle()} 
        description={getCategoryDescription()}
      >
        <ErrorMessage message={error} onRetry={fetchCategoryProducts} />
      </CategoryLayout>
    )
  }

  return (
    <CategoryLayout 
      title={getCategoryTitle()} 
      description={getCategoryDescription()}
    >
      <ProductGrid category={category} />
    </CategoryLayout>
  )
}

export default CategoryPage