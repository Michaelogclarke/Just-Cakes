import styles from './page.module.css'
import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'

export default function Home() {
  return (
    <main className={styles.main}>
      <Analytics />
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Just Cakes</h1>
            <p className={styles.heroSubtitle}>Handcrafted with Love, Designed to Delight</p>
            <Link href="/cakes">
              <button className={styles.heroButton}>Explore Our Collection</button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <h2 className={styles.aboutTitle}>About Us</h2>

          <div className={styles.aboutText}>
            <p>Just Cakes began with love, family, and a simple belief: everyone deserves cake they can truly enjoy.</p>

            <p>I&apos;m a mum of two and a baker of over seven years. Our journey started at home, where baking became a way to make sure celebrations always felt safe, included, and full of joy, no compromises, no one missing out. What began in our kitchen grew into something bigger, driven by care, curiosity, and a lot of testing until every recipe felt just right.</p>

            <p>At Just Cakes, we specialise in cakes and bakes that are free from egg, dairy, nuts and soy, with carefully developed gluten-free options, without compromising on taste, texture, or indulgence. Every bake is thoughtfully created to feel familiar, comforting, and celebratory, the kind of cake you&apos;d happily serve to anyone, allergy or not.</p>

            <p>We understand how important trust is when food allergies are involved. That&apos;s why allergen awareness is built into everything we do, from ingredient sourcing to baking processes, so you can order and enjoy with confidence.</p>

            <p>Our cakes are made for birthdays, weddings, school celebrations, quiet moments with a cup of tea, and now, for posting too. With our Letterbox Cake range, we&apos;ve made it easy to send a little moment of happiness through the post, perfect for thoughtful gifts and sweet surprises.</p>

            <p>Just Cakes is proudly independent, family-run, and rooted in our local community. We believe cake should feel joyful, generous, and normal, something everyone can share, celebrate, and look forward to.</p>

            <p className={styles.aboutClosing}>Because cake should be for everyone.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
