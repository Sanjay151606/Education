'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function SaaSながらLandingPage() {
  const [activeTab, setActiveTab] = useState<'loop' | 'tutor' | 'graph' | 'workflow'>('loop')
  const [typedMessage, setTypedMessage] = useState('')

  const fullPrompt = "Explain why my recursive quicksort hits recursion depth limit on sorted arrays."
  
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullPrompt.length) {
        setTypedMessage(fullPrompt.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 40)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/30 to-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          Autonomous Agentic AI Educational Platform
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Learn Smarter. Think Deeper.{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Grow Continuously.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
          Brain Graph doesn't just answer questions. It continuously observes your mastery, detects knowledge gaps in real-time, designs custom recovery plans, generates adaptive quizzes, and updates your personal knowledge graph autonomously.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/student/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>🎓 Student Dashboard</span>
            <span>→</span>
          </Link>
          <Link
            href="/student/ai-tutor"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2"
          >
            <span>🤖 AI Tutor</span>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Gemini 2.5</span>
          </Link>
          <Link
            href="/admin/dashboard"
            className="w-full sm:w-auto px-6 py-4 rounded-xl border border-purple-500/30 bg-purple-950/30 hover:bg-purple-900/40 text-purple-300 font-semibold text-base transition-all flex items-center justify-center gap-2"
          >
            <span>⚡ Admin Workspace</span>
          </Link>
        </div>

        {/* Live Interactive Agent OS Preview Card */}
        <div className="relative rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 shadow-2xl max-w-5xl mx-auto text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">brain-graph-os v2.0 • agentic-runtime</span>
            </div>
            {/* Interactive Tabs */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('loop')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'loop' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Agent Loop
              </button>
              <button
                onClick={() => setActiveTab('tutor')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'tutor' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AI Tutor RAG
              </button>
              <button
                onClick={() => setActiveTab('graph')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'graph' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Knowledge Graph
              </button>
              <button
                onClick={() => setActiveTab('workflow')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'workflow' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                n8n Automation
              </button>
            </div>
          </div>

          {/* Tab 1: Continuous Feedback Loop */}
          {activeTab === 'loop' && (
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-blue-400 mb-1">01 • OBSERVE</div>
                <div className="text-sm font-bold text-white mb-2">Quiz Performance</div>
                <div className="text-xs text-slate-400">Score 40% on Recursion Mini-Assessment. Repeated mistakes on recursive stack frames.</div>
                <div className="mt-3 text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded inline-block font-mono">Mastery: 35% (Weak)</div>
              </div>
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-purple-400 mb-1">02 • REASON & PLAN</div>
                <div className="text-sm font-bold text-white mb-2">Gap Diagnosis</div>
                <div className="text-xs text-slate-400">Prerequisites (Stack, Arrays) strong (90%), but base-case induction missing. Auto-selecting recovery tools.</div>
                <div className="mt-3 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded inline-block font-mono">Tool: learningPlanner</div>
              </div>
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-emerald-400 mb-1">03 • EXECUTE ACTION</div>
                <div className="text-sm font-bold text-white mb-2">Autonomous Delivery</div>
                <div className="text-xs text-slate-400">Generated 3-question targeted practice quiz, scheduled next-day spaced revision, pushed priority alert.</div>
                <div className="mt-3 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded inline-block font-mono">Status: Dispatched</div>
              </div>
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-amber-400 mb-1">04 • ADAPT GRAPH</div>
                <div className="text-sm font-bold text-white mb-2">Graph Mutation</div>
                <div className="text-xs text-slate-400">Recursion node tagged for active review; dynamic tree node locked until 70% threshold reached.</div>
                <div className="mt-3 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-1 rounded inline-block font-mono">Graph: Updated</div>
              </div>
            </div>
          )}

          {/* Tab 2: AI Tutor Preview */}
          {activeTab === 'tutor' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs shrink-0">AR</div>
                <div className="flex-1">
                  <div className="text-xs text-slate-400 font-mono mb-1">Alex Rivera (Mastery: 35%)</div>
                  <div className="text-sm text-slate-200">{typedMessage}</div>
                </div>
              </div>
              <div className="bg-blue-950/20 p-4 rounded-xl border border-blue-800/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-sm shrink-0">🤖</div>
                <div className="flex-1 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Brain Graph AI Tutor</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono">Grounded by RAG Doc #12</span>
                  </div>
                  <p>
                    When QuickSort partitions an already-sorted array using the last element as pivot, it generates an unbalanced recursive tree of depth <b>O(N)</b> rather than <b>O(log N)</b>. Each call consumes a stack frame until it overflows the call stack.
                  </p>
                  <div className="p-2.5 bg-slate-950 rounded-lg font-mono text-[11px] text-amber-300 border border-slate-800">
                    💡 Suggested Fix: Use randomized pivot selection or 3-way median partitioning to guarantee O(N log N).
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button className="px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded text-[11px] font-medium border border-blue-500/30">Explain Simpler</button>
                    <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-medium">Generate 3 Practice Questions</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Knowledge Graph Preview */}
          {activeTab === 'graph' && (
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
              <div className="flex items-center justify-around flex-wrap gap-4 py-6">
                <div className="p-3 bg-green-500/20 border border-green-500/40 rounded-xl text-xs font-semibold text-green-300">
                  <div>Arrays & Memory</div>
                  <div className="text-[10px] font-mono opacity-80">90% • Strong</div>
                </div>
                <div className="text-slate-600 font-bold text-lg">→</div>
                <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs font-semibold text-red-300 animate-pulse">
                  <div>Recursion & Stacks</div>
                  <div className="text-[10px] font-mono opacity-80">35% • Focus Topic</div>
                </div>
                <div className="text-slate-600 font-bold text-lg">→</div>
                <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl text-xs font-semibold text-slate-400">
                  <div>Binary Trees & BSTs</div>
                  <div className="text-[10px] font-mono opacity-80">Locked • Req. 70%</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Real-time dependency graph that activates, unlocks, and prioritizes concepts based on composite mastery equations.
              </p>
            </div>
          )}

          {/* Tab 4: Workflow Engine Preview */}
          {activeTab === 'workflow' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-2 text-slate-400 mb-3">
                <span className="text-purple-400">⚡ Live Trigger:</span>
                <span>QUIZ_COMPLETED (topic: recursion, score: 40%)</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="text-green-400">✔ [0.02s] Node 1: Trigger Received (Score &lt; 50%)</div>
                <div className="text-green-400">✔ [0.11s] Node 2: Assessment Agent Diagnosed Weak Sub-Concept (Base Cases)</div>
                <div className="text-green-400">✔ [0.24s] Node 3: Update Mastery Score (35%) in Knowledge Store</div>
                <div className="text-green-400">✔ [0.38s] Node 4: Generated 3 Tailored Practice Questions</div>
                <div className="text-green-400">✔ [0.45s] Node 5: Dispatched Notification &amp; Scheduled Revision for Tomorrow</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Autonomous Education Engine
          </h2>
          <p className="text-slate-400">
            A comprehensive suite of five specialized AI agents operating continuously on your learning trajectory.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-blue-500/40 transition-all">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Student Analyzer Agent</h3>
            <p className="text-sm text-slate-400">
              Evaluates multi-signal mastery (recent scores, retention latency, consistency, difficulty tier) to pinpoint exact conceptual blockers.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-purple-500/40 transition-all">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-white mb-2">AI Tutor with RAG</h3>
            <p className="text-sm text-slate-400">
              Adapts tone and depth dynamically from Beginner to Advanced while grounding answers in uploaded documents and verified curriculums.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-emerald-500/40 transition-all">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">n8n-Style Automations</h3>
            <p className="text-sm text-slate-400">
              Visual workflow automation with triggers, AI reasoning nodes, logic branches, and actions to autonomously nurture student retention.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-amber-500/40 transition-all">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">Assessment Agent</h3>
            <p className="text-sm text-slate-400">
              Generates calibrated MCQs, code challenges, and conceptual tests that adjust difficulty in real-time as your mastery ascends.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-pink-500/40 transition-all">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-white mb-2">Knowledge Graph OS</h3>
            <p className="text-sm text-slate-400">
              Interactive visual network mapping prerequisites, active mastery scores, revision schedules, and progressive concept unlocking.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-cyan-500/40 transition-all">
            <div className="text-3xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-white mb-2">Study Coach &amp; Planner</h3>
            <p className="text-sm text-slate-400">
              Synthesizes daily focused study blocks, monitors streak consistency, and enforces spaced repetition intervals automatically.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center border-t border-slate-900">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Ready to Experience Agentic Learning?
        </h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Start your personalized path, test your skills, and let Brain Graph optimize every minute of your study time.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/student/dashboard"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            Launch Student Space
          </Link>
          <Link
            href="/admin/dashboard"
            className="px-8 py-4 bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-800/60 font-bold rounded-xl transition-all"
          >
            Admin Workspace
          </Link>
        </div>
      </section>
    </div>
  )
}
