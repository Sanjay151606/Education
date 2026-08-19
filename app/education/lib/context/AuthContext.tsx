'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export type UserRole = 'student' | 'teacher' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, role?: UserRole) => Promise<AuthUser | null>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isStudent: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => null,
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  isStudent: false,
  loading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check saved session
    const saved = localStorage.getItem('bg_user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Normalize role
        const role = (parsed.role === 'admin' ? 'admin' : 'student') as UserRole
        setUser({ ...parsed, role })
      } catch (e) {
        setUser({ id: 'student_1', name: 'Sanjay Kumar', email: 'sanjay@braingraph.ai', role: 'student' })
      }
    } else {
      const defaultStudent: AuthUser = {
        id: 'student_1',
        name: 'Sanjay Kumar',
        email: 'sanjay@braingraph.ai',
        role: 'student'
      }
      setUser(defaultStudent)
      localStorage.setItem('bg_user', JSON.stringify(defaultStudent))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, role: UserRole = 'student'): Promise<AuthUser | null> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      })
      const data = await res.json()
      if (data.user) {
        const normalizedUser: AuthUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role === 'admin' ? 'admin' : 'student'
        }
        setUser(normalizedUser)
        localStorage.setItem('bg_user', JSON.stringify(normalizedUser))
        return normalizedUser
      }
    } catch (e) {
      console.error('Login error:', e)
    }
    return null
  }

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    localStorage.removeItem('bg_user')
    setUser(null)
    router.push('/education/login')
  }

  const isAdmin = user?.role === 'admin'
  const isStudent = user?.role === 'student' || user?.role === 'teacher'

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin,
        isStudent,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

/**
 * Route guard for Admin routes
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/education/login')
      } else if (!isAdmin) {
        router.push('/student/dashboard')
      }
    }
  }, [user, loading, isAdmin, router])

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-purple-500 rounded-full animate-ping" />
          <span className="text-sm font-mono">Verifying Administrator Access...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * Route guard for Student routes
 */
export function StudentGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/education/login')
      } else if (isAdmin) {
        router.push('/admin/dashboard')
      }
    }
  }, [user, loading, isAdmin, router])

  if (loading || !user || isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
          <span className="text-sm font-mono">Loading Student Space...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

