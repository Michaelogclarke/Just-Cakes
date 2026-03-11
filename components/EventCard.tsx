'use client'

import { Event } from '@/types/event'
import styles from './EventCard.module.css'

interface EventCardProps extends Event {}

export default function EventCard({
  title,
  description,
  date,
  time,
  location,
  image,
  category,
  price,
  spotsLeft,
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('en-GB', options)
  }

  const isSoldOut = spotsLeft !== null && spotsLeft === 0
  const isLowAvailability = spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 5

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} className={styles.image} />
        <span className={styles.categoryBadge}>{category}</span>
        {isSoldOut && <span className={styles.soldOutBadge}>Sold Out</span>}
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailIcon}>📅</span>
            <span>{formatDate(date)}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailIcon}>🕐</span>
            <span>{time}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailIcon}>📍</span>
            <span>{location}</span>
          </div>
        </div>

        <p className={styles.description}>{description}</p>

        <div className={styles.footer}>
          <div className={styles.priceAvailability}>
            <span className={styles.price}>
              {price === 0 ? 'Free' : `£${price}`}
            </span>
            {spotsLeft !== null && (
              <span className={`${styles.spots} ${isLowAvailability ? styles.spotsLow : ''} ${isSoldOut ? styles.spotsSoldOut : ''}`}>
                {isSoldOut ? 'No spots left' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
              </span>
            )}
          </div>

          <a
            href="/contact"
            className={`${styles.bookButton} ${isSoldOut ? styles.bookButtonDisabled : ''}`}
            aria-disabled={isSoldOut}
            onClick={isSoldOut ? (e) => e.preventDefault() : undefined}
          >
            {isSoldOut ? 'Sold Out' : price === 0 ? 'Register Free' : 'Book Now'}
          </a>
        </div>
      </div>
    </article>
  )
}
