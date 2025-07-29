import React from 'react'
import { useParams } from 'react-router-dom'
import CategoryLayout from '../components/CategoryLayout'
import ProductGrid from '../components/ProductGrid'
import Footer from '../components/Footer'

const ProductsPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>()

  const getCategoryTitle = (cat?: string) => {
    if (!cat) return 'All Products'
    return cat
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const getCategoryDescription = (cat?: string) => {
    const descriptions: Record<string, string> = {
      'beds': 'Comfortable beds and mattresses designed for hostel rooms and student accommodation.',
      'stationary': 'Essential stationery items and study accessories for students and professionals.',
      'bathware': 'Bathroom essentials and accessories for modern hostel and dorm facilities.',
      'dorm': 'Complete dorm room essentials and furniture for comfortable student living.',
      'new-collections': 'Latest arrivals and trending products from our newest collections.'
    }
    
    if (!cat) return 'Discover our complete range of hostel and student essentials.'
    return descriptions[cat] || `Explore our ${getCategoryTitle(cat).toLowerCase()} collection.`
  }

  return (
    <>
      <CategoryLayout 
        title={getCategoryTitle(category)} 
        description={getCategoryDescription(category)}
      >
        <ProductGrid category={category} />
      </CategoryLayout>
      <Footer />
    </>
  )
}

export default ProductsPage