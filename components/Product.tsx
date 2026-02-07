'use client'
import styles from "./Product.module.css"
import { Product as ProductType } from '@/types/product'
import Link from 'next/link'
import { useState } from 'react'

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
  const [isLoading, setIsLoading] = useState(false)

  const handleBuyNow = async () => {
    if (!available || isLoading) return

    setIsLoading(true)
    try {
      // Create a checkout session with this single product
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id,
            name,
            description,
            price,
            image,
            quantity: 1
          }]
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
        alert('Failed to start checkout. Please try again.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
      setIsLoading(false)
    }
  }

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
            <button
              onClick={handleBuyNow}
              disabled={!available || isLoading}
              className={styles.addButton}
            >
              {!available ? 'Out of Stock' : isLoading ? 'Loading...' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
