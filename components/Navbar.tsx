'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { cart } = useCart()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className={styles.navcontainer}>
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className={styles.overlay}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <div className={styles.navContent}>
        {/* Logo Section */}
        <Link href="/" className={styles.logoLink}>
          <img src="/updated-logo.png" alt="Just Cakes Logo" className={styles.logo} />
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          <li>
            <Link
              href="/"
              className={isActive('/') ? styles.active : ''}
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>

          {/* Cakes with Dropdown */}
          <li className={styles.dropdownContainer}>
            <Link
              href="/cakes"
              className={isActive('/cakes') || pathname?.startsWith('/cakes/') ? styles.active : ''}
              onClick={closeMenu}
            >
              Cakes
            </Link>
          </li>

          {/* Cupcakes with Dropdown */}
          <li className={styles.dropdownContainer}>
            <Link
              href="/cupcakes"
              className={isActive('/cupcakes') || pathname?.startsWith('/cupcakes/') ? styles.active : ''}
              onClick={closeMenu}
            >
              Cupcakes
            </Link>
          </li>

          {/* Letterbox Cakes with Dropdown */}
          <li className={styles.dropdownContainer}>
            <Link
              href="/letterbox-cakes"
              className={isActive('/letterbox-cakes') || pathname?.startsWith('/letterbox-cakes/') ? styles.active : ''}
              onClick={closeMenu}
            >
              Letterbox Cakes
            </Link>
          </li>

          {/* Digital Products with Dropdown */}
          <li className={styles.dropdownContainer}>
            <Link
              href="/digital-products"
              className={isActive('/digital-products') ? styles.active : ''}
              onClick={closeMenu}
            >
             Digital Products
            </Link>
            <div className={styles.dropdown}>
              <div className={styles.dropdownContent}>
                <div className={styles.dropdownSection}>
                  <h3 className={styles.dropdownTitle}>Browse</h3>
                  <Link href="/digital-products#category=cookbook" className={styles.dropdownLink}>
                    Cookbooks
                  </Link>
                  <Link href="/digital-products" className={styles.dropdownLink}>
                    All Products
                  </Link>
                </div>
              </div>
            </div>
          </li>

          <li>
            <Link
              href="/contact"
              className={isActive('/contact') ? styles.active : ''}
              onClick={closeMenu}
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className={isActive('/blog') || pathname?.startsWith('/blog/') ? styles.active : ''}
              onClick={closeMenu}
            >
             Blog
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className={isActive('/cart') ? styles.active : ''}
              onClick={closeMenu}
            >
              Cart {cart.totalItems > 0 && `(${cart.totalItems})`}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
