'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function RevisionPage() {
  const [revisions, setRevisions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [completedTopic, setCompletedTopic] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/revision')
      .then(r => r.json())
      .then(d => {
        if (d.dueRevision) setRevisions(d.dueRevision)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCompleteRevision = async (topicId: string) => {
    try {
      await fetch('/api/revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId })
      })
      setCompletedTopic(topicId)
      setRevisions(prev => prev.filter(r => r.topicId !== topicId))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="text-xs font-mono text-amber-400 mb-1">SPACED REPETITION ENGINE</div>
        <h1 className="text-3xl font-extrabold text-white">Intelligent Revision Queue</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review concepts right before retention decay occurs to solidify neural pathways.
        </p>
      </div>

      {completedTopic && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
          <span>✔ Spaced revision logged! Next revision cycle pushed forward.</span>
          <button onClick={() => setCompletedTopic(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Revision List */}
      <div className="space-y-4">
        {revisions.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="text-4xl">🎉</div>
            <h2 className="text-lg font-bold text-white">All Revisions Up to Date!</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your memory curves are in peak state across all studied topics. Continue your daily study plan.
            </p>
            <Link
              href="/education/dashboard"
              className="inline-block mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow"
            >
              Return to Dashboard
            </Link>
          </div>
        ) : (
          revisions.map((rev, idx) => (
            <div
              key={rev.id || idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-xs font-bold">
                    DUE NOW
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Mastery: {rev.masteryScore}% ({rev.status})
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{rev.topicTitle}</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Active retention window reached. Review core formulas, edge cases, and call tree backtracks.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/education/quiz?topic=${rev.topicId}`}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                  Quick Quiz
                </Link>
                <button
                  onClick={() => handleCompleteRevision(rev.topicId)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all"
                >
                  Mark Reviewed
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
