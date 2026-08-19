'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Finish() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [candidateName, setCandidateName] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('candidateName') || 'Candidate'
    setCandidateName(name)
    
    const answers = JSON.parse(localStorage.getItem('answers') || '{}')
    const sectionACount = Object.keys(answers.sectionA || {}).length
    const sectionBCount = Object.keys(answers.sectionB || {}).length
    const sectionCCount = Object.keys(answers.sectionC || {}).length
    const sectionDCount = Object.keys(answers.sectionD || {}).length
    
    setStats({
      sectionA: sectionACount,
      sectionB: sectionBCount,
      sectionC: sectionCCount,
      sectionD: sectionDCount,
      total: sectionACount + sectionBCount + sectionCCount + sectionDCount
    })
  }, [])

  const submitTest = async () => {
    setSubmitting(true)
    
    const answers = JSON.parse(localStorage.getItem('answers') || '{}')
    const progress = JSON.parse(localStorage.getItem('progress') || '{}')
    const testStartTime = localStorage.getItem('testStartTime')
    
    const submission = {
      candidateName,
      answers,
      progress,
      testStartTime,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      stats
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      })

      const result = await response.json()
      console.log('Submission result:', result)
      
      setSubmitted(true)
      setSubmitting(false)
    } catch (err) {
      console.error('Submission error:', err)
      alert('Failed to submit test. Please try again.')
      setSubmitting(false)
    }
  }

  const startNewTest = () => {
    localStorage.removeItem('answers')
    localStorage.removeItem('progress')
    localStorage.removeItem('candidateName')
    localStorage.removeItem('testStartTime')
    router.push('/')
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          <div className="test-card text-center">
            <div className="mb-6">
              <div className="inline-block p-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 shadow-2xl animate-bounce">
                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-gradient">
              Test Submitted Successfully!
            </h1>
            <p className="text-2xl text-gray-600 mb-2">
              Thank you, <strong className="text-green-600">{candidateName}</strong>!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-8">
              <svg className="w-5 h-5 text-green-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-green-800">All responses recorded</span>
            </div>

            <div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h2 className="font-bold text-lg mb-4 text-gray-900">Your Submission Summary:</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{stats?.sectionA || 0}</div>
                  <div className="text-sm text-gray-600">Section A</div>
                  <div className="text-xs text-gray-500">/ 23</div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{stats?.sectionB || 0}</div>
                  <div className="text-sm text-gray-600">Section B</div>
                  <div className="text-xs text-gray-500">/ 4</div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{stats?.sectionC || 0}</div>
                  <div className="text-sm text-gray-600">Section C</div>
                  <div className="text-xs text-gray-500">/ 34</div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">{stats?.sectionD || 0}</div>
                  <div className="text-sm text-gray-600">Section D</div>
                  <div className="text-xs text-gray-500">/ 16</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-300">
                <div className="text-2xl font-bold text-gray-900">
                  Total: {stats?.total || 0} / 77 responses
                </div>
              </div>
            </div>

            <div className="mb-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
              <h3 className="font-bold text-gray-900 mb-2">✓ What Happens Next?</h3>
              <p className="text-sm text-gray-700">
                Your responses have been recorded and logged. The evaluation team will review your submission and contact you with the results.
              </p>
            </div>
            
            <button
              onClick={startNewTest}
              className="btn-primary text-lg px-8 py-4"
            >
              🏠 Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="test-card">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              Test Complete!
            </h1>
            <p className="text-gray-600">
              Great job, {candidateName}! You've completed all sections.
            </p>
          </div>
          
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
            <h2 className="font-bold text-lg mb-4 text-gray-900">📊 Your Progress:</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-4 bg-white rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{stats?.sectionA || 0}</div>
                <div className="text-sm text-gray-600">Section A</div>
                <div className="text-xs text-gray-500">Reading & Listening</div>
              </div>
              <div className="p-4 bg-white rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">{stats?.sectionB || 0}</div>
                <div className="text-sm text-gray-600">Section B</div>
                <div className="text-xs text-gray-500">Speaking</div>
              </div>
              <div className="p-4 bg-white rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600">{stats?.sectionC || 0}</div>
                <div className="text-sm text-gray-600">Section C</div>
                <div className="text-xs text-gray-500">Grammar</div>
              </div>
              <div className="p-4 bg-white rounded-lg text-center">
                <div className="text-3xl font-bold text-orange-600">{stats?.sectionD || 0}</div>
                <div className="text-sm text-gray-600">Section D</div>
                <div className="text-xs text-gray-500">Listening</div>
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {stats?.total || 0} / 77
              </div>
              <div className="text-sm text-gray-600">Total Responses Recorded</div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <h2 className="font-bold mb-3 text-gray-900">⚠️ Before Submitting:</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>All your responses have been auto-saved</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>You can review answers by going back to any section</span>
              </li>
              <li className="flex items-start gap-2">
                <span>⚠️</span>
                <span><strong>Once submitted, you cannot make changes</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span>📧</span>
                <span>Results will be communicated via email</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <button
              onClick={submitTest}
              disabled={submitting}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                submitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg transform hover:scale-105'
              }`}
            >
              {submitting ? '⏳ Submitting...' : '✓ Submit Final Test'}
            </button>
            
            <button
              onClick={() => router.push('/section-a')}
              className="w-full btn-secondary py-4 text-lg"
            >
              ← Review Answers
            </button>
          </div>

          {/* powerhouse Credit */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="flex items-center justify-center">
              <div className="relative group cursor-pointer">
                {/* Gold Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity"></div>
                
                {/* Silver/Gold Badge */}
                <div className="relative flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-full shadow-lg border-2 border-yellow-500/50">
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="url(#goldGradientFinish)">
                    <defs>
                      <linearGradient id="goldGradientFinish" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <path d="M10 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-7-5z" />
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 bg-clip-text text-transparent">
                      Crafted by powerhouse.
                    </span>
                    <span className="text-xs text-gray-600">Excellence in Assessment Technology</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
