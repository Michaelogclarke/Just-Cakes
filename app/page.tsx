import styles from './page.module.css'
import Carousel from '@/components/Carousel'
import Product from '@/components/Product'
import { getAllProducts } from '@/lib/products'
import Link from 'next/link'

export default async function Home() {
  const products = await getAllProducts()
  const featuredProducts = products.slice(0, 6)

  const carouselImages = [
    '/carousel/barbie-cake.png',
    '/carousel/Princess-cake.jpg',
    '/carousel/full-cake-display.jpeg',
    '/carousel/Rian-cake.jpg',
  ]

  return (
    <main className={styles.main}>
      {/* Hero Carousel */}
      <section className={styles.heroSection}>
        <Carousel images={carouselImages} />
      </section>

      {/* Featured Products */}
      <section className={styles.productsSection}>
        <div className={styles.productsHeader}>
          <h2>Some of Our Products</h2>
          <Link href="/store">
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
