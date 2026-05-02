import styles from './page.module.css'
import Product from '@/components/Product'
import { getAllProducts } from '@/lib/products'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'

// Force dynamic rendering since we're using a database
export const dynamic = 'force-dynamic'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  name: 'Just Cakes',
  description: 'Allergy-free custom cakes available for delivery and pickup.',
  servesCuisine: 'Bakery',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Allergy-Free Cakes',
  },
  potentialAction: [
    {
      '@type': 'OrderAction',
      target: 'https://justcakes.co.uk/cakes',
      deliveryMethod: ['http://purl.org/goodrelations/v1#DeliveryModePickUp', 'http://purl.org/goodrelations/v1#UPS'],
    },
  ],
}

export default async function Home() {
  const products = await getAllProducts()
  const featuredProducts = products.slice(0, 6)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <main className={styles.main}>
      <Analytics />
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Just Cakes</h1>
            <p className={styles.heroSubtitle}>Cakes for people who can’t eat Cake</p>
            <Link href="/cakes">
              <button className={styles.heroButton}>Create your first cake</button>
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
    </>
  )
}
