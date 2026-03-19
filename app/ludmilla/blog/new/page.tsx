'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLudmilla } from '@/context/LudmillaContext'
import styles from './newPost.module.css'

export default function NewBlogPostPage() {
  const { isAuthenticated } = useLudmilla()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

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
      router.push('/ludmilla')
    }
  }, [isAuthenticated, router, mounted])

  if (!mounted || !isAuthenticated) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create blog post')
      }

      const newPost = await response.json()
      console.log('Blog post created successfully:', newPost)

      setSuccessMessage('Blog post created successfully! Redirecting...')
      setTimeout(() => {
        router.push('/ludmilla/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error creating blog post:', error)
      setSuccessMessage('Error creating blog post. Please try again.')
    }

    setIsSubmitting(false)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/ludmilla/dashboard" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1>Create New Blog Post</h1>
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
                placeholder="Write your full blog post content here. Use markdown-style formatting:&#10;&#10;## Heading 2&#10;### Heading 3&#10;&#10;Regular paragraph text.&#10;&#10;- Bullet point 1&#10;- Bullet point 2&#10;&#10;1. Numbered item 1&#10;2. Numbered item 2"
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
              <h4>💡 Writing Tips</h4>
              <ul>
                <li>Keep paragraphs short and scannable</li>
                <li>Use headings to organize content</li>
                <li>Add bullet points for lists</li>
                <li>Write in a friendly, conversational tone</li>
                <li>Include a call-to-action at the end</li>
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
          <Link href="/ludmilla/dashboard" className={styles.cancelButton}>
            Cancel
          </Link>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Blog Post'}
          </button>
        </div>

        <div className={styles.devNote}>
          <strong>✅ Database Connected:</strong> Blog posts are now saved permanently to the PostgreSQL database via Prisma.
        </div>
      </form>
    </div>
  )
}
