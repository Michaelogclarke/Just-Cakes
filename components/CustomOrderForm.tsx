'use client'

import { useState } from 'react'
import styles from './CustomOrderForm.module.css'

interface CustomOrderFormData {
  // Customer Information
  name: string
  email: string
  phone: string

  // Event Details
  occasion: string
  eventDate: string
  pickupTime: string

  // Cake Details
  size: string
  servings: string
  shape: string
  flavor: string
  filling: string
  frosting: string

  // Design Preferences
  theme: string
  colors: string
  designDescription: string
  referenceImage: File | null

  // Additional Options
  dietaryRestrictions: string[]
  specialRequests: string

  // Budget
  budget: string
}

export default function CustomOrderForm() {
  const [formData, setFormData] = useState<CustomOrderFormData>({
    name: '',
    email: '',
    phone: '',
    occasion: '',
    eventDate: '',
    pickupTime: '',
    size: '',
    servings: '',
    shape: 'round',
    flavor: '',
    filling: '',
    frosting: 'buttercream',
    theme: '',
    colors: '',
    designDescription: '',
    referenceImage: null,
    dietaryRestrictions: [],
    specialRequests: '',
    budget: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...prev.dietaryRestrictions, value]
        : prev.dietaryRestrictions.filter(item => item !== value),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, referenceImage: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      setSubmitMessage('Thank you! Your custom order request has been submitted. We will contact you within 24 hours with a quote.')

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        occasion: '',
        eventDate: '',
        pickupTime: '',
        size: '',
        servings: '',
        shape: 'round',
        flavor: '',
        filling: '',
        frosting: 'buttercream',
        theme: '',
        colors: '',
        designDescription: '',
        referenceImage: null,
        dietaryRestrictions: [],
        specialRequests: '',
        budget: '',
      })
    } catch (error) {
      setSubmitMessage('Sorry, there was an error submitting your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Customer Information */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Contact Information</h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Event Details</h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="occasion">Occasion *</label>
            <select
              id="occasion"
              name="occasion"
              value={formData.occasion}
              onChange={handleInputChange}
              required
            >
              <option value="">Select an occasion</option>
              <option value="birthday">Birthday</option>
              <option value="wedding">Wedding</option>
              <option value="anniversary">Anniversary</option>
              <option value="graduation">Graduation</option>
              <option value="baby-shower">Baby Shower</option>
              <option value="corporate">Corporate Event</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="eventDate">Event Date *</label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="pickupTime">Preferred Pickup Time *</label>
            <input
              type="time"
              id="pickupTime"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </section>

      {/* Cake Specifications */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Cake Specifications</h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="size">Cake Size *</label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              required
            >
              <option value="">Select size</option>
              <option value="6-inch">6 inch (serves 8-10)</option>
              <option value="8-inch">8 inch (serves 15-20)</option>
              <option value="10-inch">10 inch (serves 25-30)</option>
              <option value="12-inch">12 inch (serves 35-40)</option>
              <option value="multi-tier">Multi-tier</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="servings">Number of Servings *</label>
            <input
              type="number"
              id="servings"
              name="servings"
              value={formData.servings}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="shape">Shape *</label>
            <select
              id="shape"
              name="shape"
              value={formData.shape}
              onChange={handleInputChange}
              required
            >
              <option value="round">Round</option>
              <option value="square">Square</option>
              <option value="rectangle">Rectangle</option>
              <option value="heart">Heart</option>
              <option value="custom">Custom Shape</option>
            </select>
          </div>
        </div>
      </section>

      {/* Flavors */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Flavors</h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="flavor">Cake Flavor *</label>
            <select
              id="flavor"
              name="flavor"
              value={formData.flavor}
              onChange={handleInputChange}
              required
            >
              <option value="">Select flavor</option>
              <option value="vanilla">Vanilla</option>
              <option value="chocolate">Chocolate</option>
              <option value="red-velvet">Red Velvet</option>
              <option value="lemon">Lemon</option>
              <option value="strawberry">Strawberry</option>
              <option value="carrot">Carrot</option>
              <option value="marble">Marble</option>
              <option value="funfetti">Funfetti</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="filling">Filling *</label>
            <input
              type="text"
              id="filling"
              name="filling"
              value={formData.filling}
              onChange={handleInputChange}
              placeholder="e.g., Raspberry, Chocolate Ganache, Vanilla Cream"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="frosting">Frosting Type *</label>
            <select
              id="frosting"
              name="frosting"
              value={formData.frosting}
              onChange={handleInputChange}
              required
            >
              <option value="buttercream">Buttercream</option>
              <option value="cream-cheese">Cream Cheese</option>
              <option value="fondant">Fondant</option>
              <option value="whipped-cream">Whipped Cream</option>
              <option value="ganache">Ganache</option>
            </select>
          </div>
        </div>
      </section>

      {/* Design Preferences */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Design Preferences</h3>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="theme">Theme</label>
            <input
              type="text"
              id="theme"
              name="theme"
              value={formData.theme}
              onChange={handleInputChange}
              placeholder="e.g., Floral, Minimalist, Princess, Sports"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="colors">Color Scheme</label>
            <input
              type="text"
              id="colors"
              name="colors"
              value={formData.colors}
              onChange={handleInputChange}
              placeholder="e.g., Pink and Gold, Blue and White"
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="designDescription">Design Description *</label>
          <textarea
            id="designDescription"
            name="designDescription"
            value={formData.designDescription}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe your vision in detail. Include any text, decorations, or special elements you'd like."
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="referenceImage">Reference Image (Optional)</label>
          <input
            type="file"
            id="referenceImage"
            name="referenceImage"
            onChange={handleFileChange}
            accept="image/*"
          />
          <small>Upload an inspiration image if you have one</small>
        </div>
      </section>

      {/* Dietary Restrictions */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Dietary Restrictions</h3>
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
      </section>

      {/* Additional Details */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Additional Details</h3>
        <div className={styles.formGroup}>
          <label htmlFor="specialRequests">Special Requests</label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInputChange}
            rows={3}
            placeholder="Any other details or special requests we should know about?"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="budget">Estimated Budget *</label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            required
          >
            <option value="">Select budget range</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200-300">$200 - $300</option>
            <option value="300-500">$300 - $500</option>
            <option value="500+">$500+</option>
          </select>
        </div>
      </section>

      {submitMessage && (
        <div className={submitMessage.includes('Thank you') ? styles.successMessage : styles.errorMessage}>
          {submitMessage}
        </div>
      )}

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Custom Order Request'}
      </button>
    </form>
  )
}
