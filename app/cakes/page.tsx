'use client'

import { useState } from 'react'
import styles from './cakes.module.css'

export default function CakesPage() {
  const [formData, setFormData] = useState({
    cakeType: '',
    flavor: '',
    size: '',
    servings: '',
    occasion: '',
    decorationStyle: '',
    colorScheme: '',
    message: '',
    dietaryRestrictions: [] as string[],
    deliveryDate: '',
    deliveryTime: '',
    name: '',
    email: '',
    phone: '',
    specialInstructions: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...prev.dietaryRestrictions, value]
        : prev.dietaryRestrictions.filter(item => item !== value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setSubmitMessage('Thank you! Your cake order request has been received. We\'ll contact you shortly to confirm details.')
    setIsSubmitting(false)

    // Reset form after successful submission
    setTimeout(() => {
      setFormData({
        cakeType: '',
        flavor: '',
        size: '',
        servings: '',
        occasion: '',
        decorationStyle: '',
        colorScheme: '',
        message: '',
        dietaryRestrictions: [],
        deliveryDate: '',
        deliveryTime: '',
        name: '',
        email: '',
        phone: '',
        specialInstructions: ''
      })
      setSubmitMessage('')
    }, 5000)
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1>Order Your Custom Cake</h1>
        <p className={styles.subtitle}>Tell us about your dream cake and we&apos;ll make it a reality</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Cake Details Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Cake Details</h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="cakeType">Cake Type *</label>
              <select
                id="cakeType"
                name="cakeType"
                value={formData.cakeType}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select a type</option>
                <option value="layer-cake">Layer Cake</option>
                <option value="sheet-cake">Sheet Cake</option>
                <option value="tiered-cake">Tiered Cake</option>
                <option value="bundt-cake">Bundt Cake</option>
                <option value="specialty">Specialty Cake</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="flavor">Flavor *</label>
              <select
                id="flavor"
                name="flavor"
                value={formData.flavor}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select a flavor</option>
                <option value="vanilla">Vanilla</option>
                <option value="chocolate">Chocolate</option>
                <option value="red-velvet">Red Velvet</option>
                <option value="lemon">Lemon</option>
                <option value="strawberry">Strawberry</option>
                <option value="carrot">Carrot</option>
                <option value="marble">Marble</option>
                <option value="custom">Custom Flavor</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="size">Size *</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select a size</option>
                <option value="6-inch">6 inch</option>
                <option value="8-inch">8 inch</option>
                <option value="10-inch">10 inch</option>
                <option value="12-inch">12 inch</option>
                <option value="quarter-sheet">Quarter Sheet</option>
                <option value="half-sheet">Half Sheet</option>
                <option value="full-sheet">Full Sheet</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="servings">Number of Servings</label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                placeholder="e.g., 20"
                min="1"
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Design & Decoration Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Design & Decoration</h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="occasion">Occasion *</label>
              <select
                id="occasion"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="">Select an occasion</option>
                <option value="birthday">Birthday</option>
                <option value="wedding">Wedding</option>
                <option value="anniversary">Anniversary</option>
                <option value="graduation">Graduation</option>
                <option value="baby-shower">Baby Shower</option>
                <option value="bridal-shower">Bridal Shower</option>
                <option value="celebration">Celebration</option>
                <option value="corporate">Corporate Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="decorationStyle">Decoration Style</label>
              <select
                id="decorationStyle"
                name="decorationStyle"
                value={formData.decorationStyle}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select a style</option>
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="rustic">Rustic</option>
                <option value="elegant">Elegant</option>
                <option value="whimsical">Whimsical</option>
                <option value="minimalist">Minimalist</option>
                <option value="floral">Floral</option>
                <option value="themed">Themed</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="colorScheme">Color Scheme</label>
              <input
                type="text"
                id="colorScheme"
                name="colorScheme"
                value={formData.colorScheme}
                onChange={handleChange}
                placeholder="e.g., Pink and Gold"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Message on Cake</label>
              <input
                type="text"
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="e.g., Happy Birthday!"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Dietary Restrictions</label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  value="gluten-free"
                  checked={formData.dietaryRestrictions.includes('gluten-free')}
                  onChange={handleCheckboxChange}
                />
                <span>Gluten-Free</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  value="dairy-free"
                  checked={formData.dietaryRestrictions.includes('dairy-free')}
                  onChange={handleCheckboxChange}
                />
                <span>Dairy-Free</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  value="vegan"
                  checked={formData.dietaryRestrictions.includes('vegan')}
                  onChange={handleCheckboxChange}
                />
                <span>Vegan</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  value="nut-free"
                  checked={formData.dietaryRestrictions.includes('nut-free')}
                  onChange={handleCheckboxChange}
                />
                <span>Nut-Free</span>
              </label>
            </div>
          </div>
        </div>

        {/* Delivery Information Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Delivery Information</h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="deliveryDate">Delivery Date *</label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="deliveryTime">Preferred Delivery Time</label>
              <select
                id="deliveryTime"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select a time</option>
                <option value="morning">Morning (9AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 4PM)</option>
                <option value="evening">Evening (4PM - 7PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Information</h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="(123) 456-7890"
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Special Instructions Section */}
        <div className={styles.section}>
          <div className={styles.formGroup}>
            <label htmlFor="specialInstructions">Special Instructions or Requests</label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              placeholder="Any additional details about your cake design, allergies, delivery instructions, etc."
              rows={5}
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.submitSection}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Order Request'}
          </button>

          {submitMessage && (
            <div className={styles.successMessage}>
              {submitMessage}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
