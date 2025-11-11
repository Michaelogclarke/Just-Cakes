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
      <div>
        <Link href="/">
          <h1>Just Cakes</h1>
        </Link>
        <ul>
          <li>
            <Link
              href="/"
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/store"
              className={isActive('/store') || pathname?.startsWith('/store/') ? 'active' : ''}
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              href="/store"
              className={isActive('/store') || pathname?.startsWith('/store/') ? 'active' : ''}
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              href="/store"
              className={isActive('/store') || pathname?.startsWith('/store/') ? 'active' : ''}
            >
             Digital Products
            </Link>
          </li>
          <li>
            <Link
              href="/store"
              className={isActive('/store') || pathname?.startsWith('/store/') ? 'active' : ''}
            >
             Blogs
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className={isActive('/cart') ? 'active' : ''}
            >
              Cart {cart.totalItems > 0 && `(${cart.totalItems})`}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
