import type { Metadata } from 'next'
import styles from './terms.module.css'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Just Cakes',
  description: 'Terms and Conditions for purchasing from Just Cakes Bakery.',
}

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Terms &amp; Conditions</h1>
        <p className={styles.updated}>Last updated: April 2025</p>

        <section>
          <h2>1. About Us</h2>
          <p>
            Just Cakes is an allergy-friendly bakery based in Ballykelly, Northern Ireland. By placing an order or
            using our website, you agree to these terms. Contact us at{' '}
            <a href="mailto:justcakesballykelly@gmail.com">justcakesballykelly@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2>2. Orders</h2>
          <ul>
            <li>All orders are subject to availability and confirmation of the order price.</li>
            <li>Custom cake orders require a deposit at the time of booking, with the balance due before collection/delivery.</li>
            <li>We reserve the right to refuse an order at our discretion.</li>
            <li>Once an order is confirmed, any changes must be requested at least 72 hours in advance.</li>
          </ul>
        </section>

        <section>
          <h2>3. Pricing</h2>
          <p>
            All prices are displayed in British Pounds (GBP) and include VAT where applicable. Prices are subject
            to change without notice, but changes will not affect orders already confirmed.
          </p>
        </section>

        <section>
          <h2>4. Payment</h2>
          <p>
            Payment is processed securely via Stripe. We accept major credit and debit cards. We do not store your
            payment card details.
          </p>
        </section>

        <section>
          <h2>5. Cancellations &amp; Refunds</h2>
          <ul>
            <li>Cancellations made more than 7 days before your collection/delivery date are eligible for a full refund of any deposit.</li>
            <li>Cancellations within 7 days of the order date may forfeit the deposit.</li>
            <li>Cancellations within 48 hours are non-refundable as ingredients will have been purchased and preparation begun.</li>
            <li>If we are unable to fulfil your order, you will receive a full refund.</li>
          </ul>
        </section>

        <section>
          <h2>6. Allergen Information</h2>
          <p>
            We are an allergy-friendly bakery and take allergens very seriously. However, our products are made in a
            kitchen that may handle various allergens. We cannot guarantee a completely allergen-free environment.
            Please contact us before ordering if you have severe allergies.
          </p>
        </section>

        <section>
          <h2>7. Digital Products</h2>
          <p>
            Digital products (e.g. recipe PDFs) are delivered electronically after purchase. Due to the nature of
            digital products, refunds are not offered once the file has been downloaded.
          </p>
        </section>

        <section>
          <h2>8. Intellectual Property</h2>
          <p>
            All content on this website — including images, text, and designs — is the property of Just Cakes and
            may not be reproduced without written permission.
          </p>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <p>
            To the extent permitted by law, Just Cakes shall not be liable for any indirect or consequential losses
            arising from the use of our products or website.
          </p>
        </section>

        <section>
          <h2>10. Governing Law</h2>
          <p>
            These terms are governed by the laws of Northern Ireland. Any disputes shall be subject to the exclusive
            jurisdiction of the courts of Northern Ireland.
          </p>
        </section>

        <section>
          <h2>11. Contact</h2>
          <p>
            Questions about these terms? Email us at{' '}
            <a href="mailto:justcakesballykelly@gmail.com">justcakesballykelly@gmail.com</a> or call{' '}
            <a href="tel:+447956886190">0795688619</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
