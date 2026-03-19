'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'

interface LudmillaContextType {
  isAuthenticated: boolean
  login: (password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

const LudmillaContext = createContext<LudmillaContextType | undefined>(undefined)

export function LudmillaProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/ludmilla/auth')
      const data = await response.json()
      setIsAuthenticated(data.authenticated)
      return data.authenticated
    } catch (error) {
      setIsAuthenticated(false)
      return false
    }
  }, [])

  const login = useCallback(async (password: string) => {
    try {
      const response = await fetch('/api/ludmilla/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (response.ok) {
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/ludmilla/auth', { method: 'DELETE' })
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [])

  return (
    <LudmillaContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </LudmillaContext.Provider>
  )
}

export function useLudmilla() {
  const context = useContext(LudmillaContext)
  if (context === undefined) {
    throw new Error('useLudmilla must be used within a LudmillaProvider')
  }
  return context
}
