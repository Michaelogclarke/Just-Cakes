'use client'

import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo and Description */}
        <div className={styles.footerSection}>
          <div className={styles.logoSection}>
            <img src="/updated-logo.png" alt="Just Cakes Logo" className={styles.logo} />
            <p className={styles.description}>
              Crafting delicious cakes and cupcakes for every occasion. Made with love, baked fresh daily.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Shop</h3>
          <ul className={styles.linkList}>
            <li><Link href="/cakes">Cakes</Link></li>
            <li><Link href="/cupcakes">Cupcakes</Link></li>
            <li><Link href="/letterbox-cakes">Letterbox Cakes</Link></li>
            <li><Link href="/digital-products">Digital Products</Link></li>
            <li><Link href="/custom-orders">Custom Orders</Link></li>
          </ul>
        </div>

        {/* Information */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Information</h3>
          <ul className={styles.linkList}>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Contact</h3>
          <ul className={styles.contactList}>
            <li>
              <strong>Email:</strong><br />
              hello@justcakes.com
            </li>
            <li>
              <strong>Phone:</strong><br />
              (555) 123-4567
            </li>
            <li>
              <strong>Hours:</strong><br />
              Mon-Fri: 9am - 6pm<br />
              Sat: 10am - 4pm
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.footerBottom}>
        <div className={styles.bottomContent}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Just Cakes. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <span className={styles.divider}>|</span>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
