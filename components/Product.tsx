'use client'
import styles from "./Product.module.css"
import { Product as ProductType } from '@/types/product'
import Link from 'next/link'
import { useState } from 'react'
import DateOrderModal from './DateOrderModal'

type ProductProps = ProductType

export default function Product({
  id,
  name,
  description,
  price,
  image,
  category,
  occasion,
  type,
  available
}: ProductProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Determine the detail page route based on product type
  const getDetailRoute = () => {
    switch (type) {
      case 'cake':
        return `/cakes/${id}`
      case 'cupcake':
        return `/cupcakes/${id}`
      case 'letterbox':
        return `/letterbox-cakes/${id}`
      case 'digital':
        return `/digital-products/${id}`
      default:
        return `/store/${id}`
    }
  }
  const detailRoute = getDetailRoute()

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
          <span className={styles.price}>£{price.toFixed(2)}</span>

          <div className={styles.actions}>
            <Link href={detailRoute}>
              <button className={styles.detailsButton}>Details</button>
            </Link>
            {type === 'letterbox' && (
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={!available}
                className={styles.addButton}
              >
                {!available ? 'Out of Stock' : 'Buy Now'}
              </button>
            )}
          </div>
        </div>
      </div>

      {type === 'letterbox' && (
        <DateOrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={{ id, name, description, price, image, category, occasion, type, available }}
        />
      )}
    </div>
  )
}
