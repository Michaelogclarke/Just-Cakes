'use client'

import { useState, useEffect } from 'react'
import styles from './slices.module.css'
import ProductsGrid from '@/components/ProductsGrid'
import { Product } from '@/types/product'

export default function SlicesPage() {
  const [allSlices, setAllSlices] = useState<Product[]>([])
  const [filteredSlices, setFilteredSlices] = useState<Product[]>([])
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string } | null>(null)

  useEffect(() => {
    // Fetch slices from API on mount
    async function fetchSlices() {
      try {
        const response = await fetch('/api/products')
        const allProducts = await response.json()
        const slices = allProducts.filter((p: Product) => p.type === 'slice')
        setAllSlices(slices)
        setFilteredSlices(slices)
      } catch (error) {
        console.error('Failed to fetch slices:', error)
      }
    }
    fetchSlices()
  }, [])

  useEffect(() => {
    // Listen for filter changes from URL hash
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove #
      if (!hash) {
        setFilteredSlices(allSlices)
        setActiveFilter(null)
        return
      }

      const [type, value] = hash.split('=')
      if (type && value) {
        setActiveFilter({ type, value })
        const filtered = allSlices.filter(slice => {
          if (type === 'category') return slice.category === value
          if (type === 'occasion') return slice.occasion === value
          return true
        })
        setFilteredSlices(filtered)
      }
    }

    handleHashChange() // Initial check
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [allSlices])

  const headerTitle = activeFilter
    ? `${activeFilter.value.charAt(0).toUpperCase() + activeFilter.value.slice(1)} Slices`
    : 'Cake Slices'

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>{headerTitle}</h1>
        <p className={styles.subtitle}>Individual cake slices - perfect for a quick treat or trying new flavors!</p>
      </div>

      <ProductsGrid products={filteredSlices} productLabel="slice" />
    </main>
  )
}
