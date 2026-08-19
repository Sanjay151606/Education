'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import KnowledgeGraph from '@/app/components/KnowledgeGraph'
import LearningPath from '@/app/components/LearningPath'
import SkillsRadar from '@/app/components/SkillsRadar'
import TaskWorkflow from '@/app/components/TaskWorkflow'

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [priorityAction, setPriorityAction] = useState<any>(null)
  const [studyPlan, setStudyPlan] = useState<any>(null)
  const [weakTopics, setWeakTopics] = useState<any[]>([])
  const [strongTopics, setStrongTopics] = useState<any[]>([])
  const [dueRevisions, setDueRevisions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profRes, recRes, planRes, progRes, revRes] = await Promise.all([
          fetch('/api/student/profile').then(r => r.json()),
          fetch('/api/agent/recommendations').then(r => r.json()),
          fetch('/api/study-plan').then(r => r.json()),
          fetch('/api/student/progress').then(r => r.json()),
          fetch('/api/revision').then(r => r.json())
        ])

        if (profRes.student) setProfile(profRes.student)
        if (recRes.recommendations) setRecommendations(recRes.recommendations)
        if (recRes.priority) setPriorityAction(recRes.priority)
        if (planRes.studyPlan) setStudyPlan(planRes.studyPlan)
        if (revRes.dueRevision) setDueRevisions(revRes.dueRevision)

        if (progRes.progress?.masteries) {
          const masteries = progRes.progress.masteries
          setWeakTopics(masteries.filter((m: any) => m.masteryScore < 60))
          setStrongTopics(masteries.filter((m: any) => m.masteryScore >= 80))
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header & Metric Cards */}
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-slate-800 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                AGENTIC AI LEARNING OPERATING SYSTEM
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Good Morning, {profile?.name || 'Alex Rivera'} 👋
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Target: {profile?.targetGoal || 'Master Data Structures & Technical Communication'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/education/ai-tutor"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <span>Ask AI Tutor</span>
                <span>🤖</span>
              </Link>
              <Link
                href="/education/quiz"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2"
              >
                <span>Take Quiz</span>
                <span>⚡</span>
              </Link>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Overall Mastery</div>
              <div className="text-3xl font-extrabold text-blue-400 mt-1">
                {profile?.overallMastery ?? 72}%
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Multi-signal composite</div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Study Streak</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                {profile?.currentStreak ?? 6} Days 🔥
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Consistent learner</div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Study Time</div>
              <div className="text-3xl font-extrabold text-purple-400 mt-1">18h 42m</div>
              <div className="text-[11px] text-slate-500 mt-0.5">This week</div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Topics Completed</div>
              <div className="text-3xl font-extrabold text-amber-400 mt-1">24 / 32</div>
              <div className="text-[11px] text-slate-500 mt-0.5">75% coverage</div>
            </div>
          </div>
        </div>

        {/* Priority AI Recommendation Card */}
        {priorityAction && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-purple-950/30 to-slate-900 border border-red-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold font-mono">
                <span>PRIORITY AI RECOMMENDATION</span>
                <span>•</span>
                <span>MASTERY: {priorityAction.masteryScore}%</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Revise {priorityAction.topicTitle}
              </h2>
              <p className="text-slate-300 text-sm max-w-2xl">
                {priorityAction.reason}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/education/quiz?topic=${priorityAction.topicId}`}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/20 hover:scale-[1.02] transition-all"
              >
                Start Practice Quiz
              </Link>
              <Link
                href={`/education/ai-tutor?topic=${priorityAction.topicId}`}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-all"
              >
                Tutor Explanation
              </Link>
            </div>
          </div>
        )}

        {/* Main Grid: Knowledge Graph & Today's Study Plan */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Interactive Graph & Visualizations */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🧠 Knowledge Graph</span>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-mono">Real-time</span>
                  </h2>
                  <p className="text-xs text-slate-400">Interactive dependency tree with dynamic mastery tracking</p>
                </div>
                <Link href="/education/learning-graph" className="text-xs text-blue-400 hover:underline font-semibold">
                  Full Graph View →
                </Link>
              </div>
              <KnowledgeGraph />
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🛣️ Adaptive Learning Trajectory</h2>
              <LearningPath />
            </div>
          </div>

          {/* Right Col: Today's AI Plan & Weak/Strong Topics */}
          <div className="space-y-6">
            {/* Today's AI Plan */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📅 Today's AI Plan</span>
                </h3>
                <span className="text-xs text-emerald-400 font-mono font-semibold">
                  {studyPlan?.goalMinutes || 45} mins goal
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">{studyPlan?.summary}</p>

              <div className="space-y-3">
                {studyPlan?.sessions?.map((sess: any, idx: number) => (
                  <div
                    key={sess.id || idx}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs text-slate-400 font-mono">{sess.scheduledFor || '10:00 AM'} • {sess.plannedDurationMinutes} min</div>
                      <div className="text-sm font-semibold text-white">{sess.title}</div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 font-mono font-semibold">
                      {sess.sessionType}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/education/study-plan"
                className="mt-4 block text-center py-2.5 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
              >
                View &amp; Customize Plan →
              </Link>
            </div>

            {/* Mastery Breakdown */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white">📊 Diagnostic Breakdown</h3>
              
              {/* Weak Topics */}
              <div>
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Weak Areas (&lt; 60%)</div>
                <div className="space-y-2">
                  {weakTopics.map(w => (
                    <div key={w.topicId} className="flex items-center justify-between text-xs p-2 rounded bg-red-950/20 border border-red-900/30">
                      <span className="text-slate-200 font-medium">{w.topicTitle || w.topicId}</span>
                      <span className="font-bold text-red-400 font-mono">{w.masteryScore}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strong Topics */}
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Mastered Areas (≥ 80%)</div>
                <div className="space-y-2">
                  {strongTopics.map(s => (
                    <div key={s.topicId} className="flex items-center justify-between text-xs p-2 rounded bg-emerald-950/20 border border-emerald-900/30">
                      <span className="text-slate-200 font-medium">{s.topicTitle || s.topicId}</span>
                      <span className="font-bold text-emerald-400 font-mono">{s.masteryScore}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spaced Revision Alert */}
              {dueRevisions.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Spaced Revision Due</div>
                  <p className="text-xs text-slate-400 mb-2">
                    {dueRevisions.length} topic requires review today to prevent retention decay.
                  </p>
                  <Link
                    href="/education/revision"
                    className="block text-center py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg"
                  >
                    Complete Revision Session
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
