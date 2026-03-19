'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useLudmilla } from '@/context/LudmillaContext'
import { Product } from '@/types/product'
import styles from './edit.module.css'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { isAuthenticated } = useLudmilla()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [productId, setProductId] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    occasion: '',
    type: 'cake',
    available: true,
    sortOrder: '0',
    digitalAssetUrl: ''
  })

  useEffect(() => {
    setMounted(true)
    params.then(p => {
      setProductId(p.id)
    })
  }, [params])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/ludmilla')
    }
  }, [isAuthenticated, router, mounted])

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return

      try {
        const response = await fetch(`/api/products/${productId}`)
        if (response.ok) {
          const foundProduct = await response.json()
          setProduct(foundProduct)
          setFormData({
            name: foundProduct.name,
            description: foundProduct.description,
            price: foundProduct.price.toString(),
            image: foundProduct.image,
            category: foundProduct.category,
            occasion: foundProduct.occasion,
            type: foundProduct.type,
            available: foundProduct.available,
            sortOrder: foundProduct.sortOrder?.toString() || '0',
            digitalAssetUrl: foundProduct.digitalAssetUrl || ''
          })
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (mounted && isAuthenticated && productId) {
      fetchProduct()
    }
  }, [mounted, isAuthenticated, productId])

  if (!mounted || !isAuthenticated) {
    return null
  }

  if (loading || !product) {
    return <div className={styles.container}>Loading product...</div>
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const { url } = await res.json()
      setFormData(prev => ({ ...prev, digitalAssetUrl: url }))
    } catch {
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
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
          sortOrder: parseInt(formData.sortOrder) || 0,
          digitalAssetUrl: formData.digitalAssetUrl || null,
        }),
      })

      if (response.ok) {
        const product = await response.json()
        alert(`Product "${product.name}" updated successfully!`)
        router.push('/ludmilla/products')
      } else {
        const error = await response.json()
        alert(`Failed to update product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('An error occurred while updating the product')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Product deleted successfully!')
        router.push('/ludmilla/products')
      } else {
        const error = await response.json()
        alert(`Failed to delete product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('An error occurred while deleting the product')
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <Link href="/ludmilla/products" className={styles.backLink}>← Back to Products</Link>
            <h1>Edit Product</h1>
            <p>Update product information</p>
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
                {formData.image && (
                  <div className={styles.imagePreview}>
                    <Image src={formData.image} alt="Preview" width={200} height={150} />
                  </div>
                )}
              </div>

              {formData.type === 'digital' && (
                <div className={styles.formGroup}>
                  <label>Digital Asset File</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.zip,.mp4,.mp3,.epub,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.uploadButton}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : formData.digitalAssetUrl ? 'Replace File' : 'Upload File'}
                  </button>
                  {formData.digitalAssetUrl && (
                    <div className={styles.uploadedFile}>
                      <span>✓ File uploaded: </span>
                      <a href={formData.digitalAssetUrl} target="_blank" rel="noreferrer">
                        View file
                      </a>
                    </div>
                  )}
                  <small>Accepted: PDF, ZIP, MP4, MP3, EPUB, images</small>
                </div>
              )}
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
                <label htmlFor="sortOrder">Sort Order</label>
                <input
                  type="number"
                  id="sortOrder"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
                <small>Lower number = appears first in grids (0 = default)</small>
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
            <button type="button" onClick={handleDelete} className={styles.deleteButton}>
              Delete Product
            </button>
            <div className={styles.actionGroup}>
              <Link href="/ludmilla/products" className={styles.cancelButton}>
                Cancel
              </Link>
              <button type="submit" className={styles.submitButton}>
                Update Product
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
