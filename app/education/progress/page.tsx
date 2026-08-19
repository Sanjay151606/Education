'use client'

import { useState, useEffect } from 'react'
import ProgressChart from '@/app/components/ProgressChart'
import SkillsRadar from '@/app/components/SkillsRadar'
import Link from 'next/link'

export default function ProgressAnalyticsPage() {
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/student/progress')
      .then(r => r.json())
      .then(d => {
        if (d.progress) setProgress(d.progress)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="text-xs font-mono text-blue-400 mb-1">STUDENT ANALYTICS &amp; DIAGNOSTICS</div>
        <h1 className="text-3xl font-extrabold text-white">Learning Performance &amp; Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed telemetry across quiz attempts, historical mastery trends, and skill radars.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Average Score</div>
          <div className="text-3xl font-bold text-blue-400 mt-1">{progress?.averageScore || 78}%</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Quizzes</div>
          <div className="text-3xl font-bold text-purple-400 mt-1">{progress?.totalAttempts || 12}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Study Streak</div>
          <div className="text-3xl font-bold text-emerald-400 mt-1">6 Days 🔥</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs font-semibold text-slate-400 uppercase">Mastery Index</div>
          <div className="text-3xl font-bold text-amber-400 mt-1">72.4</div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">📈 Mastery Trajectory</h2>
          <ProgressChart />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">🎯 Multi-Dimensional Skill Radar</h2>
          <SkillsRadar />
        </div>
      </div>

      {/* Detailed Mastery Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white">Topic Mastery Breakdown</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 font-mono uppercase">
              <tr>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Mastery</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4">Correct / Total</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {progress?.masteries?.map((m: any) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{m.topicTitle}</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">{m.masteryScore}%</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        m.masteryScore >= 80
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : m.masteryScore >= 60
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{m.attemptCount}</td>
                  <td className="py-3 px-4 font-mono">{m.correctCount} / {m.correctCount + m.incorrectCount}</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/education/quiz?topic=${m.topicId}`}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold text-[11px] transition-colors"
                    >
                      Quiz
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
