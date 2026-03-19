import Image from 'next/image'
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPostById(parseInt(id))

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

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPostById(parseInt(id))

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
          <Image src={post.image} alt={post.title} className={styles.image} width={800} height={400} />
        </div>

        <div className={styles.content}>
          {(() => {
            const renderInline = (text: string) => {
              const parts = text.split('**')
              return parts.map((part, i) =>
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )
            }

            const paragraphs = post.content.split('\n\n')
            let firstParagraphSeen = false

            return paragraphs.map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <div key={index} className={styles.sectionBreak}>
                    <h2 className={styles.heading}>
                      {paragraph.replace('## ', '')}
                    </h2>
                  </div>
                )
              }

              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className={styles.subheading}>
                    {paragraph.replace('### ', '')}
                  </h3>
                )
              }

              if (paragraph.includes('\n- ')) {
                const items = paragraph.split('\n- ').filter(item => item.trim())
                return (
                  <ul key={index} className={styles.list}>
                    {items.map((item, i) => (
                      <li key={i}>{renderInline(item)}</li>
                    ))}
                  </ul>
                )
              }

              if (paragraph.match(/^\d+\./)) {
                const items = paragraph.split(/\n\d+\.\s/).filter(item => item.trim())
                return (
                  <ol key={index} className={styles.list}>
                    {items.map((item, i) => (
                      <li key={i}>{renderInline(item)}</li>
                    ))}
                  </ol>
                )
              }

              if (paragraph.trim() && !paragraph.startsWith('#')) {
                if (!firstParagraphSeen) {
                  firstParagraphSeen = true
                  return (
                    <p key={index} className={styles.leadParagraph}>
                      {renderInline(paragraph)}
                    </p>
                  )
                }
                return (
                  <p key={index} className={styles.paragraph}>
                    {renderInline(paragraph)}
                  </p>
                )
              }

              return null
            })
          })()}
        </div>

        <footer className={styles.footer}>
          <div className={styles.callToAction}>
            <h3>Ready to Order Your Custom Cake?</h3>
            <p>Let&apos;s create something special for your next celebration!</p>
            <Link href="/cakes" className={styles.ctaButton}>
              Start Your Custom Order
            </Link>
          </div>
        </footer>
      </article>
    </main>
  )
}
