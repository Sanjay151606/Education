'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/education/lib/context/AuthContext'

export default function StudentProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>({
    name: user?.name || 'Sanjay Kumar',
    email: user?.email || 'sanjay@braingraph.ai',
    targetGoal: 'Master Data Structures, Algorithms & Communication',
    dailyStudyMinutesGoal: 45,
    preferredLearningStyle: 'visual',
    gradeOrLevel: 'Undergraduate Computer Science'
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/student/profile')
      .then(r => r.json())
      .then(data => {
        if (data.student) {
          setProfile((p: any) => ({ ...p, ...data.student }))
        }
      })
      .catch(() => {})
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/student/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error('Save failed:', e)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>👤</span>
          <span>Student Learning Profile</span>
        </h1>
        <p className="text-xs text-slate-400">Configure your target objectives, daily goals, and cognitive preferences</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center justify-between">
          <span>✅ Profile and learning objectives updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-400 text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Target Learning Goal
          </label>
          <input
            type="text"
            value={profile.targetGoal}
            onChange={e => setProfile({ ...profile, targetGoal: e.target.value })}
            placeholder="e.g. Master Full-Stack Engineering & Data Structures"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Daily Study Goal (Minutes)
            </label>
            <input
              type="number"
              min="15"
              max="240"
              value={profile.dailyStudyMinutesGoal}
              onChange={e => setProfile({ ...profile, dailyStudyMinutesGoal: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Preferred Learning Style
            </label>
            <select
              value={profile.preferredLearningStyle}
              onChange={e => setProfile({ ...profile, preferredLearningStyle: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="visual">Visual (Graphs & Diagrams)</option>
              <option value="code">Hands-on Code Practice</option>
              <option value="reading">Conceptual Reading & Notes</option>
              <option value="audio">Interactive Audio & AI Tutor</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all"
          >
            Save Profile Settings
          </button>
        </div>
      </form>
    </div>
  )
}
