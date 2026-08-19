'use client'

import { AuthProvider, AdminGuard } from '@/app/education/lib/context/AuthContext'
import AdminNavbar from '@/app/components/AdminNavbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AdminGuard>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
          <AdminNavbar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </AdminGuard>
    </AuthProvider>
  )
}
