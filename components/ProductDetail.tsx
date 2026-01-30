'use client'

import { Product } from '@/types/product'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './ProductDetail.module.css'

interface ProductDetailProps {
  product: Product
}

const LETTERBOX_FLAVOURS = [
  'Chocolate Fudge',
  'Vanilla Bean',
  'Red Velvet',
  'Strawberry Shortcake',
  'Carrot Cake',
  'Lemon Bliss',
  'Black Forest',
  'Tiramisu',
  'Coconut Cream',
  'Triple Berry'
]

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart()
  const router = useRouter()
  const [flavour1, setFlavour1] = useState('')
  const [flavour2, setFlavour2] = useState('')
  const [flavour3, setFlavour3] = useState('')

  const isCustomLetterbox = product.id === 'letterbox-custom'

  const handleAddToCart = () => {
    if (isCustomLetterbox) {
      if (!flavour1 || !flavour2 || !flavour3) {
        alert('Please select all 3 flavours')
        return
      }
      addToCart({
        ...product,
        customOptions: {
          flavours: [flavour1, flavour2, flavour3]
        }
      })
    } else {
      addToCart(product)
    }
  }

  const handleBackToStore = () => {
    router.push('/')
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

          {isCustomLetterbox && (
            <div className={styles.flavourSelection}>
              <h3>Select Your 3 Flavours</h3>

              <div className={styles.flavourDropdown}>
                <label htmlFor="flavour1">Flavour 1:</label>
                <select
                  id="flavour1"
                  value={flavour1}
                  onChange={(e) => setFlavour1(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Choose a flavour...</option>
                  {LETTERBOX_FLAVOURS.map(flavour => (
                    <option key={flavour} value={flavour}>{flavour}</option>
                  ))}
                </select>
              </div>

              <div className={styles.flavourDropdown}>
                <label htmlFor="flavour2">Flavour 2:</label>
                <select
                  id="flavour2"
                  value={flavour2}
                  onChange={(e) => setFlavour2(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Choose a flavour...</option>
                  {LETTERBOX_FLAVOURS.map(flavour => (
                    <option key={flavour} value={flavour}>{flavour}</option>
                  ))}
                </select>
              </div>

              <div className={styles.flavourDropdown}>
                <label htmlFor="flavour3">Flavour 3:</label>
                <select
                  id="flavour3"
                  value={flavour3}
                  onChange={(e) => setFlavour3(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Choose a flavour...</option>
                  {LETTERBOX_FLAVOURS.map(flavour => (
                    <option key={flavour} value={flavour}>{flavour}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

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
