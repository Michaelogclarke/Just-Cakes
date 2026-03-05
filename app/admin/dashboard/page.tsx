'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdmin } from '@/context/AdminContext'
import { BlogPost } from '@/types/blog'
import styles from './dashboard.module.css'

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAdmin()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router, mounted])

  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetch('/api/blogs').then(r => r.json()).then(setBlogPosts)
    }
  }, [mounted, isAuthenticated])

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
            <p>Manage your products and blog posts</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.quickLinks}>
          <Link href="/admin/products" className={styles.quickLinkCard}>
            <div className={styles.quickLinkIcon}>🛍️</div>
            <h3>Manage Products</h3>
            <p>Add, edit, and manage your cakes and cupcakes</p>
          </Link>
          <Link href="/admin/blogs" className={styles.quickLinkCard}>
            <div className={styles.quickLinkIcon}>📝</div>
            <h3>Manage Blogs</h3>
            <p>Create and edit blog posts</p>
          </Link>
        </div>

        <div className={styles.actions}>
          <Link href="/admin/products/new" className={styles.createButton}>
            + Add New Product
          </Link>
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
