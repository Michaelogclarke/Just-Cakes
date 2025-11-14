import CustomOrderForm from '@/components/CustomOrderForm'
import styles from './custom-orders.module.css'

export const metadata = {
  title: 'Custom Orders - Just Cakes',
  description: 'Order a custom cake designed just for you',
}

export default function CustomOrdersPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Custom Cake Orders</h1>
        <p className={styles.subtitle}>
          Create your dream cake - we&apos;ll bring it to life!
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.infoSection}>
          <h2>How It Works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Share Your Vision</h3>
              <p>Fill out the form with your cake details, including size, flavor, design preferences, and occasion.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Get a Quote</h3>
              <p>We&apos;ll review your request and send you a custom quote within 24 hours.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Confirm & Pay</h3>
              <p>Once you approve the design and price, we&apos;ll schedule your order and collect payment.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Pick Up & Enjoy</h3>
              <p>Your custom cake will be ready for pickup on your chosen date!</p>
            </div>
          </div>

          <div className={styles.guidelines}>
            <h3>Important Information</h3>
            <ul>
              <li>Custom orders require at least 7 days advance notice</li>
              <li>Rush orders (3-6 days) may incur an additional fee</li>
              <li>Final designs will be sent for approval before baking begins</li>
              <li>A 50% deposit is required to confirm your order</li>
              <li>Cancellations made less than 48 hours before pickup are non-refundable</li>
            </ul>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2>Order Your Custom Cake</h2>
          <CustomOrderForm />
        </div>
      </div>
    </div>
  )
}
