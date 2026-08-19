'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 1250,
    activeStudents: 986,
    totalCourses: 24,
    totalQuizzes: 82,
    avgMastery: 71,
    avgQuizScore: 78,
    weakestTopic: 'Recursion',
    popularCourse: 'Data Structures & Algorithms',
    aiAgentStatus: 'Operational',
    googleSheetsStatus: 'Healthy',
    activeWorkflows: 6
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="relative rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-900/40 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                ADMINISTRATION & ORCHESTRATION ENGINE
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                System Administration Dashboard
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Global overview of student cohort mastery, Agentic AI background automations, and Google Sheets cloud backups.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/admin/workflows"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2"
              >
                <span>⚡ Workflow Engine</span>
              </Link>
              <Link
                href="/admin/google-sheets"
                className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all flex items-center gap-2"
              >
                <span>📋 Google Sheets Sync</span>
              </Link>
            </div>
          </div>

          {/* Key Admin Cohort Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-6 border-t border-purple-900/30">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1">Total Students</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">{stats.totalStudents.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-400 mt-1">Active: {stats.activeStudents}</div>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1">Total Courses</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">{stats.totalCourses}</div>
              <div className="text-[10px] text-blue-300 mt-1">DSA, AI & Communication</div>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1">Total Quizzes</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">{stats.totalQuizzes}</div>
              <div className="text-[10px] text-slate-400 mt-1">Calibrated bank</div>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1">Cohort Mastery</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">{stats.avgMastery}%</div>
              <div className="text-[10px] text-purple-300 mt-1">Avg Score: {stats.avgQuizScore}%</div>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-1">Weakest Topic</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">{stats.weakestTopic}</div>
              <div className="text-[10px] text-rose-300 mt-1">Remediating 342 students</div>
            </div>
          </div>
        </div>

        {/* System Health & Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">AI Agent Swarm</div>
                <div className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Running Normally</span>
                </div>
              </div>
            </div>
            <Link href="/admin/ai-monitoring" className="text-xs text-purple-400 hover:underline font-semibold">
              Inspect →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-xl">
                📋
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">Google Sheets Sync</div>
                <div className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Backup Healthy</span>
                </div>
              </div>
            </div>
            <Link href="/admin/google-sheets" className="text-xs text-purple-400 hover:underline font-semibold">
              Logs →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xl">
                ⚡
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">Autonomous Workflows</div>
                <div className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>6 Active Triggers</span>
                </div>
              </div>
            </div>
            <Link href="/admin/workflows" className="text-xs text-purple-400 hover:underline font-semibold">
              Manage →
            </Link>
          </div>
        </div>

        {/* Quick Admin Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/students"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="text-lg font-bold text-white">Student Management</h3>
            <p className="text-xs text-slate-400 mt-1">Search rosters, analyze student progress, inspect quiz submissions & remediation plans.</p>
          </Link>

          <Link
            href="/admin/courses"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📚</div>
            <h3 className="text-lg font-bold text-white">Course & Topic Content</h3>
            <p className="text-xs text-slate-400 mt-1">Create courses, assign prerequisite tree nodes, upload lesson resources & difficulty levels.</p>
          </Link>

          <Link
            href="/admin/quizzes"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📝</div>
            <h3 className="text-lg font-bold text-white">Quiz Question Bank</h3>
            <p className="text-xs text-slate-400 mt-1">Manage multiple-choice questions, set automated scoring rubrics & link to knowledge graph.</p>
          </Link>

          <Link
            href="/admin/analytics"
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-lg font-bold text-white">Cohort Analytics</h3>
            <p className="text-xs text-slate-400 mt-1">Deep-dive into student retention rates, concept difficulty distributions, and learning velocities.</p>
          </Link>
        </div>

      </div>
    </div>
  )
}
