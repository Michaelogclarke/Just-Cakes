'use client'

import { Product } from '@/types/product'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import styles from './ProductDetail.module.css'

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = (useCart) => {
    addToCart(product)
 /*   alert(`${product.name} added to cart!`)*/
  }

  const handleBackToStore = () => {
    router.push('/store')
  }

  return (
    <div className={styles.container}>
      <button onClick={handleBackToStore} className={styles.backButton}>
        ← Back to Store
      </button>

      <div className={styles.productLayout}>
        <div className={styles.imageContainer}>
          <img src={product.image} alt={product.name} />
        </div>

        <div className={styles.details}>
          <div className={styles.header}>
            <h1>{product.name}</h1>
            <span className={styles.category}>{product.category}</span>
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.infoRow}>
            <div className={styles.price}>
              £{product.price.toFixed(2)}
            </div>
            <div className={styles.availability}>
              {product.available ? (
                <span className={styles.inStock}>In Stock</span>
              ) : (
                <span className={styles.outOfStock}>Out of Stock</span>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={handleAddToCart}
              disabled={!product.available}
              className={styles.addButton}
            >
              {product.available ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
