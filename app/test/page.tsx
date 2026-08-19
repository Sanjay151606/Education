'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '../components/Navigation'

export default function TestHome() {
  const router = useRouter()
  const [hasExistingProgress, setHasExistingProgress] = useState(false)
  const [candidateName, setCandidateName] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    const answers = localStorage.getItem('answers')
    setHasExistingProgress(!!answers)
  }, [])

  const startTest = () => {
    if (!candidateName.trim()) {
      alert('Please enter your name')
      return
    }
    
    localStorage.removeItem('answers')
    localStorage.setItem('candidateName', candidateName)
    localStorage.setItem('testStartTime', new Date().toISOString())
    localStorage.setItem('answers', JSON.stringify({
      sectionA: {},
      sectionB: {},
      sectionC: {},
      sectionD: {}
    }))
    router.push('/section-a')
  }

  const continueTest = () => {
    router.push('/section-a')
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Back to Education Link */}
          <div className="mb-6">
            <Link href="/education" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold">
              <span>←</span>
              <span>Back to Brain Graph</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-full p-6 shadow-2xl animate-gradient">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 animate-gradient">
              Communication Assessment Test
            </h1>
            <p className="text-xl text-gray-600 mb-2">Comprehensive Skills Evaluation</p>
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-sm opacity-40 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-full shadow-lg border-2 border-yellow-500/50">
                <svg className="w-5 h-5 animate-pulse" viewBox="0 0 20 20" fill="url(#goldGradientSmall)">
                  <defs>
                    <linearGradient id="goldGradientSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path d="M10 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-7-5z" />
                </svg>
                <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 bg-clip-text text-transparent">
                  Powered by J-SQUAD
                </span>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping absolute -top-1 -right-1"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full absolute -top-1 -right-1 shadow-lg shadow-yellow-500/50"></div>
              </div>
            </div>
          </div>

          <div className="test-card mb-6">
            {/* Test Overview */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 card-hover section-badge shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl animate-bounce">🅰️</span>
                  <div>
                    <h3 className="font-bold text-xl text-blue-900">Section A</h3>
                    <p className="text-sm text-blue-700">Reading & Listening</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-1">23 Questions</p>
                <p className="text-sm text-gray-600">18 Read Aloud + 5 Listen & Repeat</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 card-hover section-badge shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl animate-bounce" style={{ animationDelay: '0.1s' }}>🅱️</span>
                  <div>
                    <h3 className="font-bold text-xl text-green-900">Section B</h3>
                    <p className="text-sm text-green-700">Speaking</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600 mb-1">4 Topics</p>
                <p className="text-sm text-gray-600">90s prep + 60s speaking each</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 card-hover section-badge shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🅾️</span>
                  <div>
                    <h3 className="font-bold text-xl text-purple-900">Section C</h3>
                    <p className="text-sm text-purple-700">Grammar</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-purple-600 mb-1">34 Questions</p>
                <p className="text-sm text-gray-600">Verbs, Tenses, Articles, Voice</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200 card-hover section-badge shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl animate-bounce" style={{ animationDelay: '0.3s' }}>🅳</span>
                  <div>
                    <h3 className="font-bold text-xl text-orange-900">Section D</h3>
                    <p className="text-sm text-orange-700">Listening Comprehension</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-orange-600 mb-1">16 Questions</p>
                <p className="text-sm text-gray-600">4 passages × 4 questions</p>
              </div>
            </div>

            {/* Candidate Info */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Candidate Name *
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>

            {/* Instructions Toggle */}
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full mb-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border-2 border-blue-200 text-left transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-900">📋 Important Instructions</span>
                <svg 
                  className={`w-5 h-5 text-blue-600 transition-transform ${showInstructions ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {showInstructions && (
              <div className="mb-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">⚠️</span>
                  <p className="text-sm"><strong>Audio plays ONCE only</strong> - No replay, pause, or rewind</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">🎤</span>
                  <p className="text-sm"><strong>ONE recording attempt</strong> per question - Make it count</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">⏱️</span>
                  <p className="text-sm"><strong>Timers are strict</strong> - Answer within time limits</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">🚫</span>
                  <p className="text-sm"><strong>Do not switch tabs</strong> - Stay on the test page</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">🎧</span>
                  <p className="text-sm"><strong>Use wired headphones</strong> - Bluetooth may cause delays</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">🔊</span>
                  <p className="text-sm"><strong>Enable microphone</strong> - Grant permissions when asked</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">💾</span>
                  <p className="text-sm"><strong>Auto-save enabled</strong> - Progress saved every 3 seconds</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={startTest}
                className="w-full btn-primary text-lg py-4"
              >
                🚀 Start New Test
              </button>
              
              {hasExistingProgress && (
                <button
                  onClick={continueTest}
                  className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg transition-all"
                >
                  ▶️ Continue Previous Test
                </button>
              )}
            </div>

            {/* Footer Info */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">Total Duration: ~60-90 minutes | Total Questions: 77</p>
              <p className="text-sm text-gray-600 mb-4">Ensure stable internet connection throughout the test</p>
              
              <div className="inline-block">
                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-full px-6 py-3 shadow-lg group-hover:shadow-xl transition-all border-2 border-yellow-500/50">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <svg className="w-5 h-5 animate-pulse" viewBox="0 0 20 20" fill="url(#goldGradientFooter)">
                        <defs>
                          <linearGradient id="goldGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
                          </linearGradient>
                        </defs>
                        <path d="M10 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-7-5z" />
                      </svg>
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 bg-clip-text text-transparent">
                          Powered by J-SQUAD
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
      </div>
    </>
  )
}
