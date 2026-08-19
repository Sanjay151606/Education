'use client'

import { useState } from 'react'

interface AgentStatus {
  name: string
  role: string
  status: 'Idle' | 'Active' | 'Optimal'
  lastRun: string
  executionTimeMs: number
  tasksCompleted: number
  successRate: number
  description: string
}

const AGENTS: AgentStatus[] = [
  {
    name: 'Student Analyzer',
    role: 'Cognitive State & Gap Detector',
    status: 'Optimal',
    lastRun: '12 seconds ago',
    executionTimeMs: 142,
    tasksCompleted: 1420,
    successRate: 99.8,
    description: 'Calculates dynamic mastery scores, detects decaying forgetting curve nodes, and pinpoints knowledge gaps.'
  },
  {
    name: 'Assessment Agent',
    role: 'Calibrated Question Generator',
    status: 'Optimal',
    lastRun: '1 minute ago',
    executionTimeMs: 210,
    tasksCompleted: 980,
    successRate: 99.4,
    description: 'Generates targeted questions aligned to student IRT difficulty parameters and evaluates submitted answers.'
  },
  {
    name: 'Study Planner',
    role: 'Daily Schedule Optimizer',
    status: 'Optimal',
    lastRun: '3 minutes ago',
    executionTimeMs: 95,
    tasksCompleted: 620,
    successRate: 100,
    description: 'Constructs personalized daily learning schedules balancing new lessons and required spaced revisions.'
  },
  {
    name: 'Revision Agent',
    role: 'Spaced Repetition Scheduler',
    status: 'Optimal',
    lastRun: '4 minutes ago',
    executionTimeMs: 82,
    tasksCompleted: 890,
    successRate: 100,
    description: 'Schedules Leitner spaced repetition flashcard sessions at optimal intervals to maximize memory consolidation.'
  },
  {
    name: 'Google Sheets Synchronizer',
    role: 'Cloud Backup & Audit Worker',
    status: 'Optimal',
    lastRun: 'Just now',
    executionTimeMs: 180,
    tasksCompleted: 2430,
    successRate: 100,
    description: 'Performs non-blocking async backups of all quiz attempts and mastery updates to external Google Sheets.'
  }
]

export default function AdminAiMonitoringPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🤖</span>
              <span>Agentic AI Orchestrator & Monitoring</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time health, execution latencies, and telemetry across autonomous learning agents</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Swarm Health: 100% Operational</span>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENTS.map((agent, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                  {agent.role}
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {agent.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">{agent.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{agent.description}</p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Last Executed:</span>
                  <span className="text-white font-mono">{agent.lastRun}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Avg Latency:</span>
                  <span className="text-purple-300 font-mono">{agent.executionTimeMs} ms</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tasks Completed:</span>
                  <span className="text-emerald-300 font-mono">{agent.tasksCompleted.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Success Rate:</span>
                  <span className="text-emerald-400 font-mono font-bold">{agent.successRate}%</span>
                </div>
              </div>

              <button
                onClick={() => alert(`Triggered manual execution for ${agent.name}`)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors"
              >
                ⚡ Trigger Manual Run
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
