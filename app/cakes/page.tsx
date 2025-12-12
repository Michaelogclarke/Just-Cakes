'use client'

import { useState, useEffect } from 'react'
import styles from './cakes.module.css'
import ProductsGrid from '@/components/ProductsGrid'
import { Product } from '@/types/product'

export default function CakesPage() {
  const [allCakes, setAllCakes] = useState<Product[]>([])
  const [filteredCakes, setFilteredCakes] = useState<Product[]>([])
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string } | null>(null)

  useEffect(() => {
    // Fetch cakes from API on mount
    async function fetchCakes() {
      try {
        const response = await fetch('/api/products')
        const allProducts = await response.json()
        const cakes = allProducts.filter((p: Product) => p.type === 'cake')
        setAllCakes(cakes)
        setFilteredCakes(cakes)
      } catch (error) {
        console.error('Failed to fetch cakes:', error)
      }
    }
    fetchCakes()
  }, [])

  useEffect(() => {
    // Listen for filter changes from URL hash
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove #
      if (!hash) {
        setFilteredCakes(allCakes)
        setActiveFilter(null)
        return
      }

      const [type, value] = hash.split('=')
      if (type && value) {
        setActiveFilter({ type, value })
        const filtered = allCakes.filter(cake => {
          if (type === 'category') return cake.category === value
          if (type === 'occasion') return cake.occasion === value
          return true
        })
        setFilteredCakes(filtered)
      }
    }

    handleHashChange() // Initial check
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [allCakes])

  const headerTitle = activeFilter
    ? `${activeFilter.value.charAt(0).toUpperCase() + activeFilter.value.slice(1)} Cakes`
    : 'Our Cakes'

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>{headerTitle}</h1>
      </div>

      <ProductsGrid products={filteredCakes} productLabel="cake" />
    </main>
  )
}
