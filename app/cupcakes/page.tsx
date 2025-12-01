'use client'

import { useState, useEffect } from 'react'
import styles from './cupcakes.module.css'
import ProductsGrid from '@/components/ProductsGrid'
import { getAllCupcakes } from '@/lib/products'
import { Product } from '@/types/product'

export default function CupcakesPage() {
  const [allCupcakes, setAllCupcakes] = useState<Product[]>([])
  const [filteredCupcakes, setFilteredCupcakes] = useState<Product[]>([])
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string } | null>(null)

  useEffect(() => {
    // Fetch cupcakes on mount
    getAllCupcakes().then(cupcakes => {
      setAllCupcakes(cupcakes)
      setFilteredCupcakes(cupcakes)
    })
  }, [])

  useEffect(() => {
    // Listen for filter changes from URL hash
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove #
      if (!hash) {
        setFilteredCupcakes(allCupcakes)
        setActiveFilter(null)
        return
      }

      const [type, value] = hash.split('=')
      if (type && value) {
        setActiveFilter({ type, value })
        const filtered = allCupcakes.filter(cupcake => {
          if (type === 'category') return cupcake.category === value
          if (type === 'occasion') return cupcake.occasion === value
          return true
        })
        setFilteredCupcakes(filtered)
      }
    }

    handleHashChange() // Initial check
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [allCupcakes])

  const headerTitle = activeFilter
    ? `${activeFilter.value.charAt(0).toUpperCase() + activeFilter.value.slice(1)} Cupcakes`
    : 'Our Cupcakes'

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>{headerTitle}</h1>
      </div>

      <ProductsGrid products={filteredCupcakes} productLabel="cupcake" />
    </main>
  )
}
