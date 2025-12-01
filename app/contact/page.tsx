'use client'

import { useState } from 'react'
import styles from './contact.module.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    }, 1000)
  }

  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Contact Us</h1>
        <p className={styles.subtitle}>We&apos;d love to hear from you! Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.contactInfo}>
          <h2>Get In Touch</h2>
          <div className={styles.infoItem}>
            <h3>Email</h3>
            <p>hello@justcakes.com</p>
          </div>
          <div className={styles.infoItem}>
            <h3>Phone</h3>
            <p>(555) 123-4567</p>
          </div>
          <div className={styles.infoItem}>
            <h3>Hours</h3>
            <p>Monday - Friday: 9am - 6pm</p>
            <p>Saturday: 10am - 4pm</p>
            <p>Sunday: Closed</p>
          </div>
          <div className={styles.infoItem}>
            <h3>Location</h3>
            <p>123 Baker Street</p>
            <p>Sweet City, SC 12345</p>
          </div>
        </div>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">Subject *</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="order">Order Question</option>
              <option value="custom">Custom Order</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Tell us how we can help you..."
            />
          </div>

          {status === 'success' && (
            <div className={styles.successMessage}>
              Thank you for your message! We&apos;ll get back to you soon.
            </div>
          )}

          {status === 'error' && (
            <div className={styles.errorMessage}>
              Sorry, there was an error submitting your form. Please try again.
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </main>
  )
}
