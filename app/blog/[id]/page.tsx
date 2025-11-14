import { getBlogPostById, getAllBlogPosts } from '@/lib/blogs'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import styles from './blogPost.module.css'

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    id: post.id.toString(),
  }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getBlogPostById(parseInt(params.id))

  if (!post) {
    return {
      title: 'Post Not Found - Just Cakes',
    }
  }

  return {
    title: `${post.title} - Just Cakes Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPostById(parseInt(params.id))

  if (!post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <main className={styles.container}>
      <Link href="/blog" className={styles.backLink}>
        ← Back to Blog
      </Link>

      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.categoryBadge}>{post.category}</div>
          <h1 className={styles.title}>{post.title}</h1>

          <div className={styles.meta}>
            <div className={styles.author}>
              <span className={styles.authorName}>By {post.author}</span>
              <span className={styles.divider}>•</span>
              <time className={styles.date}>{formatDate(post.date)}</time>
              <span className={styles.divider}>•</span>
              <span className={styles.readTime}>{post.readTime}</span>
            </div>
          </div>
        </header>

        <div className={styles.imageContainer}>
          <img src={post.image} alt={post.title} className={styles.image} />
        </div>

        <div className={styles.content}>
          {post.content.split('\n\n').map((paragraph, index) => {
            // Handle headings
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className={styles.heading}>
                  {paragraph.replace('## ', '')}
                </h2>
              )
            }
            // Handle bullet lists
            if (paragraph.includes('\n- ')) {
              const items = paragraph.split('\n- ').filter(item => item.trim())
              return (
                <ul key={index} className={styles.list}>
                  {items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )
            }
            // Handle numbered lists
            if (paragraph.match(/^\d+\./)) {
              const items = paragraph.split(/\n\d+\.\s/).filter(item => item.trim())
              return (
                <ol key={index} className={styles.list}>
                  {items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              )
            }
            // Regular paragraphs
            if (paragraph.trim() && !paragraph.startsWith('#')) {
              return (
                <p key={index} className={styles.paragraph}>
                  {paragraph}
                </p>
              )
            }
            return null
          })}
        </div>

        <footer className={styles.footer}>
          <div className={styles.callToAction}>
            <h3>Ready to Order Your Custom Cake?</h3>
            <p>Let's create something special for your next celebration!</p>
            <Link href="/custom-orders" className={styles.ctaButton}>
              Start Your Custom Order
            </Link>
          </div>
        </footer>
      </article>
    </main>
  )
}
