'use client'

import { AuthProvider, StudentGuard } from '@/app/education/lib/context/AuthContext'
import StudentNavbar from '@/app/components/StudentNavbar'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <StudentGuard>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
          <StudentNavbar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </StudentGuard>
    </AuthProvider>
  )
}
