'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import styles from './cart.module.css'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()

  if (cart.items.length === 0) {
    return (
      <main className={styles.container}>
        <div className={styles.emptyState}>
          <h1>Shopping Cart</h1>
          <p>Your cart is empty</p>
          <Link href="/">
            <button className={styles.primaryButton}>Continue Shopping</button>
          </Link>
        </div>
      </main>
    )
  }

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
        }),
      })

      const { url } = await response.json()

      if (url) {
        // Redirect to Stripe checkout
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('There was an error processing your checkout. Please try again.')
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Shopping Cart</h1>
      </div>

      <div className={styles.cartLayout}>
        <div className={styles.cartItems}>
          {cart.items.map((item, index) => (
            <div key={`${item.id}-${index}`} className={styles.cartItem}>
              <div className={styles.itemImage}>
                <img src={item.image} alt={item.name} />
              </div>

              <div className={styles.itemDetails}>
                <h3>{item.name}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
                {item.customOptions?.flavours && (
                  <div className={styles.customOptions}>
                    <strong>Selected Flavours:</strong>
                    <ul className={styles.flavourList}>
                      {item.customOptions.flavours.map((flavour, idx) => (
                        <li key={idx}>{flavour}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className={styles.itemPrice}>£{item.price.toFixed(2)}</p>
              </div>

              <div className={styles.itemQuantity}>
                <label>Qty</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value), item.customOptions)}
                />
              </div>

              <div className={styles.itemSubtotal}>
                <p className={styles.subtotalLabel}>Subtotal</p>
                <p className={styles.subtotalPrice}>£{(item.price * item.quantity).toFixed(2)}</p>
              </div>

              <button
                className={styles.removeButton}
                onClick={() => removeFromCart(item.id, item.customOptions)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className={styles.cartSummary}>
          <h2>Cart Summary</h2>

          <div className={styles.summaryRow}>
            <span>Total Items:</span>
            <span>{cart.totalItems}</span>
          </div>

          <div className={styles.summaryTotal}>
            <span>Total:</span>
            <span>£{cart.totalPrice.toFixed(2)}</span>
          </div>

          <div className={styles.summaryActions}>
            <button
              className={styles.primaryButton}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
            <Link href="/cakes">
              <button className={styles.secondaryButton}>Continue Shopping</button>
            </Link>
            <button
              className={styles.clearButton}
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
