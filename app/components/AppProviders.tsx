'use client'

import React from 'react'
import { AuthProvider } from '@/app/education/lib/context/AuthContext'
import Navigation from '@/app/components/Navigation'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navigation />
      {children}
    </AuthProvider>
  )
}
