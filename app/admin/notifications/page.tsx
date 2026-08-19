'use client'

import { useState } from 'react'

interface AlertItem {
  id: string
  title: string
  type: 'COHORT' | 'SYSTEM' | 'AI'
  timestamp: string
  message: string
}

const ALERTS: AlertItem[] = [
  {
    id: '1',
    title: 'High Failure Rate Detected on Recursion Quiz',
    type: 'COHORT',
    timestamp: '15 minutes ago',
    message: 'Cohort average dropped below 50% on stack unwinding questions. Autonomous remediation workflow dispatched to 34 students.'
  },
  {
    id: '2',
    title: 'Google Sheets Cloud Backup Sync Successful',
    type: 'SYSTEM',
    timestamp: '1 hour ago',
    message: '243 mastery records and 42 quiz attempts successfully synchronized to Google Sheet backup.'
  },
  {
    id: '3',
    title: 'Knowledge Graph Re-indexing Completed',
    type: 'AI',
    timestamp: '2 hours ago',
    message: 'Concept node weights dynamically updated for 986 active students.'
  }
]

export default function AdminNotificationsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>(ALERTS)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🔔</span>
              <span>System & Cohort Alerts</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Automated anomalies, recovery triggers, and audit logs</p>
          </div>
          <button
            onClick={() => alert('Broadcasting system announcement to all students')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            + Broadcast Announcement
          </button>
        </div>

        {/* Alert Cards */}
        <div className="space-y-4">
          {alerts.map(a => (
            <div
              key={a.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-800/50 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {a.type}
                </span>
                <span className="text-xs text-slate-500 font-mono">{a.timestamp}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{a.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{a.message}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
