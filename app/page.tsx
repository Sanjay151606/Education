'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to Brain Graph home
    router.push('/education')
  }, [router])

  return null // Redirecting...
}
