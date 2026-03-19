'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLudmilla } from '@/context/LudmillaContext'
import { BlogPost } from '@/types/blog'
import styles from './blogs.module.css'

export default function LudmillaBlogsPage() {
  const { isAuthenticated, logout } = useLudmilla()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/ludmilla')
    }
  }, [isAuthenticated, router, mounted])

  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetch('/api/blogs').then(r => r.json()).then(setBlogPosts)
    }
  }, [mounted, isAuthenticated])

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' })
    setBlogPosts(prev => prev.filter(p => p.id !== id))
  }

  if (!mounted || !isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/ludmilla')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Link href="/ludmilla/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
            <h1>Blog Management</h1>
            <p>Manage all your blog posts</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.actions}>
          <Link href="/ludmilla/blog/new" className={styles.createButton}>
            + Create New Blog Post
          </Link>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{blogPosts.length}</div>
            <div className={styles.statLabel}>Total Blog Posts</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {blogPosts.filter(p => new Date(p.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </div>
            <div className={styles.statLabel}>Posts This Month</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {new Set(blogPosts.map(p => p.category)).size}
            </div>
            <div className={styles.statLabel}>Categories</div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>All Blog Posts</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map((post) => (
                  <tr key={post.id}>
                    <td className={styles.titleCell}>
                      <div className={styles.postTitle}>{post.title}</div>
                      <div className={styles.postExcerpt}>{post.excerpt.substring(0, 80)}...</div>
                    </td>
                    <td>
                      <span className={styles.categoryBadge}>{post.category}</span>
                    </td>
                    <td>{post.author}</td>
                    <td>{formatDate(post.date)}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <Link href={`/blog/${post.id}`} className={styles.viewButton}>
                          View
                        </Link>
                        <Link href={`/ludmilla/blog/edit/${post.id}`} className={styles.editButton}>
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(post.id, post.title)} className={styles.deleteButton}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
