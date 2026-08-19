'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/app/education/lib/context/AuthContext'

export default function AdminNavbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const adminNavLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/students', label: 'Students', icon: '👥' },
    { href: '/admin/teachers', label: 'Teachers', icon: '👨‍🏫' },
    { href: '/admin/courses', label: 'Courses', icon: '📚' },
    { href: '/admin/quizzes', label: 'Quizzes', icon: '📝' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
    { href: '/admin/ai-monitoring', label: 'AI Monitoring', icon: '🤖' },
    { href: '/admin/workflows', label: 'Workflows', icon: '🔄' },
    { href: '/admin/google-sheets', label: 'Google Sheets', icon: '📋' },
  ]

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/')

  return (
    <nav className="bg-slate-950 border-b border-purple-900/40 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Admin Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div>
                <div className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 bg-clip-text text-transparent">
                  Brain Graph Admin
                </div>
                <div className="text-[10px] text-purple-400 font-semibold tracking-wider uppercase">
                  Management & Orchestration
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Admin Navigation */}
          <div className="hidden xl:flex items-center gap-1">
            {adminNavLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive(link.href)
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Admin Profile & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin/notifications"
              className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center text-sm transition-colors"
              title="System Alerts"
            >
              🔔
            </Link>
            <Link
              href="/admin/settings"
              className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 flex items-center justify-center text-sm transition-colors"
              title="System Settings"
            >
              ⚙️
            </Link>

            <div className="flex items-center gap-2.5 bg-slate-900 border border-purple-800/50 rounded-full py-1 pl-1.5 pr-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white text-xs font-bold flex items-center justify-center">
                A
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">{user?.name || 'Administrator'}</div>
                <div className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">Super Admin</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="text-xs bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Admin Menu Button */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-5 space-y-1.5">
          {adminNavLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.href) ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span className="mr-2">{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <Link
              href="/admin/settings"
              onClick={() => setMobileOpen(false)}
              className="text-xs text-purple-300 font-semibold flex items-center gap-2"
            >
              ⚙️ Admin Settings
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
