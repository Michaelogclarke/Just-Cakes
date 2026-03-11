import { getAllEvents } from '@/lib/events'
import EventCard from '@/components/EventCard'
import styles from './events.module.css'

export const metadata = {
  title: 'Events - Just Cakes',
  description: 'Join us for cake decorating workshops, tastings, classes, and pop-up markets',
}

export default async function EventsPage() {
  const events = await getAllEvents()

  const today = new Date().toISOString().split('T')[0]
  const upcoming = events.filter((e) => e.date >= today)
  const past = events.filter((e) => e.date < today)

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Events & Workshops</h1>
        <p className={styles.subtitle}>
          From hands-on decorating classes to exclusive tastings and pop-up markets
        </p>
      </div>

      {upcoming.length > 0 ? (
        <section>
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>
          <div className={styles.grid}>
            {upcoming.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </section>
      ) : (
        <div className={styles.empty}>
          <p>No upcoming events at the moment — check back soon!</p>
          <a href="/contact" className={styles.contactLink}>
            Get in touch to request a private workshop
          </a>
        </div>
      )}

      {past.length > 0 && (
        <section className={styles.pastSection}>
          <h2 className={styles.sectionTitle}>Past Events</h2>
          <div className={styles.grid}>
            {past.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
