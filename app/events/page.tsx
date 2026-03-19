'use client'

import { useState } from 'react'
import styles from './events.module.css'

export default function EventsPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setEmail('')
  }

  return (
    <main className={styles.container}>
      {/* Hero - saved for later
      <div className={styles.header}>
        <h1>Events</h1>
        <p className={styles.subtitle}>
          Something exciting is on the way — we&apos;re planning our next event and can&apos;t wait to share it with you!
        </p>
      </div>
      */}

      {/* Coming Soon */}
      <section className={styles.comingSoon}>
        <div className={styles.comingSoonBadge}>Coming Soon</div>
        <h2>Our Next Event Is Being Planned</h2>
        <p>
          Stay tuned for decorating workshops and many more to come. We&apos;ll be announcing dates very soon!
        </p>
      </section>

      {/* Recent Event Video */}
      <section className={styles.recentEvent}>
        <h2 className={styles.sectionTitle}>See Our Recent Event</h2>
        <p className={styles.recentEventSubtitle}>
          Missed our last event? Here&apos;s a look at what we got up to!
        </p>
        <div className={styles.videoWrapper}>
          <iframe
            src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fr%2F1AsDL36JAH%2F&show_text=false&width=734"
            width="734"
            height="413"
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
        </div>
      </section>

      {/* Sign Up */}
      <section className={styles.signupSection}>
        <h2>Stay in the Loop</h2>
        <p>Sign up to be the first to know when our next event is announced.</p>
        {submitted ? (
          <p className={styles.successMessage}>
            Thanks for signing up! We&apos;ll keep you posted.
          </p>
        ) : (
          <form className={styles.signupForm} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.emailInput}
            />
            <button type="submit" className={styles.signupButton}>
              Notify Me
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
