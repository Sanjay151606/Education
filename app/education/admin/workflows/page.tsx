'use client'

import { useState, useEffect } from 'react'

export default function AdminWorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)
  const [runs, setRuns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)
  const [activeRunLog, setActiveRunLog] = useState<any>(null)

  useEffect(() => {
    loadWorkflows()
  }, [])

  async function loadWorkflows() {
    try {
      const res = await fetch('/api/workflows')
      const data = await res.json()
      if (data.workflows) {
        setWorkflows(data.workflows)
        if (data.workflows.length > 0 && !selectedWorkflow) {
          selectWf(data.workflows[0])
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function selectWf(wf: any) {
    setSelectedWorkflow(wf)
    try {
      const res = await fetch(`/api/workflows/${wf.id}/runs`)
      const data = await res.json()
      if (data.runs) {
        setRuns(data.runs)
        if (data.runs.length > 0) setActiveRunLog(data.runs[0])
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function handleRunWorkflow() {
    if (!selectedWorkflow) return
    setExecuting(true)
    try {
      const res = await fetch(`/api/workflows/${selectedWorkflow.id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          triggerType: selectedWorkflow.trigger,
          triggerData: { score: 40, topicId: 'topic_recursion', studentId: 'student_1' }
        })
      })
      const data = await res.json()
      if (data.run) {
        setRuns(prev => [data.run, ...prev])
        setActiveRunLog(data.run)
      }
    } catch (e) {
      console.error('Execution failed:', e)
    } finally {
      setExecuting(false)
    }
  }

  const getNodeColor = (type: string) => {
    if (type.startsWith('TRIGGER')) return 'bg-amber-500/20 border-amber-500/50 text-amber-300'
    if (type.startsWith('AI')) return 'bg-purple-500/20 border-purple-500/50 text-purple-300'
    if (type.startsWith('LOGIC')) return 'bg-blue-500/20 border-blue-500/50 text-blue-300'
    if (type.startsWith('ACTION')) return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
    return 'bg-slate-800 border-slate-700 text-slate-300'
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-mono text-purple-400 mb-1">AGENTIC AUTOMATION ORCHESTRATOR</div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <span>⚡ n8n-Style Workflow Automation Engine</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visual triggers, autonomous agent loops, condition branches, and action nodes for student remediation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunWorkflow}
            disabled={executing || !selectedWorkflow}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/25 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span>{executing ? 'Executing Nodes...' : '▶ Run Test Execution'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Workflow Selector & Visual Builder */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Workflow List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Configured Workflows</h2>

          <div className="space-y-2">
            {workflows.map(wf => (
              <button
                key={wf.id}
                onClick={() => selectWf(wf)}
                className={`w-full text-left p-4 rounded-xl border transition-all text-xs ${
                  selectedWorkflow?.id === wf.id
                    ? 'bg-purple-950/30 border-purple-500 text-white shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-sm text-white mb-1">{wf.name}</div>
                <div className="text-[11px] font-mono text-purple-400 mb-2">TRIGGER: {wf.trigger}</div>
                <div className="text-slate-400 line-clamp-2">{wf.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Middle / Right: Visual Canvas & Node Graph */}
        <div className="lg:col-span-3 space-y-6">
          {selectedWorkflow && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedWorkflow.name}</h3>
                  <p className="text-xs text-slate-400">{selectedWorkflow.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-400 font-semibold">STATUS: ACTIVE</span>
                </div>
              </div>

              {/* Visual Node Flow Canvas */}
              <div>
                <div className="text-xs font-mono text-slate-400 mb-3 uppercase">Visual DAG Pipeline ({selectedWorkflow.nodes?.length} Nodes)</div>
                <div className="p-6 bg-slate-950 rounded-xl border border-slate-800/80 overflow-x-auto min-h-[220px] flex items-center gap-4">
                  {selectedWorkflow.nodes?.map((node: any, idx: number) => (
                    <div key={node.id} className="flex items-center gap-3 shrink-0">
                      <div className={`p-4 rounded-xl border min-w-[170px] shadow-lg ${getNodeColor(node.type)}`}>
                        <div className="text-[10px] font-mono uppercase opacity-75">{node.type}</div>
                        <div className="text-xs font-bold mt-1">{node.label}</div>
                      </div>
                      {idx < selectedWorkflow.nodes.length - 1 && (
                        <div className="text-slate-600 font-bold text-lg">→</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Runs Telemetry */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    ⚡ Live Execution Telemetry &amp; Logs
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {runs.length} recorded runs
                  </span>
                </div>

                {runs.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
                    No runs yet. Click "Run Test Execution" above to test this automation pipeline!
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Runs List */}
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {runs.map(r => (
                        <button
                          key={r.id}
                          onClick={() => setActiveRunLog(r)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                            activeRunLog?.id === r.id
                              ? 'bg-purple-950/40 border-purple-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono font-bold mb-1">
                            <span className={r.status === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400'}>
                              ● {r.status}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(r.startedAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-slate-300">{r.executedNodeCount} nodes executed</div>
                        </button>
                      ))}
                    </div>

                    {/* Active Run Detail Logs */}
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs max-h-64 overflow-y-auto space-y-2">
                      <div className="text-[11px] text-purple-400 font-bold border-b border-slate-800 pb-1 mb-2">
                        Execution Trace: {activeRunLog?.id}
                      </div>
                      {activeRunLog?.logs?.map((log: any, i: number) => (
                        <div key={i} className="space-y-0.5 text-[11px] pb-1.5 border-b border-slate-900">
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-400">✔ {log.nodeType}</span>
                            <span className="text-[10px] text-slate-500">{log.status}</span>
                          </div>
                          <div className="text-slate-400 truncate text-[10px]">
                            Out: {JSON.stringify(log.output)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
