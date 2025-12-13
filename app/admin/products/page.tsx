'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdmin } from '@/context/AdminContext'
import { Product } from '@/types/product'
import styles from './products.module.css'

export default function AdminProductsPage() {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router, mounted])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    if (mounted && isAuthenticated) {
      fetchProducts()
    }
  }, [mounted, isAuthenticated])

  // Filter products based on search and type
  useEffect(() => {
    let filtered = products

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, filterType])

  if (!mounted || !isAuthenticated) {
    return null
  }

  if (loading) {
    return <div className={styles.dashboard}>Loading products...</div>
  }

  const handleLogout = () => {
    logout()
    router.push('/admin')
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const cakes = products.filter(p => p.type === 'cake')
  const cupcakes = products.filter(p => p.type === 'cupcake')
  const slices = products.filter(p => p.type === 'slice')
  const digitalProducts = products.filter(p => p.type === 'digital')

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Link href="/admin/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
            <h1>Product Management</h1>
            <p>Manage all your cakes, cupcakes, slices, and digital products</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.actions}>
          <Link href="/admin/products/new" className={styles.createButton}>
            + Add New Product
          </Link>
        </div>

        <div className={styles.filterSection}>
          <input
            type="text"
            placeholder="Search products by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Types</option>
            <option value="cake">Cakes</option>
            <option value="cupcake">Cupcakes</option>
            <option value="slice">Slices</option>
            <option value="digital">Digital Products</option>
          </select>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statsBox}>
            <h3>Product Overview</h3>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{products.length}</span>
                <span className={styles.statLabel}>Total Products</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{cakes.length}</span>
                <span className={styles.statLabel}>Cakes</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{cupcakes.length}</span>
                <span className={styles.statLabel}>Cupcakes</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{slices.length}</span>
                <span className={styles.statLabel}>Slices</span>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{digitalProducts.length}</span>
                <span className={styles.statLabel}>Digital</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>All Products ({filteredProducts.length})</h2>
          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No products found matching your criteria.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img src={product.image} alt={product.name} className={styles.productImage} />
                      </td>
                      <td className={styles.titleCell}>
                        <div className={styles.productName}>{product.name}</div>
                        <div className={styles.productDesc}>{product.description.substring(0, 60)}...</div>
                      </td>
                      <td>
                        <span className={styles.typeBadge}>{product.type}</span>
                      </td>
                      <td>
                        <span className={styles.categoryBadge}>{product.category}</span>
                      </td>
                      <td className={styles.priceCell}>{formatPrice(product.price)}</td>
                      <td>
                        <span className={product.available ? styles.statusAvailable : styles.statusUnavailable}>
                          {product.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <Link href={`/${product.type === 'cake' || product.type === 'cupcake' || product.type === 'slice' ? product.type === 'slice' ? 'slices' : product.type + 's' : 'digital-products'}/${product.id}`} className={styles.viewButton}>
                            View
                          </Link>
                          <Link href={`/admin/products/edit/${product.id}`} className={styles.editButton}>
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className={styles.mobileCardGrid}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{product.name}</h3>
                      <div className={styles.cardPrice}>{formatPrice(product.price)}</div>
                      <div className={styles.cardActions}>
                        <Link href={`/${product.type === 'cake' || product.type === 'cupcake' || product.type === 'slice' ? product.type === 'slice' ? 'slices' : product.type + 's' : 'digital-products'}/${product.id}`} className={styles.viewButton}>
                          View
                        </Link>
                        <Link href={`/admin/products/edit/${product.id}`} className={styles.editButton}>
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
