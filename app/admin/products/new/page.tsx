'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdmin } from '@/context/AdminContext'
import styles from './new.module.css'

export default function NewProductPage() {
  const { isAuthenticated } = useAdmin()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    occasion: '',
    type: 'cake',
    available: true
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image: formData.image,
          category: formData.category,
          occasion: formData.occasion,
          type: formData.type,
          available: formData.available,
        }),
      })

      if (response.ok) {
        const product = await response.json()
        alert(`Product "${product.name}" created successfully!`)
        router.push('/admin/products')
      } else {
        const error = await response.json()
        alert(`Failed to create product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('An error occurred while creating the product')
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Link href="/admin/products" className={styles.backLink}>← Back to Products</Link>
            <h1>Add New Product</h1>
            <p>Create a new product for your store</p>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Left Column */}
            <div className={styles.formSection}>
              <h2>Basic Information</h2>

              <div className={styles.formGroup}>
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Chocolate Delight Cake"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your product..."
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">Image URL *</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  placeholder="/products/image.jpg"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.formSection}>
              <h2>Classification</h2>

              <div className={styles.formGroup}>
                <label htmlFor="type">Product Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="cake">Cake</option>
                  <option value="cupcake">Cupcake</option>
                  <option value="slice">Slice</option>
                  <option value="digital">Digital Product</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="chocolate">Chocolate</option>
                  <option value="vanilla">Vanilla</option>
                  <option value="specialty">Specialty</option>
                  <option value="fruit">Fruit</option>
                  <option value="cookbook">Cookbook (Digital)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="occasion">Occasion *</label>
                <select
                  id="occasion"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an occasion</option>
                  <option value="birthday">Birthday</option>
                  <option value="wedding">Wedding</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="celebration">Celebration</option>
                  <option value="learning">Learning (Digital)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                  />
                  <span>Available for purchase</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <Link href="/admin/products" className={styles.cancelButton}>
              Cancel
            </Link>
            <button type="submit" className={styles.submitButton}>
              Create Product
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
