'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdmin } from '@/context/AdminContext'
import { blogPosts } from '@/lib/blogs'
import styles from './dashboard.module.css'

export default function AdminDashboard() {
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
            <h1>Admin Dashboard</h1>
            <p>Manage your blog posts and content</p>
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

        <div className={styles.infoBox}>
          <h3>🔒 Database Integration</h3>
          <p>
            Currently using mock data from <code>lib/blogs.ts</code>. When you're ready to connect a database:
          </p>
          <ol>
            <li>Set up your database (PostgreSQL, MongoDB, etc.)</li>
            <li>Replace the mock data functions in <code>lib/blogs.ts</code> with real database queries</li>
            <li>Update the admin forms to save to your database instead of the mock array</li>
            <li>Add proper authentication with secure backend validation</li>
          </ol>
          <p>
            The forms and UI are already built - you just need to wire up the backend!
          </p>
        </div>
      </main>
    </div>
  )
}
