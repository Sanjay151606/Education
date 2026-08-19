'use client'

import { useState } from 'react'

interface CourseItem {
  id: string
  title: string
  category: string
  level: string
  topicCount: number
  enrolledStudents: number
  status: 'Published' | 'Draft' | 'Archived'
}

const INITIAL_COURSES: CourseItem[] = [
  {
    id: 'course_dsa',
    title: 'Data Structures & Algorithms',
    category: 'Computer Science',
    level: 'INTERMEDIATE',
    topicCount: 8,
    enrolledStudents: 620,
    status: 'Published'
  },
  {
    id: 'course_ai',
    title: 'Agentic AI & Neural Systems',
    category: 'Artificial Intelligence',
    level: 'ADVANCED',
    topicCount: 6,
    enrolledStudents: 410,
    status: 'Published'
  },
  {
    id: 'course_comm',
    title: 'Professional Communication Skills',
    category: 'Communication',
    level: 'BEGINNER',
    topicCount: 5,
    enrolledStudents: 220,
    status: 'Published'
  }
]

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES)
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Computer Science')
  const [newLevel, setNewLevel] = useState('INTERMEDIATE')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const newCourse: CourseItem = {
      id: `course_${Date.now()}`,
      title: newTitle,
      category: newCategory,
      level: newLevel,
      topicCount: 1,
      enrolledStudents: 0,
      status: 'Published'
    }
    setCourses([...courses, newCourse])
    setNewTitle('')
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>📚</span>
              <span>Course & Curriculum Management</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Author courses, attach prerequisite graph nodes, and manage learning content</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Create New Course</span>
          </button>
        </div>

        {/* Modal for Course Creation */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white text-base">Add New Course</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Course Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Advanced Graph Theory & Network Flow"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Communication">Communication</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Difficulty Level</label>
                  <select
                    value={newLevel}
                    onChange={e => setNewLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow"
                  >
                    Save Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {course.level}
                </span>
                <span className="text-[11px] font-semibold text-emerald-400">● {course.status}</span>
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">{course.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{course.category}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between text-xs text-slate-300">
                <span>Topics: <strong>{course.topicCount}</strong></span>
                <span>Enrolled: <strong>{course.enrolledStudents}</strong></span>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => alert(`Edit course ${course.title}`)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Edit Topics
                </button>
                <button
                  onClick={() => setCourses(courses.filter(c => c.id !== course.id))}
                  className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold"
                >
                  Archive
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
