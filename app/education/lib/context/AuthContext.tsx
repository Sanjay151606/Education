'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/app/education/lib/db/supabaseClient'

export type UserRole = 'student' | 'admin' | 'teacher'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'student' | 'admin'
  avatarUrl?: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, role?: 'student' | 'admin') => Promise<AuthUser | null>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  isStudent: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => null,
  logout: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  isStudent: false,
  loading: true
})

/**
 * Normalizes user role strictly to 'student' or 'admin'.
 */
export function normalizeRole(role?: string | null): 'student' | 'admin' {
  if (!role) return 'student'
  const lower = role.toLowerCase().trim()
  return lower === 'admin' ? 'admin' : 'student'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    async function initSession() {
      // 1. If Supabase is active, check active auth session and profile
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            // Fetch profile role from Supabase profiles table
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, name, email, role, avatar_url')
              .eq('id', session.user.id)
              .single()

            if (profile && isMounted) {
              const normalized: AuthUser = {
                id: profile.id,
                name: profile.name || session.user.user_metadata?.name || 'User',
                email: profile.email || session.user.email || '',
                role: normalizeRole(profile.role),
                avatarUrl: profile.avatar_url
              }
              setUser(normalized)
              localStorage.setItem('bg_user', JSON.stringify(normalized))
              setLoading(false)
              return
            }
          }
        } catch (err) {
          console.warn('Supabase session fetch fallback:', err)
        }
      }

      // 2. Fallback to persisted session in storage
      const saved = localStorage.getItem('bg_user')
      if (saved && isMounted) {
        try {
          const parsed = JSON.parse(saved)
          setUser({
            ...parsed,
            role: normalizeRole(parsed.role)
          })
        } catch (e) {
          const defaultStudent: AuthUser = {
            id: 'student_1',
            name: 'Sanjay Kumar',
            email: 'sanjay@braingraph.ai',
            role: 'student'
          }
          setUser(defaultStudent)
          localStorage.setItem('bg_user', JSON.stringify(defaultStudent))
        }
      } else if (isMounted) {
        const defaultStudent: AuthUser = {
          id: 'student_1',
          name: 'Sanjay Kumar',
          email: 'sanjay@braingraph.ai',
          role: 'student'
        }
        setUser(defaultStudent)
        localStorage.setItem('bg_user', JSON.stringify(defaultStudent))
      }

      if (isMounted) setLoading(false)
    }

    initSession()

    // Listen to Supabase auth changes if configured
    if (isSupabaseConfigured && supabase) {
      const client = supabase
      const { data: authListener } = client.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null)
          localStorage.removeItem('bg_user')
        } else if (session?.user) {
          try {
            const { data: profile } = await client
              .from('profiles')
              .select('id, name, email, role, avatar_url')
              .eq('id', session.user.id)
              .single()

            if (profile && isMounted) {
              const normalized: AuthUser = {
                id: profile.id,
                name: profile.name || session.user.user_metadata?.name || 'User',
                email: profile.email || session.user.email || '',
                role: normalizeRole(profile.role),
                avatarUrl: profile.avatar_url
              }
              setUser(normalized)
              localStorage.setItem('bg_user', JSON.stringify(normalized))
            }
          } catch (e) {
            console.error('Error on auth change profile lookup:', e)
          }
        }
      })

      return () => {
        isMounted = false
        authListener?.subscription?.unsubscribe()
      }
    }

    return () => {
      isMounted = false
    }
  }, [])

  const login = async (email: string, role: 'student' | 'admin' = 'student'): Promise<AuthUser | null> => {
    const normalizedRole = normalizeRole(role)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: normalizedRole })
      })
      const data = await res.json()
      if (data.user) {
        const normalizedUser: AuthUser = {
          id: data.user.id,
          name: data.user.name || (normalizedRole === 'admin' ? 'Administrator' : 'Sanjay Kumar'),
          email: data.user.email,
          role: normalizeRole(data.user.role || normalizedRole)
        }
        setUser(normalizedUser)
        localStorage.setItem('bg_user', JSON.stringify(normalizedUser))
        return normalizedUser
      }
    } catch (e) {
      console.error('Login error:', e)
    }

    // Direct fallback user
    const fallbackUser: AuthUser = {
      id: normalizedRole === 'admin' ? 'admin_1' : 'student_1',
      name: normalizedRole === 'admin' ? 'System Administrator' : 'Sanjay Kumar',
      email,
      role: normalizedRole
    }
    setUser(fallbackUser)
    localStorage.setItem('bg_user', JSON.stringify(fallbackUser))
    return fallbackUser
  }

  const logout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut()
      }
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    } catch (e) {
      console.error('Logout error:', e)
    } finally {
      localStorage.removeItem('bg_user')
      setUser(null)
      router.push('/login')
    }
  }

  const isAdmin = user?.role === 'admin'
  const isStudent = user?.role === 'student'

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
 * General ProtectedRoute: Ensures any authenticated user is logged in.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
          <span className="text-sm font-mono">Authenticating User...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * AdminRoute / AdminGuard: Checks user exists and role === 'admin'.
 * If not admin, redirects immediately to /student/dashboard.
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
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

export const AdminGuard = AdminRoute

/**
 * StudentRoute / StudentGuard: Checks user exists and role === 'student'.
 * If admin, redirects immediately to /admin/dashboard.
 */
export function StudentRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
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

export const StudentGuard = StudentRoute


