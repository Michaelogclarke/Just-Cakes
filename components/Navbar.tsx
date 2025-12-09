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

          {/* Cakes with Dropdown */}
          <li className={styles.dropdownContainer}>
            <Link
              href="/cakes"
              className={isActive('/cakes') || pathname?.startsWith('/cakes/') ? styles.active : ''}
            >
              Cakes
            </Link>
            <div className={styles.dropdown}>
              <div className={styles.dropdownContent}>
                <h3 className={styles.dropdownTitle}>By Occasion</h3>
                <div className={styles.dropdownSection}>
                  <Link href="/cakes#occasion=birthday" className={styles.dropdownLink}>
                    Birthday
                  </Link>
                  <Link href="/cakes#occasion=wedding" className={styles.dropdownLink}>
                    Wedding
                  </Link>
                  <Link href="/cakes#occasion=anniversary" className={styles.dropdownLink}>
                    Anniversary
                  </Link>
                  <Link href="/cakes#occasion=celebration" className={styles.dropdownLink}>
                    Celebration
                  </Link>
                </div>
              </div>
            </div>
          </li>

          {/* Cupcakes with Dropdown */}
          <li className={styles.dropdownContainer}>
            <Link
              href="/cupcakes"
              className={isActive('/cupcakes') || pathname?.startsWith('/cupcakes/') ? styles.active : ''}
            >
              Cupcakes
            </Link>
            <div className={styles.dropdown}>
              <div className={styles.dropdownContent}>
                <div className={styles.dropdownSection}>
                  <h3 className={styles.dropdownTitle}>By Occasion</h3>
                  <Link href="/cupcakes#occasion=birthday" className={styles.dropdownLink}>
                    Birthday
                  </Link>
                  <Link href="/cupcakes#occasion=wedding" className={styles.dropdownLink}>
                    Wedding
                  </Link>
                  <Link href="/cupcakes#occasion=anniversary" className={styles.dropdownLink}>
                    Anniversary
                  </Link>
                  <Link href="/cupcakes#occasion=celebration" className={styles.dropdownLink}>
                    Celebration
                  </Link>
                </div>
              </div>
            </div>
          </li>

          {/* Slices with Dropdown */}
          <li className={styles.dropdownContainer}>
            <Link
              href="/slices"
              className={isActive('/slices') || pathname?.startsWith('/slices/') ? styles.active : ''}
            >
              Slices
            </Link>
            <div className={styles.dropdown}>
              <div className={styles.dropdownContent}>
               <div className={styles.dropdownSection}>
                  <h3 className={styles.dropdownTitle}>By Occasion</h3>
                  <Link href="/slices#occasion=birthday" className={styles.dropdownLink}>
                    Birthday
                  </Link>
                  <Link href="/slices#occasion=celebration" className={styles.dropdownLink}>
                    Celebration
                  </Link>
                </div>
              </div>
            </div>
          </li>

          {/* Digital Products with Dropdown */}
          <li className={styles.dropdownContainer}>
            <Link
              href="/digital-products"
              className={isActive('/digital-products') ? styles.active : ''}
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
            >
              Contact
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
