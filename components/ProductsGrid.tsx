'use client'

import { useState, useMemo } from 'react'
import styles from './ProductsGrid.module.css'
import Product from './Product'
import { Product as ProductType } from '@/types/product'

type ProductsGridProps = {
  products: ProductType[]
  productLabel?: string // e.g., "cake" or "cupcake"
}

export default function ProductsGrid({ products, productLabel = 'item' }: ProductsGridProps) {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all')

  // Get unique occasions
  const occasions = useMemo(() => {
    const uniqueOccasions = Array.from(new Set(products.map(p => p.occasion)))
    return ['all', ...uniqueOccasions]
  }, [products])

  // Filter products based on selected occasion
  const filteredProducts = useMemo(() => {
    if (selectedOccasion === 'all') {
      return products
    }
    return products.filter(p => p.occasion === selectedOccasion)
  }, [products, selectedOccasion])

  // Format occasion name for display
  const formatOccasion = (occasion: string) => {
    if (occasion === 'all') return `All ${productLabel}s`
    return occasion.charAt(0).toUpperCase() + occasion.slice(1)
  }

  const pluralLabel = filteredProducts.length === 1 ? productLabel : `${productLabel}s`

  return (
    <div className={styles.container}>
      {/* Occasion Filter */}
      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          {occasions.map((occasion) => (
            <button
              key={occasion}
              onClick={() => setSelectedOccasion(occasion)}
              className={`${styles.filterButton} ${
                selectedOccasion === occasion ? styles.active : ''
              }`}
            >
              {formatOccasion(occasion)}
            </button>
          ))}
        </div>
        <div className={styles.resultsCount}>
          {filteredProducts.length} {pluralLabel} available
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
          <p>No {productLabel}s found for this occasion.</p>
        </div>
      )}
    </div>
  )
}
