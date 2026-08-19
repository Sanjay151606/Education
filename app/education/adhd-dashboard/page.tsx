'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface MicroLesson {
  id: number
  title: string
  duration: number
  completed: boolean
  type: 'video' | 'reading' | 'interactive' | 'audio'
  difficulty: 'easy' | 'medium' | 'hard'
  videoUrl?: string // Added videoUrl field
}

export default function ADHDDashboard() {
  const [focusMode, setFocusMode] = useState(false)
  const [sessionLength, setSessionLength] = useState(15)
  const [breakTime, setBreakTime] = useState(5)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(sessionLength * 60)
  const [isBreak, setIsBreak] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [sensoryMode, setSensoryMode] = useState<'visual' | 'audio' | 'kinesthetic'>('visual')
  const [activeVideo, setActiveVideo] = useState<string | null>(null) // State for active video
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Updated Lessons with your links converted to Embed format
  const microLessons: MicroLesson[] = [
    { id: 1, title: 'Quick Grammar Tip', duration: 3, completed: true, type: 'video', difficulty: 'easy', videoUrl: 'https://www.youtube.com/embed/P0cjKUa4-1E' },
    { id: 2, title: 'Vocabulary Burst', duration: 2, completed: true, type: 'interactive', difficulty: 'easy' },
    { id: 3, title: 'Pronunciation Practice', duration: 5, completed: false, type: 'audio', difficulty: 'medium', videoUrl: 'https://www.youtube.com/embed/GzCHqx_lmJk' },
    { id: 4, title: 'Reading Snippet', duration: 4, completed: false, type: 'reading', difficulty: 'medium', videoUrl: 'https://www.youtube.com/embed/FfhZFRvmaVY' },
    { id: 5, title: 'Speaking Exercise', duration: 3, completed: false, type: 'interactive', difficulty: 'easy', videoUrl: 'https://www.youtube.com/embed/H8mRwu1gdbE' },
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
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerActive])

  const handleTimerComplete = () => {
    setTimerActive(false)
    if (!isBreak) {
      setShowReward(true)
      setCurrentStreak(prev => prev + 1)
      const earnedPoints = rewards[Math.floor(Math.random() * rewards.length)].points
      setTotalPoints(prev => prev + earnedPoints)
      setTimeout(() => setShowReward(false), 3000)
      setIsBreak(true)
      setTimeRemaining(breakTime * 60)
    } else {
      setIsBreak(false)
      setTimeRemaining(sessionLength * 60)
    }
  }

  const startTimer = () => setTimerActive(true)
  const pauseTimer = () => setTimerActive(false)
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

  const completedLessons = microLessons.filter(l => l.completed).length
  const progressPercentage = (completedLessons / microLessons.length) * 100

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl p-6 text-white mb-6 shadow-2xl">
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

        {/* Video Player Modal/Overlay - Appears when a lesson is started */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-4 w-full max-w-4xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Currently Learning...</h3>
                <button 
                  onClick={() => setActiveVideo(null)}
                  className="p-2 hover:bg-gray-100 rounded-full text-2xl"
                >✕</button>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src={activeVideo}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => {
                    setActiveVideo(null);
                    setTotalPoints(p => p + 5); // Mini reward for finishing
                  }}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg font-bold"
                >
                  Mark as Done ✓
                </button>
              </div>
            </div>
          </div>
        )}

        {showReward && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
            <div className="bg-gradient-to-r from-yellow-400 to-pink-500 rounded-3xl p-12 text-white text-center shadow-2xl">
              <div className="text-8xl mb-4">🌟</div>
              <div className="text-4xl font-bold">Amazing!</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Timer Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">⏱️ Focus Timer</h2>
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className={`px-4 py-2 rounded-lg font-semibold ${focusMode ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                >
                  {focusMode ? '🎯 Focus ON' : '👁️ Focus OFF'}
                </button>
              </div>

              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                  <circle
                    cx="96" cy="96" r="80" stroke="#8b5cf6" strokeWidth="12" fill="none"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * (1 - timeRemaining / (sessionLength * 60))}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-3xl font-bold">{formatTime(timeRemaining)}</div>
                  <div className="text-xs uppercase text-gray-500">{isBreak ? 'Break' : 'Focus'}</div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                {!timerActive ? (
                  <button onClick={startTimer} className="px-6 py-2 bg-green-500 text-white rounded-lg font-bold">▶ Start</button>
                ) : (
                  <button onClick={pauseTimer} className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-bold">⏸ Pause</button>
                )}
                <button onClick={resetTimer} className="px-6 py-2 bg-gray-500 text-white rounded-lg font-bold">🔄 Reset</button>
              </div>
            </div>

            {/* Micro Lessons Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">🎯 Micro Lessons</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {microLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      lesson.completed ? 'border-green-500 bg-green-50' : 'border-purple-200 hover:border-purple-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-gray-900">{lesson.title}</div>
                        <div className="text-xs text-gray-500">{lesson.duration} min • {lesson.type}</div>
                      </div>
                      <div className="text-xs font-bold px-2 py-1 bg-purple-100 rounded text-purple-700 uppercase">
                        {lesson.difficulty}
                      </div>
                    </div>
                    
                    {/* Updated Button to trigger the video state */}
                    <button 
                      onClick={() => lesson.videoUrl && setActiveVideo(lesson.videoUrl)}
                      disabled={!lesson.videoUrl}
                      className={`w-full mt-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        lesson.videoUrl 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {lesson.videoUrl ? 'Start Lesson →' : 'Coming Soon'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-2">🔥 Streak</h3>
              <div className="text-5xl font-bold">{currentStreak}</div>
              <p className="text-orange-100">Sessions today</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">🧠 Cognitive Load</h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full w-1/3"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Optimal learning state: 🟢 Low</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}