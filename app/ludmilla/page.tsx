'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAdmin } from '@/context/AdminContext'
import styles from './admin.module.css'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isAuthenticated } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/ludmilla/dashboard')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const success = await login(password)
    if (success) {
      router.push('/admin/dashboard')
    } else {
      setError('Invalid password. Please try again.')
      setPassword('')
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logoSection}>
          <Image src="/updated-logo.png" alt="Just Cakes" className={styles.logo} width={150} height={75} />
          <h1>Admin Login</h1>
          <p>Enter your password to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>

      </div>
    </div>
  )
}
