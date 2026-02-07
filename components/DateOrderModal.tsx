'use client'

import { useState } from 'react'
import Modal from './Modal'
import styles from './DateOrderModal.module.css'
import { Product } from '@/types/product'

interface DateOrderModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

export default function DateOrderModal({ isOpen, onClose, product }: DateOrderModalProps) {
  const [deliveryDate, setDeliveryDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate minimum date (7 days from now)
  const getMinDate = () => {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate date is selected
    if (!deliveryDate) {
      setError('Please select a delivery date')
      return
    }

    // Validate date is at least 7 days in the future
    const minDate = new Date(getMinDate())
    const selectedDate = new Date(deliveryDate)
    if (selectedDate < minDate) {
      setError('Delivery date must be at least 7 days from today')
      return
    }

    setIsSubmitting(true)

    try {
      // Create checkout session with delivery date
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            quantity: 1
          }],
          deliveryDate: deliveryDate
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url
      } else {
        setError('Failed to create checkout session. Please try again.')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setDeliveryDate('')
      setError(null)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Select Delivery Date">
      <div className={styles.modalContent}>
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productPrice}>£{product.price.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="deliveryDate" className={styles.label}>
              Delivery Date <span className={styles.required}>*</span>
            </label>
            <p className={styles.hint}>
              Please select a date at least 7 days from today
            </p>
            <input
              type="date"
              id="deliveryDate"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              min={getMinDate()}
              className={styles.dateInput}
              disabled={isSubmitting}
              required
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !product.available}
          >
            {isSubmitting ? 'Processing...' : product.available ? 'Confirm Order' : 'Out of Stock'}
          </button>
        </form>
      </div>
    </Modal>
  )
}
