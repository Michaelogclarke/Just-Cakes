'use client'
import styles from "./Product.module.css"
import { Product as ProductType } from '@/types/product'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

type ProductProps = ProductType

export default function Product({
  id,
  name,
  description,
  price,
  image,
  category,
  available
}: ProductProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (!available) return

    const product: ProductType = {
      id,
      name,
      description,
      price,
      image,
      category,
      available
    }
    addToCart(product)
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img className={styles.image} src={image} alt={name} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{name}</h3>
          <span className={styles.category}>{category}</span>
        </div>

        <p className={styles.description}>{description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>${price.toFixed(2)}</span>

          <div className={styles.actions}>
            <Link href={`/store/${id}`}>
              <button className={styles.detailsButton}>Details</button>
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={!available}
              className={styles.addButton}
            >
              {available ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
