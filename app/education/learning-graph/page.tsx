'use client'

import { useState, useEffect } from 'react'
import KnowledgeGraph from '@/app/components/KnowledgeGraph'
import Link from 'next/link'

export default function LearningGraphPage() {
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] })
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/learning-graph')
      .then(r => r.json())
      .then(data => {
        if (data.nodes) {
          setGraphData(data)
          setSelectedNode(data.nodes.find((n: any) => n.id === 'topic_recursion') || data.nodes[0])
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="text-xs font-mono text-blue-400 mb-1">DYNAMIC KNOWLEDGE MAP</div>
            <h1 className="text-3xl font-extrabold text-white">Brain Graph Knowledge Network</h1>
            <p className="text-sm text-slate-400 mt-1">
              Prerequisite graph showing mastery states, difficulty thresholds, and adaptive unlocks.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/education/quiz"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow transition-all"
            >
              Take Calibration Quiz
            </Link>
            <Link
              href="/education/study-plan"
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold text-xs rounded-xl transition-all"
            >
              Today's Plan
            </Link>
          </div>
        </div>

        {/* Graph + Detail Panel */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <KnowledgeGraph />
          </div>

          {/* Node Inspector */}
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4">🔍 Topic Inspector</h2>

              {selectedNode ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{selectedNode.title}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono ${
                        selectedNode.masteryScore >= 80
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : selectedNode.masteryScore >= 60
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {selectedNode.status} ({selectedNode.masteryScore}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-slate-500">Difficulty</div>
                      <div className="font-bold text-slate-200 mt-0.5">{selectedNode.difficulty}</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-slate-500">Attempts</div>
                      <div className="font-bold text-slate-200 mt-0.5">{selectedNode.attemptCount} quizzes</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <Link
                      href={`/education/ai-tutor?topic=${selectedNode.id}`}
                      className="block w-full py-2.5 text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all"
                    >
                      Ask AI Tutor about {selectedNode.title}
                    </Link>
                    <Link
                      href={`/education/quiz?topic=${selectedNode.id}`}
                      className="block w-full py-2.5 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all"
                    >
                      Practice Assessment
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400">Select a node in the graph to view details.</div>
              )}
            </div>

            {/* Legend */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2 text-xs">
              <h3 className="font-bold text-white mb-2">Graph Legend</h3>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Strong Mastery (≥ 80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-300">Developing (60% - 79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-300">Focus Needed / Weak (&lt; 60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-600" />
                <span className="text-slate-400">Locked / Not Started</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
