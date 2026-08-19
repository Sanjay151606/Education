'use client'

import { useState } from 'react'

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedStudent, setSelectedStudent] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [selectedTopic, setSelectedTopic] = useState('all')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>📊</span>
              <span>Cohort Learning Analytics & Insights</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Aggregate performance metrics, retention trajectories, and knowledge gap hot-spots</p>
          </div>
          
          {/* Date Filter */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {['7d', '30d', '90d', 'All'].map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  timeRange === r ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Dimensional Filter Bar (Student, Course, Topic) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filter by Student</label>
            <select
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Students (Cohort)</option>
              <option value="sanjay">Sanjay Kumar</option>
              <option value="aarav">Aarav Sharma</option>
              <option value="priya">Priya Patel</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filter by Course</label>
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Courses</option>
              <option value="dsa">Data Structures & Algorithms</option>
              <option value="ai">Agentic AI & Neural Systems</option>
              <option value="comm">Professional Communication</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filter by Topic</label>
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Topics</option>
              <option value="recursion">Recursion & Call Stack</option>
              <option value="dp">Dynamic Programming</option>
              <option value="graphs">Graph Algorithms</option>
              <option value="trees">Binary Search Trees</option>
            </select>
          </div>
        </div>

        {/* Aggregate KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold mb-1">Average Completion Rate</div>
            <div className="text-3xl font-extrabold text-purple-400">68.4%</div>
            <div className="text-[10px] text-emerald-400 mt-1">↑ +5.1% vs last month</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold mb-1">Average Session Length</div>
            <div className="text-3xl font-extrabold text-blue-400">38.2m</div>
            <div className="text-[10px] text-blue-300 mt-1">Target: 30m / session</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold mb-1">AI Remediation Success</div>
            <div className="text-3xl font-extrabold text-emerald-400">84.6%</div>
            <div className="text-[10px] text-slate-400 mt-1">312 students recovered</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="text-xs text-slate-400 font-semibold mb-1">Google Sheet Audit Syncs</div>
            <div className="text-3xl font-extrabold text-pink-400">100%</div>
            <div className="text-[10px] text-emerald-400 mt-1">Zero dropped events</div>
          </div>
        </div>

        {/* 2-Column Insight Visualizers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Weakest Knowledge Nodes Across Cohort</h3>
            <p className="text-xs text-slate-400">Topics with the lowest first-attempt quiz accuracy</p>
            
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-medium">Recursion & Call Stack</span>
                  <span className="text-rose-400 font-mono">42% Mastery</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-medium">Dynamic Programming Memoization</span>
                  <span className="text-amber-400 font-mono">51% Mastery</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '51%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-medium">Graph Topological Sort</span>
                  <span className="text-blue-400 font-mono">63% Mastery</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '63%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Course Engagement Distribution</h3>
            <p className="text-xs text-slate-400">Student active participation breakdown by curriculum</p>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-medium">Data Structures & Algorithms</span>
                  <span className="text-purple-400 font-mono">54% Enrollment</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '54%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-medium">Agentic AI & Neural Systems</span>
                  <span className="text-indigo-400 font-mono">29% Enrollment</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '29%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white font-medium">Communication Assessment Test</span>
                  <span className="text-pink-400 font-mono">17% Enrollment</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full rounded-full" style={{ width: '17%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
