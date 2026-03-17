'use client'

import { useState, useEffect } from 'react'
import styles from './NewsletterPopup.module.css'

const STORAGE_KEY = 'jc_newsletter_dismissed'

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (dismissed) return

    const timer = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, 'dismissed')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
        localStorage.setItem(STORAGE_KEY, 'subscribed')
      } else {
        setError(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setError('Failed to subscribe. Please try again.')
    }
  }

  if (!visible) return null

  return (
    <div className={`${styles.popup} ${visible ? styles.visible : ''}`} role="dialog" aria-label="Newsletter signup">
      <button className={styles.closeBtn} onClick={handleClose} aria-label="Close newsletter popup">
        ×
      </button>

      {submitted ? (
        <div className={styles.success}>
          <span className={styles.successIcon}>🎂</span>
          <h3>You&apos;re in!</h3>
          <p>Thanks for subscribing. Expect sweet updates from us soon!</p>
        </div>
      ) : (
        <>
          <div className={styles.heading}>
            <span className={styles.icon}>🎉</span>
            <div>
              <h3>Get sweet updates</h3>
              <p>New cakes, events &amp; exclusive offers — straight to your inbox.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.inputRow}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                aria-label="Email address"
              />
              <button type="submit" className={styles.submitBtn}>
                Subscribe
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </form>

          <p className={styles.noSpam}>No spam, unsubscribe any time.</p>
        </>
      )}
    </div>
  )
}
