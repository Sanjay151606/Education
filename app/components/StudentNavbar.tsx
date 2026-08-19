'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/app/education/lib/context/AuthContext'

export default function StudentNavbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const studentNavLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/student/ai-tutor', label: 'AI Tutor', icon: '🤖' },
    { href: '/student/brain-graph', label: 'Brain Graph', icon: '🧠' },
    { href: '/student/courses', label: 'Courses', icon: '📚' },
    { href: '/student/quiz', label: 'Quiz', icon: '📝' },
    { href: '/student/study-plan', label: 'Study Plan', icon: '📅' },
    { href: '/student/revision', label: 'Revision', icon: '🔄' },
    { href: '/student/analytics', label: 'My Analytics', icon: '📈' },
  ]

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/')

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Student Badge */}
          <div className="flex items-center gap-3">
            <Link href="/student/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
                🧠
              </div>
              <div>
                <div className="text-lg font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Brain Graph
                </div>
                <div className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                  Student Learning Space
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {studentNavLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive(link.href)
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Student Profile & Quick Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/student/notifications"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm transition-colors"
              title="Notifications"
            >
              🔔
            </Link>
            <Link
              href="/student/settings"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm transition-colors"
              title="Settings"
            >
              ⚙️
            </Link>

            {/* Profile Pill */}
            <Link
              href="/student/profile"
              className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-full py-1 pl-1.5 pr-3 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-100 leading-tight">{user?.name || 'Student'}</div>
                <div className="text-[9px] text-blue-400 font-semibold uppercase tracking-wider">Student</div>
              </div>
            </Link>

            <button
              onClick={logout}
              className="text-xs bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-5 space-y-1.5">
          {studentNavLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.href) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="mr-2">{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <Link
              href="/student/profile"
              onClick={() => setMobileOpen(false)}
              className="text-xs text-slate-300 font-semibold flex items-center gap-2"
            >
              👤 Profile & Settings
            </Link>
            <button
              onClick={logout}
              className="text-xs text-rose-400 font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
