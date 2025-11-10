import styles from './store.module.css'
import Product from '@/components/Product'
import { getAllProducts } from '@/lib/products'

export default async function StorePage() {
  // Fetch products from data layer
  const products = await getAllProducts()

  return (
    <main>
      <h1>Our Cakes</h1>
      <div>
        {products.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>
    </main>
  )
}
