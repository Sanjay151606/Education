'use client'

import { useState, useEffect } from 'react'

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => {
        if (data.notifications) setNotifications(data.notifications)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>🔔</span>
            <span>Study Notifications & AI Alerts</span>
          </h1>
          <p className="text-xs text-slate-400">Personalized revision triggers, streak updates, and feedback</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
          <span className="text-4xl block mb-2">✨</span>
          <p className="font-semibold text-white">All caught up!</p>
          <p className="text-xs text-slate-400 mt-1">No pending revision or performance alerts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition-all"
            >
              <span className="text-xl">💡</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{n.title || 'Learning Recommendation'}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Just now</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{n.message || n.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
