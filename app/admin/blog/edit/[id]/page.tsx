'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdmin } from '@/context/AdminContext'
import { getBlogPostById } from '@/lib/blogs'
import styles from '../../new/newPost.module.css'

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAdmin()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    image: '',
    readTime: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router, mounted])

  useEffect(() => {
    const loadPost = async () => {
      const post = await getBlogPostById(parseInt(params.id))
      if (post) {
        setFormData({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          category: post.category,
          image: post.image,
          readTime: post.readTime
        })
      }
      setLoading(false)
    }

    if (mounted && isAuthenticated) {
      loadPost()
    }
  }, [params.id, mounted, isAuthenticated])

  if (!mounted || !isAuthenticated || loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Loading...
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call - replace with actual database update
    await new Promise(resolve => setTimeout(resolve, 1000))

    const updatedPost = {
      id: parseInt(params.id),
      ...formData,
      date: new Date().toISOString().split('T')[0]
    }

    console.log('Updated blog post to save:', updatedPost)

    // TODO: Add database update logic here
    // Example: await updateBlogPost(updatedPost)

    setSuccessMessage('Blog post updated successfully! Redirecting...')
    setTimeout(() => {
      router.push('/admin/dashboard')
    }, 2000)

    setIsSubmitting(false)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin/dashboard" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1>Edit Blog Post</h1>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.mainColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Post Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter an engaging title for your blog post"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="excerpt">Excerpt *</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                placeholder="Write a brief summary that will appear on the blog listing page"
                required
              />
              <small>{formData.excerpt.length} characters</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content">Full Content *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={20}
                placeholder="Write your full blog post content here..."
                required
              />
              <small>{formData.content.length} characters</small>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <h3>Post Details</h3>

              <div className={styles.formGroup}>
                <label htmlFor="author">Author Name *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Wedding Cakes">Wedding Cakes</option>
                  <option value="Birthday Cakes">Birthday Cakes</option>
                  <option value="Tutorials">Tutorials</option>
                  <option value="Seasonal">Seasonal</option>
                  <option value="Tips & Tricks">Tips & Tricks</option>
                  <option value="Recipes">Recipes</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="readTime">Read Time *</label>
                <input
                  type="text"
                  id="readTime"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 min read"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Featured Image URL *</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="/path/to/image.jpg"
                  required
                />
                <small>Use an existing image or upload to /public folder</small>
              </div>
            </div>

            <div className={styles.infoBox}>
              <h4>💡 Editing Tips</h4>
              <ul>
                <li>Review for spelling and grammar</li>
                <li>Ensure all links are working</li>
                <li>Check image paths are correct</li>
                <li>Update read time if content changed significantly</li>
              </ul>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className={styles.successMessage}>
            {successMessage}
          </div>
        )}

        <div className={styles.formActions}>
          <Link href="/admin/dashboard" className={styles.cancelButton}>
            Cancel
          </Link>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Blog Post'}
          </button>
        </div>

        <div className={styles.devNote}>
          <strong>Developer Note:</strong> This form currently logs to console. Replace the TODO in the handleSubmit function with your database update logic.
        </div>
      </form>
    </div>
  )
}
