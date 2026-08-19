'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import KnowledgeGraph from '@/app/components/KnowledgeGraph'
import LearningPath from '@/app/components/LearningPath'
import SkillsRadar from '@/app/components/SkillsRadar'
import { useAuth } from '@/app/education/lib/context/AuthContext'

export default function StudentDashboardPage() {
  const { user } = useAuth()
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
          fetch('/api/student/profile').then(r => r.json()).catch(() => ({})),
          fetch('/api/agent/recommendations').then(r => r.json()).catch(() => ({})),
          fetch('/api/study-plan').then(r => r.json()).catch(() => ({})),
          fetch('/api/student/progress').then(r => r.json()).catch(() => ({})),
          fetch('/api/revision').then(r => r.json()).catch(() => ({}))
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
        console.error('Error fetching student dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  const studentName = user?.name || profile?.name || 'Sanjay'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-slate-800 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                AUTONOMOUS AI LEARNING OS
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome back, {studentName} 👋
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Your cognitive mastery is dynamically tracked. The Agentic AI has generated updated review nodes and personalized study schedules for today.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/student/quiz"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
              >
                <span>⚡ Quick Assessment</span>
              </Link>
              <Link
                href="/student/ai-tutor"
                className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all flex items-center gap-2"
              >
                <span>🤖 AI Tutor</span>
              </Link>
            </div>
          </div>

          {/* 4 Core Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1">Overall Mastery</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">72%</div>
              <div className="text-[10px] text-emerald-400 mt-1">↑ +4.2% this week</div>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1">Study Time</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">4h 35m</div>
              <div className="text-[10px] text-purple-300 mt-1">Target: 45m / day</div>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1">Quiz Performance</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">81%</div>
              <div className="text-[10px] text-slate-400 mt-1">12 total attempts</div>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1">Weakest Topic</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">Recursion</div>
              <div className="text-[10px] text-rose-300 mt-1">Review scheduled</div>
            </div>
          </div>
        </div>

        {/* Priority AI Recommendation Callout */}
        <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xl flex-shrink-0">
              🧠
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-purple-300 flex items-center gap-2">
                <span>Autonomous AI Coach Recommendation</span>
                <span className="bg-purple-500/20 px-2 py-0.5 rounded text-[10px] text-purple-200">High Priority</span>
              </div>
              <p className="text-sm font-semibold text-white mt-0.5">
                {priorityAction?.title || "Practice recursion tree tracing & base cases for 30 minutes today."}
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                {priorityAction?.reason || "Recent quiz showed 40% accuracy on stack unwinding questions."}
              </p>
            </div>
          </div>
          <Link
            href="/student/quiz?topic=topic_recursion"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex-shrink-0"
          >
            Start Remediation →
          </Link>
        </div>

        {/* 2-Column Core Section: Knowledge Graph + Study Plan & Weak Topics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 7 Cols: Interactive Brain Graph */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>🧠 Neural Knowledge Graph</span>
                  </h2>
                  <p className="text-xs text-slate-400">Live visualization of your concept mastery nodes</p>
                </div>
                <Link
                  href="/student/brain-graph"
                  className="text-xs text-blue-400 hover:underline font-semibold"
                >
                  Full Graph View →
                </Link>
              </div>
              <div className="h-[380px] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80">
                <KnowledgeGraph />
              </div>
            </div>

            {/* Learning Path Progression */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-3">Target Learning Path Progression</h3>
              <LearningPath />
            </div>
          </div>

          {/* Right 5 Cols: Today's Plan, Weak/Strong Nodes, and Skills Radar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Today's Adaptive Study Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📅 Today's Study Plan</span>
                </h3>
                <Link href="/student/study-plan" className="text-xs text-blue-400 hover:underline">
                  View Schedule
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🔄</span>
                    <div>
                      <div className="text-xs font-bold text-white">Spaced Revision: Recursion</div>
                      <div className="text-[11px] text-slate-400">20 mins • High priority</div>
                    </div>
                  </div>
                  <Link
                    href="/student/revision"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
                  >
                    Start
                  </Link>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📚</span>
                    <div>
                      <div className="text-xs font-bold text-white">Lesson: Graph BFS & DFS</div>
                      <div className="text-[11px] text-slate-400">25 mins • Course: DSA</div>
                    </div>
                  </div>
                  <Link
                    href="/student/courses"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    Watch
                  </Link>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📝</span>
                    <div>
                      <div className="text-xs font-bold text-white">Adaptive Checkpoint Quiz</div>
                      <div className="text-[11px] text-slate-400">10 mins • 4 Questions</div>
                    </div>
                  </div>
                  <Link
                    href="/student/quiz"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    Take
                  </Link>
                </div>
              </div>
            </div>

            {/* Weak & Strong Topics Distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Mastery Breakdown</h3>

              <div>
                <div className="text-xs font-semibold text-rose-400 mb-2 flex items-center gap-1.5">
                  <span>⚠️ Needs Improvement (Score &lt; 60%)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-medium">
                    Recursion (45%)
                  </span>
                  <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-medium">
                    Dynamic Programming (52%)
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <span>✨ Strong Concepts (Score ≥ 80%)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium">
                    Arrays & Strings (94%)
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium">
                    Hash Maps (88%)
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium">
                    Binary Search (85%)
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Radar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-3">Cognitive Skills Matrix</h3>
              <SkillsRadar />
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
