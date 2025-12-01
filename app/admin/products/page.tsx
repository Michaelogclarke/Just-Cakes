'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdmin } from '@/context/AdminContext'
import { products } from '@/lib/products'
import styles from './products.module.css'

export default function AdminProductsPage() {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router, mounted])

  if (!mounted || !isAuthenticated) {
    return null
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

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{products.length}</div>
            <div className={styles.statLabel}>Total Products</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{cakes.length}</div>
            <div className={styles.statLabel}>Cakes</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{cupcakes.length}</div>
            <div className={styles.statLabel}>Cupcakes</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{slices.length}</div>
            <div className={styles.statLabel}>Slices</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{digitalProducts.length}</div>
            <div className={styles.statLabel}>Digital Products</div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>All Products</h2>
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
                {products.map((product) => (
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
        </div>
      </main>
    </div>
  )
}
