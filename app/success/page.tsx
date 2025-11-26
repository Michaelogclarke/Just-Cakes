import Link from 'next/link'
import styles from './success.module.css'

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.successIcon}>
            <svg className={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className={styles.title}>
            Order Confirmed! 🎂
          </h1>

          <p className={styles.subtitle}>
            Thank you for choosing Just Cakes!
          </p>

          <p className={styles.description}>
            Your delicious treats are being prepared with love. You&apos;ll receive a confirmation email with all the details shortly.
          </p>

          {params.session_id && (
            <div className={styles.orderReference}>
              <p className={styles.orderLabel}>Order Reference</p>
              <p className={styles.orderId}>
                {params.session_id.slice(0, 20)}...
              </p>
            </div>
          )}

          <div className={styles.actions}>
            <Link href="/" className={styles.primaryButton}>
              Continue Shopping
            </Link>
          </div>

          <div className={styles.contact}>
            <p>Questions about your order?</p>
            <p>Contact us at <span className={styles.contactEmail}>hello@justcakes.com</span></p>
          </div>
        </div>

        <div className={styles.decorative}>
          <div className={styles.cakeEmoji}>🍰</div>
          <p className={styles.tagline}>Made with love, delivered with care</p>
        </div>
      </div>
    </div>
  )
}
