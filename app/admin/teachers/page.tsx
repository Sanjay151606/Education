'use client'

import { useState } from 'react'

interface TeacherRecord {
  id: string
  name: string
  email: string
  department: string
  assignedCourses: string[]
  activeStudents: number
  status: 'Active' | 'On Leave'
}

const INITIAL_TEACHERS: TeacherRecord[] = [
  {
    id: 'teacher_1',
    name: 'Dr. Evelyn Vance',
    email: 'evelyn.vance@braingraph.ai',
    department: 'Algorithms & Data Structures',
    assignedCourses: ['Data Structures & Algorithms', 'Graph Theory Mastery'],
    activeStudents: 412,
    status: 'Active'
  },
  {
    id: 'teacher_2',
    name: 'Prof. Marcus Brody',
    email: 'marcus.brody@braingraph.ai',
    department: 'AI & Machine Learning',
    assignedCourses: ['Agentic AI Architecture', 'Deep Learning Concepts'],
    activeStudents: 320,
    status: 'Active'
  },
  {
    id: 'teacher_3',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@braingraph.ai',
    department: 'Professional Communication',
    assignedCourses: ['Technical Presentation & Read Aloud', 'Active Listening'],
    activeStudents: 254,
    status: 'Active'
  }
]

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<TeacherRecord[]>(INITIAL_TEACHERS)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>👨‍🏫</span>
              <span>Faculty & Instructor Management</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage teacher course allocations, grading permissions, and mentorship cohorts</p>
          </div>
          <button
            onClick={() => alert('Invite instructor modal')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            + Add Instructor
          </button>
        </div>

        {/* Teachers Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-4">Instructor</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Assigned Courses</th>
                  <th className="p-4">Students Mentored</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {teachers.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-[11px] text-slate-400">{t.email}</div>
                    </td>
                    <td className="p-4 text-purple-300 font-medium">{t.department}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {t.assignedCourses.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-mono">{t.activeStudents} students</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full font-bold text-[10px] uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
