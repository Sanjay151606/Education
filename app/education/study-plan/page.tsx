'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StudyPlanPage() {
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetch('/api/study-plan')
      .then(r => r.json())
      .then(d => {
        if (d.studyPlan) setPlan(d.studyPlan)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleRegenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/study-plan', { method: 'POST' })
      const data = await res.json()
      if (data.plan) setPlan(data.plan)
    } catch (e) {
      console.error(e)
    } finally {
      setGenerating(false)
    }
  }

  const handleUpdateStatus = async (sessionId: string, status: string) => {
    try {
      const res = await fetch('/api/study-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, status })
      })
      const data = await res.json()
      if (data.plan) setPlan(data.plan)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-mono text-blue-400 mb-1">AUTONOMOUS STUDY COACH</div>
          <h1 className="text-3xl font-extrabold text-white">Today's AI Study Plan</h1>
          <p className="text-sm text-slate-400 mt-1">
            Dynamic sessions scheduled based on your current knowledge gaps and spaced repetition cycles.
          </p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={generating}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <span>{generating ? 'Re-analyzing...' : 'Regenerate Plan'}</span>
          <span>⚡</span>
        </button>
      </div>

      {/* Plan Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Active Plan</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            Target: {plan?.goalMinutes || 45} mins
          </span>
        </div>
        <p className="text-sm text-slate-300">
          {plan?.summary || 'Focus on overcoming weak areas in Recursion (35%) and Linked List (42%) with active practice.'}
        </p>
      </div>

      {/* Sessions Queue */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Scheduled Learning Blocks</h2>

        <div className="space-y-3">
          {plan?.sessions?.map((sess: any, idx: number) => {
            const isCompleted = sess.status === 'COMPLETED'
            return (
              <div
                key={sess.id || idx}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-950/40 border-slate-900 opacity-60'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>{sess.scheduledFor || '10:00 AM'}</span>
                    <span>•</span>
                    <span>{sess.plannedDurationMinutes} min</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold">
                      {sess.sessionType}
                    </span>
                  </div>
                  <div className="text-base font-bold text-white">{sess.title}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(sess.id, isCompleted ? 'PENDING' : 'COMPLETED')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isCompleted ? '✓ Completed' : 'Mark Done'}
                  </button>

                  <Link
                    href={`/education/${sess.sessionType === 'QUIZ' ? 'quiz' : 'ai-tutor'}?topic=${sess.topicId}`}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow transition-all"
                  >
                    Start Now →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
