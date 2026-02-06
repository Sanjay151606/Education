'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface MicroLesson {
  id: number
  title: string
  duration: number // in minutes
  completed: boolean
  type: 'video' | 'reading' | 'interactive' | 'audio'
  difficulty: 'easy' | 'medium' | 'hard'
}

export default function ADHDDashboard() {
  const [focusMode, setFocusMode] = useState(false)
  const [sessionLength, setSessionLength] = useState(15) // minutes
  const [breakTime, setBreakTime] = useState(5)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(sessionLength * 60)
  const [isBreak, setIsBreak] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [sensoryMode, setSensoryMode] = useState<'visual' | 'audio' | 'kinesthetic'>('visual')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const microLessons: MicroLesson[] = [
    { id: 1, title: 'Quick Grammar Tip', duration: 3, completed: true, type: 'video', difficulty: 'easy' },
    { id: 2, title: 'Vocabulary Burst', duration: 2, completed: true, type: 'interactive', difficulty: 'easy' },
    { id: 3, title: 'Pronunciation Practice', duration: 5, completed: false, type: 'audio', difficulty: 'medium' },
    { id: 4, title: 'Reading Snippet', duration: 4, completed: false, type: 'reading', difficulty: 'medium' },
    { id: 5, title: 'Speaking Exercise', duration: 3, completed: false, type: 'interactive', difficulty: 'easy' },
    { id: 6, title: 'Listening Challenge', duration: 5, completed: false, type: 'audio', difficulty: 'hard' }
  ]

  const rewards = [
    { icon: '🌟', text: 'Star Earned!', points: 10 },
    { icon: '🎯', text: 'Target Hit!', points: 15 },
    { icon: '🔥', text: 'Streak Bonus!', points: 20 },
    { icon: '🏆', text: 'Achievement!', points: 25 },
    { icon: '💎', text: 'Diamond Unlocked!', points: 30 }
  ]

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerActive])

  const handleTimerComplete = () => {
    setTimerActive(false)
    if (!isBreak) {
      // Session completed - show reward
      setShowReward(true)
      setCurrentStreak(prev => prev + 1)
      const earnedPoints = rewards[Math.floor(Math.random() * rewards.length)].points
      setTotalPoints(prev => prev + earnedPoints)
      setTimeout(() => setShowReward(false), 3000)
      
      // Start break
      setIsBreak(true)
      setTimeRemaining(breakTime * 60)
    } else {
      // Break completed
      setIsBreak(false)
      setTimeRemaining(sessionLength * 60)
    }
  }

  const startTimer = () => {
    setTimerActive(true)
  }

  const pauseTimer = () => {
    setTimerActive(false)
  }

  const resetTimer = () => {
    setTimerActive(false)
    setIsBreak(false)
    setTimeRemaining(sessionLength * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    const percentage = (timeRemaining / (sessionLength * 60)) * 100
    if (percentage > 50) return 'from-green-500 to-emerald-600'
    if (percentage > 25) return 'from-yellow-500 to-orange-600'
    return 'from-red-500 to-pink-600'
  }

  const completedLessons = microLessons.filter(l => l.completed).length
  const progressPercentage = (completedLessons / microLessons.length) * 100

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl p-6 text-white mb-6 shadow-2xl animate-gradient">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🧠 ADHD-Friendly Learning Space</h1>
              <p className="text-purple-100">Optimized for focus, engagement, and success</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{totalPoints}</div>
              <div className="text-sm text-purple-100">Total Points</div>
            </div>
          </div>
        </div>

        {/* Reward Popup */}
        {showReward && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-scaleIn">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-3xl p-12 text-white text-center shadow-2xl">
              <div className="text-8xl mb-4 animate-bounce">{rewards[Math.floor(Math.random() * rewards.length)].icon}</div>
              <div className="text-4xl font-bold mb-2">Amazing Work!</div>
              <div className="text-2xl">+{rewards[Math.floor(Math.random() * rewards.length)].points} Points</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visual Timer */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">⏱️ Focus Timer</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFocusMode(!focusMode)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      focusMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {focusMode ? '🎯 Focus ON' : '👁️ Focus OFF'}
                  </button>
                </div>
              </div>

              {/* Circular Timer */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                <svg className="transform -rotate-90 w-64 h-64">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="url(#gradient)"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - timeRemaining / (sessionLength * 60))}`}
                    className="transition-all duration-1000"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={isBreak ? '#10b981' : '#8b5cf6'} />
                      <stop offset="100%" stopColor={isBreak ? '#059669' : '#6d28d9'} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{formatTime(timeRemaining)}</div>
                  <div className="text-lg font-semibold text-gray-600">
                    {isBreak ? '☕ Break Time' : '📚 Focus Time'}
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex gap-3 justify-center mb-4">
                {!timerActive ? (
                  <button onClick={startTimer} className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105">
                    ▶️ Start
                  </button>
                ) : (
                  <button onClick={pauseTimer} className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-bold text-lg hover:from-yellow-600 hover:to-orange-700 transition-all transform hover:scale-105">
                    ⏸️ Pause
                  </button>
                )}
                <button onClick={resetTimer} className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-bold text-lg hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105">
                  🔄 Reset
                </button>
              </div>

              {/* Session Length Adjustment */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-700">Focus Session:</span>
                  <span className="text-2xl font-bold text-purple-600">{sessionLength} min</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="5"
                  value={sessionLength}
                  onChange={(e) => {
                    setSessionLength(Number(e.target.value))
                    if (!timerActive) setTimeRemaining(Number(e.target.value) * 60)
                  }}
                  className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 min</span>
                  <span>25 min</span>
                  <span>45 min</span>
                </div>
              </div>
            </div>

            {/* Micro Lessons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">🎯 Micro Lessons</h2>
                <div className="text-sm font-semibold text-gray-600">
                  {completedLessons}/{microLessons.length} Complete
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-500 animate-gradient"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Lesson Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {microLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 cursor-pointer ${
                      lesson.completed
                        ? 'border-green-500 bg-green-50'
                        : 'border-purple-300 bg-purple-50 hover:border-purple-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          lesson.completed ? 'bg-green-500' : 'bg-purple-500'
                        } text-white`}>
                          {lesson.completed ? '✓' : lesson.id}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{lesson.title}</div>
                          <div className="text-xs text-gray-600">{lesson.duration} min • {lesson.type}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        lesson.difficulty === 'easy' ? 'bg-green-200 text-green-800' :
                        lesson.difficulty === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {lesson.difficulty}
                      </div>
                    </div>
                    {!lesson.completed && (
                      <button className="w-full mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all">
                        Start Lesson →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sensory Learning Modes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎨 Multi-Sensory Learning</h2>
              <p className="text-gray-600 mb-4">Choose your preferred learning style</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setSensoryMode('visual')}
                  className={`p-6 rounded-lg border-2 transition-all transform hover:scale-105 ${
                    sensoryMode === 'visual'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="text-4xl mb-2">👁️</div>
                  <div className="font-bold text-gray-900">Visual</div>
                  <div className="text-sm text-gray-600">Images, diagrams, colors</div>
                </button>

                <button
                  onClick={() => setSensoryMode('audio')}
                  className={`p-6 rounded-lg border-2 transition-all transform hover:scale-105 ${
                    sensoryMode === 'audio'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="text-4xl mb-2">🎧</div>
                  <div className="font-bold text-gray-900">Audio</div>
                  <div className="text-sm text-gray-600">Sounds, music, speech</div>
                </button>

                <button
                  onClick={() => setSensoryMode('kinesthetic')}
                  className={`p-6 rounded-lg border-2 transition-all transform hover:scale-105 ${
                    sensoryMode === 'kinesthetic'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="text-4xl mb-2">✋</div>
                  <div className="font-bold text-gray-900">Kinesthetic</div>
                  <div className="text-sm text-gray-600">Interactive, hands-on</div>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Streak Counter */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">🔥 Current Streak</h3>
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{currentStreak}</div>
                <div className="text-lg">Sessions Today</div>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i < currentStreak ? 'bg-white text-orange-600' : 'bg-orange-400/30'
                    }`}
                  >
                    {i < currentStreak ? '✓' : i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Dopamine Rewards */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎁 Rewards Unlocked</h3>
              <div className="space-y-3">
                {rewards.slice(0, 3).map((reward, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
                    <div className="text-3xl">{reward.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{reward.text}</div>
                      <div className="text-sm text-gray-600">+{reward.points} points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cognitive Load Indicator */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🧠 Cognitive Load</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Current Load</span>
                    <span className="font-bold text-green-600">Low ✓</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 w-1/3" />
                  </div>
                </div>
                <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  ✅ Perfect! You're in the optimal learning zone.
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/test" className="block w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all text-center">
                  📝 Take Assessment
                </Link>
                <Link href="/education/dashboard" className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-center">
                  📊 View Progress
                </Link>
                <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all">
                  🎯 Set Daily Goal
                </button>
              </div>
            </div>

            {/* Break Suggestions */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💆 Break Ideas</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span>🚶</span> Take a short walk
                </li>
                <li className="flex items-center gap-2">
                  <span>💧</span> Drink water
                </li>
                <li className="flex items-center gap-2">
                  <span>🧘</span> Stretch or breathe
                </li>
                <li className="flex items-center gap-2">
                  <span>👀</span> Look away from screen
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
