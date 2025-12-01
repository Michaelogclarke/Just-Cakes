'use client'

import { useState, useEffect } from 'react'
import styles from './digital-products.module.css'
import ProductsGrid from '@/components/ProductsGrid'
import { getAllDigitalProducts } from '@/lib/products'
import { Product } from '@/types/product'

export default function DigitalProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string } | null>(null)

  useEffect(() => {
    // Fetch digital products on mount
    getAllDigitalProducts().then(products => {
      setAllProducts(products)
      setFilteredProducts(products)
    })
  }, [])

  useEffect(() => {
    // Listen for filter changes from URL hash
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove #
      if (!hash) {
        setFilteredProducts(allProducts)
        setActiveFilter(null)
        return
      }

      const [type, value] = hash.split('=')
      if (type && value) {
        setActiveFilter({ type, value })
        const filtered = allProducts.filter(product => {
          if (type === 'category') return product.category === value
          return true
        })
        setFilteredProducts(filtered)
      }
    }

    handleHashChange() // Initial check
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [allProducts])

  const headerTitle = activeFilter
    ? `${activeFilter.value.charAt(0).toUpperCase() + activeFilter.value.slice(1)}`
    : 'Digital Products'

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>{headerTitle}</h1>
        <p className={styles.subtitle}>Downloadable cookbooks and guides</p>
      </div>

      <ProductsGrid products={filteredProducts} productLabel="product" />
    </main>
  )
}
