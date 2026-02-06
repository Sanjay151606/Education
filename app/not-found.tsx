import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="test-card">
          <div className="mb-8">
            <div className="text-9xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              404
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          
          <div className="mb-8">
            <svg className="w-32 h-32 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <Link href="/" className="btn-primary inline-block text-lg px-8 py-4">
            🏠 Return to Home
          </Link>
          
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-500">Powered by</span>
              <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                J-Squad
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
