'use client'

import { useState } from 'react'
import styles from './cakes.module.css'

interface FormData {
  occasion: string
  servings: number | ''
  allergies: string[]
  description: string
}

const ALLERGY_OPTIONS = ['Gluten-free', 'Dairy-free', 'Vegan', 'Nut-free']
const MAX_DESCRIPTION_LENGTH = 1000

export default function CakesPage() {
  const [formData, setFormData] = useState<FormData>({
    occasion: '',
    servings: '',
    allergies: [],
    description: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const handleOccasionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, occasion: e.target.value }))
  }

  const handleServingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : parseInt(e.target.value)
    setFormData(prev => ({ ...prev, servings: value }))
  }

  const toggleAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }))
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setFormData(prev => ({ ...prev, description: value }))
    }
  }

  const validateForm = (): boolean => {
    if (!formData.occasion) {
      setSubmitMessage('Please select an occasion')
      return false
    }

    if (!formData.servings || formData.servings < 1) {
      setSubmitMessage('Please enter the number of servings')
      return false
    }

    if (formData.servings > 500) {
      setSubmitMessage('Maximum servings is 500. Please contact us directly for larger orders.')
      return false
    }

    if (!formData.description.trim()) {
      setSubmitMessage('Please describe your dream cake')
      return false
    }

    if (formData.description.trim().length < 10) {
      setSubmitMessage('Please provide more details about your cake (at least 10 characters)')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      const response = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quote request')
      }

      setSubmitStatus('success')
      setSubmitMessage('Thank you! We\'ve received your quote request and will email you within 24 hours with a custom quote.')

    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage(
        'We\'re sorry, something went wrong. Please try again or email us directly at ' +
        (process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'info@justcakes.com')
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const characterCount = formData.description.length

  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1>Request Your Custom Cake Quote</h1>
        <p className={styles.subtitle}>Tell us about your vision, and we&apos;ll bring it to life</p>
      </div>

      {/* Form Card */}
      <div className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Occasion Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="occasion" className={styles.label}>
              Occasion <span className={styles.required}>*</span>
            </label>
            <select
              id="occasion"
              value={formData.occasion}
              onChange={handleOccasionChange}
              required
              className={styles.selectField}
              disabled={isSubmitting}
            >
              <option value="">What&apos;s the occasion?</option>
              <option value="birthday">Birthday</option>
              <option value="wedding">Wedding</option>
              <option value="anniversary">Anniversary</option>
              <option value="graduation">Graduation</option>
              <option value="baby-shower">Baby Shower</option>
              <option value="bridal-shower">Bridal Shower</option>
              <option value="corporate">Corporate Event</option>
              <option value="celebration">Celebration</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Servings Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="servings" className={styles.label}>
              Servings <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              id="servings"
              value={formData.servings}
              onChange={handleServingsChange}
              min="1"
              max="500"
              required
              placeholder="How many servings do you need?"
              className={styles.numberInput}
              disabled={isSubmitting}
            />
            <p className={styles.helperText}>
              Typical servings: Small cake (8-12), Medium (15-25), Large (30-50)
            </p>
          </div>

          {/* Allergies Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Dietary Restrictions
            </label>
            <div className={styles.allergyPills}>
              {ALLERGY_OPTIONS.map((allergy) => (
                <button
                  key={allergy}
                  type="button"
                  onClick={() => toggleAllergy(allergy)}
                  className={`${styles.allergyPill} ${
                    formData.allergies.includes(allergy) ? styles.allergyPillActive : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {allergy}
                </button>
              ))}
            </div>
            <p className={styles.helperText}>
              Select all that apply
            </p>
          </div>

          {/* Description Field */}
          <div className={styles.fieldGroup}>
            <label htmlFor="description" className={styles.label}>
              Cake Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              required
              rows={6}
              placeholder="Describe your dream cake... Include flavors, colors, themes, design ideas, or anything else that inspires you!"
              className={styles.textareaField}
              disabled={isSubmitting}
            />
            <div className={styles.characterCount}>
              {characterCount}/{MAX_DESCRIPTION_LENGTH}
            </div>
            <p className={styles.helperText}>
              The more details you share, the better we can bring your vision to life!
            </p>
          </div>

          {/* Status Message */}
          {submitMessage && (
            <div className={`${styles.statusMessage} ${
              submitStatus === 'success' ? styles.success : styles.error
            }`}>
              {submitMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Sending Request...
              </>
            ) : (
              'Get a Quote'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
