import styles from './digital-products.module.css'
import ProductsGrid from '@/components/ProductsGrid'
import { getAllDigitalProducts } from '@/lib/products'

export default async function DigitalProductsPage() {
  // Fetch digital products from data layer
  const digitalProducts = await getAllDigitalProducts()

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Digital Products</h1>
        <p className={styles.subtitle}>Downloadable cookbooks and guides</p>
      </div>

      <ProductsGrid products={digitalProducts} productLabel="product" />
    </main>
  )
}
