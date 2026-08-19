'use client'

import { useState } from 'react'

interface StudentRecord {
  id: string
  name: string
  email: string
  level: string
  masteryScore: number
  quizCount: number
  studyTimeHours: number
  weakTopic: string
  status: 'Active' | 'At Risk' | 'Mastered'
  lastActive: string
  aiRecommendation: string
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'student_1',
    name: 'Sanjay Kumar',
    email: 'sanjay@braingraph.ai',
    level: 'Undergraduate',
    masteryScore: 72,
    quizCount: 12,
    studyTimeHours: 4.5,
    weakTopic: 'Recursion',
    status: 'Active',
    lastActive: '10 mins ago',
    aiRecommendation: 'Schedule 30-minute recursion tree tracing practice'
  },
  {
    id: 'student_2',
    name: 'Aarav Sharma',
    email: 'aarav@braingraph.ai',
    level: 'High School',
    masteryScore: 89,
    quizCount: 24,
    studyTimeHours: 9.2,
    weakTopic: 'Dynamic Programming',
    status: 'Mastered',
    lastActive: '1 hour ago',
    aiRecommendation: 'Advance to LeetCode Medium graph problems'
  },
  {
    id: 'student_3',
    name: 'Priya Patel',
    email: 'priya@braingraph.ai',
    level: 'Undergraduate',
    masteryScore: 48,
    quizCount: 5,
    studyTimeHours: 1.8,
    weakTopic: 'Linked Lists & Pointers',
    status: 'At Risk',
    lastActive: 'Yesterday',
    aiRecommendation: 'Trigger automated recovery workflow with interactive memory visualizer'
  },
  {
    id: 'student_4',
    name: 'Rohan Gupta',
    email: 'rohan@braingraph.ai',
    level: 'Graduate',
    masteryScore: 95,
    quizCount: 31,
    studyTimeHours: 14.1,
    weakTopic: 'None',
    status: 'Mastered',
    lastActive: '3 hours ago',
    aiRecommendation: 'Award System Architect mastery credential'
  }
]

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(INITIAL_STUDENTS[0])
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>👥</span>
              <span>Student Management Roster</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Inspect cohort mastery, quiz histories, and trigger AI remediation</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-950/40 border border-purple-800/40 px-3 py-1.5 rounded-lg">
            <span>Cohort Size: {students.length} Registered</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="md:col-span-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Cohort Statuses</option>
            <option value="Active">Active</option>
            <option value="Mastered">Mastered</option>
            <option value="At Risk">At Risk</option>
          </select>
        </div>

        {/* 2-Col Layout: Roster Table (8 cols) + Detail Drawer (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Mastery</th>
                    <th className="p-4">Quizzes</th>
                    <th className="p-4">Weak Topic</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.map(s => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedStudent(s)}
                      className={`cursor-pointer transition-colors ${
                        selectedStudent?.id === s.id ? 'bg-purple-950/30' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{s.name}</div>
                        <div className="text-[11px] text-slate-400">{s.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-purple-400">{s.masteryScore}%</div>
                        <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-purple-500 h-full rounded-full"
                            style={{ width: `${s.masteryScore}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-4 text-slate-300 font-mono">{s.quizCount} taken</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]">
                          {s.weakTopic}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                            s.status === 'Mastered'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : s.status === 'Active'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Profile Card (4 cols) */}
          {selectedStudent && (
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-bold text-lg flex items-center justify-center">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-400">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Level:</span>
                  <span className="text-white font-semibold">{selectedStudent.level}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Study Time:</span>
                  <span className="text-purple-300 font-mono">{selectedStudent.studyTimeHours} hours</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Last Active:</span>
                  <span className="text-emerald-400">{selectedStudent.lastActive}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
                  AI Recommendation & Remediation
                </h4>
                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 leading-relaxed">
                  {selectedStudent.aiRecommendation}
                </div>
              </div>

              <button
                onClick={() => alert(`Triggered autonomous remediation loop for ${selectedStudent.name}`)}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                ⚡ Trigger Agentic AI Intervention
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
