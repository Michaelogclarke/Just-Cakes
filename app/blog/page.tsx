import { getAllBlogPosts } from '@/lib/blogs'
import BlogCard from '@/components/BlogCard'
import styles from './blog.module.css'

export const metadata = {
  title: 'Blog - Just Cakes',
  description: 'Tips, recipes, and inspiration for all things cakes',
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <main className={styles.blogContainer}>
      <div className={styles.header}>
        <h1>Our Blog</h1>
        <p className={styles.subtitle}>
          Tips, recipes, and inspiration for creating the perfect cake for every occasion
        </p>
      </div>

      <div className={styles.blogGrid}>
        {posts.map((post) => (
          <BlogCard key={post.id} {...post} />
        ))}
      </div>
    </main>
  )
}
