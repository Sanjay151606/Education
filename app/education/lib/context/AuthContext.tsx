'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher' | 'admin'
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, role?: 'student' | 'teacher' | 'admin') => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    // Check saved session
    const saved = localStorage.getItem('bg_user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch (e) {
        setUser({ id: 'student_1', name: 'Alex Rivera', email: 'alex@braingraph.ai', role: 'student' })
      }
    } else {
      // Default to logged-in student for immediate rich demo experience
      const defaultStudent: AuthUser = {
        id: 'student_1',
        name: 'Alex Rivera',
        email: 'alex@braingraph.ai',
        role: 'student'
      }
      setUser(defaultStudent)
      localStorage.setItem('bg_user', JSON.stringify(defaultStudent))
    }
  }, [])

  const login = async (email: string, role: 'student' | 'teacher' | 'admin' = 'student') => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    })
    const data = await res.json()
    if (data.user) {
      setUser(data.user)
      localStorage.setItem('bg_user', JSON.stringify(data.user))
    }
  }

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    localStorage.removeItem('bg_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
