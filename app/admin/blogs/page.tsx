'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdmin } from '@/context/AdminContext'
import { blogPosts } from '@/lib/blogs'
import styles from './blogs.module.css'

export default function AdminBlogsPage() {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router, mounted])

  if (!mounted || !isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/admin')
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
            <Link href="/admin/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
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
          <Link href="/admin/blog/new" className={styles.createButton}>
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
                        <Link href={`/admin/blog/edit/${post.id}`} className={styles.editButton}>
                          Edit
                        </Link>
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
