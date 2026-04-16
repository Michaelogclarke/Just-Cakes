'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo and Description */}
        <div className={styles.footerSection}>
          <div className={styles.logoSection}>
            <Image src="/Logo4.png" alt="Just Cakes Logo" className={styles.logo} width={150} height={75} />
            <p className={styles.description}>
              Allergy friendly bakery in Ballykelly offering dairy free, egg free, nut free, soy free, gluten free and vegan cakes. Safe birthday cakes and cupcake workshops. Book today.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Shop</h3>
          <ul className={styles.linkList}>
            <li><Link href="/cakes">Cakes</Link></li>
            <li><Link href="/cupcakes">Cupcakes</Link></li>
            <li><Link href="/digital-products">Digital Products</Link></li>
          </ul>
        </div>

        {/* Information */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Information</h3>
          <ul className={styles.linkList}>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.footerSection}>
          <h3 className={styles.sectionTitle}>Contact</h3>
          <ul className={styles.contactList}>
            <li>
              <strong>Email:</strong><br />
              <a href="mailto:justcakesballykelly@gmail.com">justcakesballykelly@gmail.com</a>
            </li>
            <li>
              <strong>Phone:</strong><br />
              <a href="tel:+447956886190">0795688619</a>
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
            <Link href="/privacy-policy">Privacy Policy</Link>
            <span className={styles.divider}>|</span>
            <Link href="/terms">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
