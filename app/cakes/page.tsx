import styles from './cakes.module.css'
import ProductsGrid from '@/components/ProductsGrid'
import { getAllCakes } from '@/lib/products'

export default async function CakesPage() {
  // Fetch cakes from data layer
  const cakes = await getAllCakes()

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Our Cakes</h1>
      </div>

      <ProductsGrid products={cakes} productLabel="cake" />
    </main>
  )
}
