import styles from './page.module.css'
import Product from '@/components/Product'
import { getAllProducts } from '@/lib/products'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'

// Force dynamic rendering since we're using a database
export const dynamic = 'force-dynamic'

export default async function Home() {
  const products = await getAllProducts()
  const featuredProducts = products.slice(0, 6)

  return (
    <main className={styles.main}>
      <Analytics />
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Just Cakes</h1>
            <p className={styles.heroSubtitle}>Handcrafted with Love, Designed to Delight</p>
            <Link href="/cakes">
              <button className={styles.heroButton}>Explore Our Collection</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <h2>Some of Our Products</h2>
          <Link href="/cakes">
            <button className={styles.viewAllButton}>View All Products</button>
          </Link>
        </div>

        <div className={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <Product key={product.id} {...product} />
          ))}
        </div>
      </section>
    </main>
  )
}