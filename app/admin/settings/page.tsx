'use client'

import { useState } from 'react'

export default function AdminSettingsPage() {
  const [autoSync, setAutoSync] = useState(true)
  const [aiAutoRemediation, setAiAutoRemediation] = useState(true)
  const [retentionDays, setRetentionDays] = useState(90)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>⚙️</span>
            <span>Platform Administration & Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Configure system-wide automations, database connections, and security policies</p>
        </div>

        {saved && (
          <div className="p-3.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center justify-between">
            <span>✅ Platform settings updated successfully!</span>
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="text-sm font-bold text-white">Google Sheets Real-Time Backup</div>
                <div className="text-xs text-slate-400">Trigger asynchronous Google Sheet cloud audit backup on every quiz submission and mastery update</div>
              </div>
              <button
                onClick={() => setAutoSync(!autoSync)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  autoSync ? 'bg-purple-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    autoSync ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="text-sm font-bold text-white">Autonomous AI Remediation Dispatch</div>
                <div className="text-xs text-slate-400">Allow Agentic AI to auto-dispatch tailored revision flashcards when student score drops below 60%</div>
              </div>
              <button
                onClick={() => setAiAutoRemediation(!aiAutoRemediation)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  aiAutoRemediation ? 'bg-purple-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    aiAutoRemediation ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Audit Log Retention Policy</div>
                <div className="text-xs text-slate-400">Number of days to preserve raw webhook payload traces and agent executions</div>
              </div>
              <select
                value={retentionDays}
                onChange={e => setRetentionDays(Number(e.target.value))}
                className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
              >
                <option value={30}>30 Days</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days</option>
                <option value={365}>1 Year</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Save Admin Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
