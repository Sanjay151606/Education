'use client'

import { useState } from 'react'

export default function StudentSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [dailyReminder, setDailyReminder] = useState(true)
  const [autoSpacedRepetition, setAutoSpacedRepetition] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>⚙️</span>
          <span>Learning Preferences & Settings</span>
        </h1>
        <p className="text-xs text-slate-400">Manage your autonomous AI study assistant preferences</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center justify-between">
          <span>✅ Preferences updated successfully!</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="text-sm font-bold text-white">Daily Study Reminders</div>
              <div className="text-xs text-slate-400">Receive smart morning nudges with today's prioritized learning node</div>
            </div>
            <button
              onClick={() => setDailyReminder(!dailyReminder)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                dailyReminder ? 'bg-blue-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  dailyReminder ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="text-sm font-bold text-white">Autonomous Spaced Repetition Scheduling</div>
              <div className="text-xs text-slate-400">Allow Agentic AI to auto-schedule review sessions when forgetting curve thresholds are reached</div>
            </div>
            <button
              onClick={() => setAutoSpacedRepetition(!autoSpacedRepetition)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                autoSpacedRepetition ? 'bg-blue-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  autoSpacedRepetition ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">AI Tutor Weekly Progress Reports</div>
              <div className="text-xs text-slate-400">Weekly breakdown of mastery progress and upcoming milestones</div>
            </div>
            <button
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                emailAlerts ? 'bg-blue-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  emailAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
