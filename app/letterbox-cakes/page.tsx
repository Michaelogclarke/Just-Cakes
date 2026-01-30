'use client'

import { useState, useEffect } from 'react'
import styles from './letterbox-cakes.module.css'
import ProductsGrid from '@/components/ProductsGrid'
import { Product } from '@/types/product'

export default function LetterboxCakesPage() {
  const [allLetterboxCakes, setAllLetterboxCakes] = useState<Product[]>([])
  const [filteredLetterboxCakes, setFilteredLetterboxCakes] = useState<Product[]>([])
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string } | null>(null)

  useEffect(() => {
    // Fetch letterbox cakes from API on mount
    async function fetchLetterboxCakes() {
      try {
        const response = await fetch('/api/products')
        const allProducts = await response.json()
        const letterboxCakes = allProducts.filter((p: Product) => p.type === 'letterbox')
        setAllLetterboxCakes(letterboxCakes)
        setFilteredLetterboxCakes(letterboxCakes)
      } catch (error) {
        console.error('Failed to fetch letterbox cakes:', error)
      }
    }
    fetchLetterboxCakes()
  }, [])

  useEffect(() => {
    // Listen for filter changes from URL hash
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove #
      if (!hash) {
        setFilteredLetterboxCakes(allLetterboxCakes)
        setActiveFilter(null)
        return
      }

      const [type, value] = hash.split('=')
      if (type && value) {
        setActiveFilter({ type, value })
        const filtered = allLetterboxCakes.filter(letterboxCake => {
          if (type === 'category') return letterboxCake.category === value
          if (type === 'occasion') return letterboxCake.occasion === value
          return true
        })
        setFilteredLetterboxCakes(filtered)
      }
    }

    handleHashChange() // Initial check
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [allLetterboxCakes])

  const headerTitle = activeFilter
    ? `${activeFilter.value.charAt(0).toUpperCase() + activeFilter.value.slice(1)} Letterbox Cakes`
    : 'Letterbox Cakes'

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>{headerTitle}</h1>
        <p className={styles.subtitle}>Choose your custom letterbox cakes - perfect for trying multiple flavours!</p>
      </div>

      <ProductsGrid products={filteredLetterboxCakes} productLabel="letterbox" />
    </main>
  )
}
