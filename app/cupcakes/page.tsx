import styles from './cupcakes.module.css'
import ProductsGrid from '@/components/ProductsGrid'
import { getAllCupcakes } from '@/lib/products'

export default async function CupcakesPage() {
  // Fetch cupcakes from data layer
  const cupcakes = await getAllCupcakes()

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Our Cupcakes</h1>
      </div>

      <ProductsGrid products={cupcakes} productLabel="cupcake" />
    </main>
  )
}
