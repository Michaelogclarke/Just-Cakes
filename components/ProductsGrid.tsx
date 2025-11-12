'use client'

import { useState, useMemo } from 'react'
import styles from './ProductsGrid.module.css'
import Product from './Product'
import { Product as ProductType } from '@/types/product'

type ProductsGridProps = {
  products: ProductType[]
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)))
    return ['all', ...uniqueCategories]
  }, [products])

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products
    }
    return products.filter(p => p.category === selectedCategory)
  }, [products, selectedCategory])

  // Format category name for display
  const formatCategory = (category: string) => {
    if (category === 'all') return 'All Cakes'
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <div className={styles.container}>
      {/* Category Filter */}
      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`${styles.filterButton} ${
                selectedCategory === category ? styles.active : ''
              }`}
            >
              {formatCategory(category)}
            </button>
          ))}
        </div>
        <div className={styles.resultsCount}>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'cake' : 'cakes'} available
        </div>
      </div>

      {/* Products Grid */}
      <div className={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className={styles.emptyState}>
          <p>No cakes found in this category.</p>
        </div>
      )}
    </div>
  )
}
