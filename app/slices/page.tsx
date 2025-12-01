'use client'

import { useState, useEffect } from 'react'
import styles from './slices.module.css'
import ProductsGrid from '@/components/ProductsGrid'
import { getAllSlices } from '@/lib/products'
import { Product } from '@/types/product'

export default function SlicesPage() {
  const [allSlices, setAllSlices] = useState<Product[]>([])
  const [filteredSlices, setFilteredSlices] = useState<Product[]>([])
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string } | null>(null)

  useEffect(() => {
    // Fetch slices on mount
    getAllSlices().then(slices => {
      setAllSlices(slices)
      setFilteredSlices(slices)
    })
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
