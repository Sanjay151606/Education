'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/app/education/lib/context/AuthContext'

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout, login } = useAuth()

  const navLinks = [
    { href: '/education', label: 'Home', icon: '🏠' },
    { href: '/education/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/education/ai-tutor', label: 'AI Tutor', icon: '🤖' },
    { href: '/education/learning-graph', label: 'Brain Graph', icon: '🧠' },
    { href: '/education/courses', label: 'Courses', icon: '📚' },
    { href: '/education/study-plan', label: 'Study Plan', icon: '📅' },
    { href: '/education/quiz', label: 'Quiz', icon: '⚡' },
    { href: '/education/revision', label: 'Revision', icon: '🔄' },
    { href: '/education/progress', label: 'Analytics', icon: '📈' },
    { href: '/education/admin/workflows', label: 'Workflows', icon: '⚡' },
  ]

  const isActive = (href: string) => {
    if (href === '/education') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/education" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-xl">🧠</span>
            </div>
            <div>
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Brain Graph
              </div>
              <div className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Agentic AI Learning OS</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive(link.href)
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Role & Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200/80 rounded-full py-1 px-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-gray-800 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">{user.role}</div>
                </div>
                <button
                  onClick={() => {
                    const newRole = user.role === 'admin' ? 'student' : 'admin'
                    login(newRole === 'admin' ? 'admin@braingraph.ai' : 'alex@braingraph.ai', newRole)
                  }}
                  title="Switch Role"
                  className="text-[10px] bg-white border border-gray-300 hover:bg-blue-50 text-gray-700 font-medium py-0.5 px-2 rounded-full transition-colors"
                >
                  {user.role === 'admin' ? 'Switch Student' : 'Switch Admin'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/education/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  href="/education/register"
                  className="text-sm font-medium bg-blue-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-blue-700 shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 bg-white/95 backdrop-blur-md rounded-b-2xl">
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                    isActive(link.href)
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
            {user && (
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs px-2">
                <span className="text-gray-600 font-medium">Logged as <b className="text-gray-900">{user.name}</b> ({user.role})</span>
                <button
                  onClick={() => {
                    const newRole = user.role === 'admin' ? 'student' : 'admin'
                    login(newRole === 'admin' ? 'admin@braingraph.ai' : 'alex@braingraph.ai', newRole)
                  }}
                  className="text-blue-600 font-semibold underline"
                >
                  Toggle Role
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

