'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { usePathname } from 'next/navigation'
import styles from './CartBubble.module.css'

export default function CartBubble() {
  const { cart } = useCart()
  const pathname = usePathname()

  // Hide on cart page
  if (pathname === '/cart') return null

  return (
    <Link href="/cart" className={styles.cartBubble}>
      <div className={styles.iconContainer}>
        <svg
          className={styles.icon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {cart.totalItems > 0 && (
          <span className={styles.badge}>{cart.totalItems}</span>
        )}
      </div>
    </Link>
  )
}
