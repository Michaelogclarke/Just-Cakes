import type { Metadata } from 'next'
import styles from './privacy.module.css'

export const metadata: Metadata = {
  title: 'Privacy Policy | Just Cakes',
  description: 'Privacy Policy for Just Cakes Bakery — how we collect, use, and protect your personal data.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: April 2025</p>

        <section>
          <h2>1. Who We Are</h2>
          <p>
            Just Cakes is an allergy-friendly bakery based in Ballykelly, Northern Ireland. We operate the website{' '}
            <strong>justcakesbakery.com</strong>. You can contact us at{' '}
            <a href="mailto:justcakesballykelly@gmail.com">justcakesballykelly@gmail.com</a> or by phone at{' '}
            <a href="tel:+447956886190">0795688619</a>.
          </p>
        </section>

        <section>
          <h2>2. What Data We Collect</h2>
          <p>We collect the following personal data when you use our website:</p>
          <ul>
            <li>Name, email address, and phone number — when you place an order, request a quote, or contact us</li>
            <li>Order details and delivery information — to fulfil your purchase</li>
            <li>Email address — if you subscribe to our newsletter</li>
            <li>Payment information — processed securely by Stripe (we never store card details)</li>
            <li>Website usage data — via Vercel Analytics and Speed Insights</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Data</h2>
          <ul>
            <li>To process and fulfil orders</li>
            <li>To send order confirmation and updates</li>
            <li>To respond to enquiries and quote requests</li>
            <li>To send newsletters if you have subscribed (you can unsubscribe at any time)</li>
            <li>To improve our website and services</li>
          </ul>
        </section>

        <section>
          <h2>4. Legal Basis for Processing</h2>
          <p>We process your data under the following legal bases:</p>
          <ul>
            <li><strong>Contract</strong> — to fulfil orders you have placed</li>
            <li><strong>Legitimate interests</strong> — to run and improve our business</li>
            <li><strong>Consent</strong> — for newsletters (withdraw any time)</li>
          </ul>
        </section>

        <section>
          <h2>5. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies on our website. These include essential cookies required
            for the site to function, and analytics cookies to understand how visitors use our site. You can manage
            your cookie preferences at any time using our cookie banner.
          </p>
        </section>

        <section>
          <h2>6. Third Parties</h2>
          <p>We share data with the following trusted third parties only as necessary:</p>
          <ul>
            <li><strong>Stripe</strong> — payment processing</li>
            <li><strong>Brevo (Sendinblue)</strong> — email and newsletter delivery</li>
            <li><strong>Vercel</strong> — website hosting and analytics</li>
          </ul>
          <p>We do not sell your personal data to any third party.</p>
        </section>

        <section>
          <h2>7. Data Retention</h2>
          <p>
            We retain order and contact data for up to 3 years for accounting and legal purposes. Newsletter
            subscriber data is held until you unsubscribe.
          </p>
        </section>

        <section>
          <h2>8. Your Rights</h2>
          <p>Under GDPR, you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{' '}
            <a href="mailto:justcakesballykelly@gmail.com">justcakesballykelly@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>
            If you have any questions about this privacy policy, contact us at{' '}
            <a href="mailto:justcakesballykelly@gmail.com">justcakesballykelly@gmail.com</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
