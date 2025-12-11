import styles from './store.module.css'
import ProductsGrid from '@/components/ProductsGrid'
import { getAllProducts } from '@/lib/products'

export default async function StorePage() {
  // Fetch products from data layer
  const products = await getAllProducts()

  return (
    <main className={styles.storeContainer}>
    </main>
  )
}
