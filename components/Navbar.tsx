'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { cart } = useCart()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className={styles.navcontainer}>
      <div className={styles.navContent}>
        {/* Logo Section */}
        <Link href="/" className={styles.logoLink}>
          <img src="/updated-logo.png" alt="Just Cakes Logo" className={styles.logo} />
        </Link>

        {/* Navigation Links */}
        <ul className={styles.navLinks}>
          <li>
            <Link
              href="/"
              className={isActive('/') ? styles.active : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/store"
              className={isActive('/store') || pathname?.startsWith('/store/') ? styles.active : ''}
            >
              Products
            </Link>
          </li>
         <li>
            <Link
              href="/store"
              className={isActive('/digital-products') ? styles.active : ''}
            >
             Digital Products
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className={isActive('/blog') || pathname?.startsWith('/blog/') ? styles.active : ''}
            >
             Blog
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className={isActive('/cart') ? styles.active : ''}
            >
              Cart {cart.totalItems > 0 && `(${cart.totalItems})`}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
