'use client'

import Link from 'next/link'
import { BlogPost } from '@/types/blog'
import styles from './BlogCard.module.css'

export default function BlogCard({ id, title, excerpt, author, date, image, category, readTime }: BlogPost) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <article className={styles.card}>
      <Link href={`/blog/${id}`} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
          <div className={styles.categoryBadge}>{category}</div>
        </div>
      </Link>

      <div className={styles.content}>
        <Link href={`/blog/${id}`} className={styles.titleLink}>
          <h2 className={styles.title}>{title}</h2>
        </Link>

        <p className={styles.excerpt}>{excerpt}</p>

        <div className={styles.meta}>
          <div className={styles.author}>
            <span className={styles.authorName}>By {author}</span>
            <span className={styles.divider}>•</span>
            <time className={styles.date}>{formatDate(date)}</time>
          </div>
          <span className={styles.readTime}>{readTime}</span>
        </div>

        <Link href={`/blog/${id}`} className={styles.readMore}>
          Read More →
        </Link>
      </div>
    </article>
  )
}
