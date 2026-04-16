'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './CookieBanner.module.css'

const COOKIE_KEY = 'jc_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY)
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <div className={styles.content}>
        <p>
          We use cookies to improve your experience and analyse site traffic. By clicking &ldquo;Accept&rdquo; you
          consent to our use of cookies. See our{' '}
          <Link href="/privacy-policy">Privacy Policy</Link> for more information.
        </p>
        <div className={styles.actions}>
          <button className={styles.decline} onClick={decline}>
            Decline
          </button>
          <button className={styles.accept} onClick={accept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
