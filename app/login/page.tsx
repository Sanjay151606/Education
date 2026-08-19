'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/education/lib/context/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { user, login, isAuthenticated, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('sanjay@braingraph.ai')
  const [password, setPassword] = useState('password123')
  const [role, setRole] = useState<'student' | 'admin'>('student')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // If already authenticated and not loading, redirect immediately to the proper dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/student/dashboard')
      }
    }
  }, [authLoading, isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const loggedUser = await login(email, role)
      if (loggedUser) {
        if (loggedUser.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/student/dashboard')
        }
      } else {
        setErrorMsg('Authentication failed. Please check your credentials.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12 selection:bg-blue-500 selection:text-white">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-600/15 via-purple-600/15 to-pink-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform mb-4">
              🧠
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Brain Graph
            </h1>
          </Link>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Role-Based Neural Learning &amp; Orchestration Platform
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="name@braingraph.ai"
              className="w-full px-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
            />
          </div>

          {/* Quick Demo Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Sign In As</span>
              <span className="text-[10px] text-slate-500">Role Selection</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setRole('student')
                  setEmail('sanjay@braingraph.ai')
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                  role === 'student'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/40'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🎓</span>
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('admin')
                  setEmail('admin@braingraph.ai')
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/40'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡</span>
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-4 text-white font-bold rounded-xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
              role === 'admin'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 shadow-purple-500/25 hover:shadow-purple-500/40'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-blue-500/25 hover:shadow-blue-500/40'
            }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to {role === 'admin' ? 'Admin Space' : 'Student Space'} →</span>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          New Student?{' '}
          <Link href="/register" className="text-blue-400 hover:underline font-semibold">
            Create Free Student Account
          </Link>
        </div>
      </div>
    </div>
  )
}
