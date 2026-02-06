'use client'

export default function AnimatedLogo() {
  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
      <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full p-6 shadow-2xl animate-gradient">
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  )
}
