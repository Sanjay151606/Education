'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
  ragUsed?: boolean
  masteryLevel?: string
}

function AITutorContent() {
  const searchParams = useSearchParams()
  const initialTopic = searchParams.get('topic') || 'topic_recursion'

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello Alex! I am your Brain Graph AI Tutor. I'm actively tracking your mastery across Data Structures, Algorithms, and Technical Communication. How can I guide you today?"
    }
  ])
  const [input, setInput] = useState('')
  const [selectedTopic, setSelectedTopic] = useState(initialTopic)
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [masteryLevel, setMasteryLevel] = useState('Beginner (35%)')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/learning-graph')
      .then(r => r.json())
      .then(data => {
        if (data.nodes) setTopics(data.nodes)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input
    if (!textToSend.trim() || loading) return

    const newMsg: Message = { role: 'user', content: textToSend }
    setMessages(prev => [...prev, newMsg])
    if (!customText) setInput('')
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          topicId: selectedTopic,
          history
        })
      })

      const data = await res.json()
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.response || "I couldn't process that response right now.",
          ragUsed: data.ragContextUsed,
          masteryLevel: data.masteryLevel
        }
      ])
      if (data.masteryLevel) {
        setMasteryLevel(data.masteryLevel)
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "AI service is temporarily unavailable. Your courses and progress are safe."
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Tutor Topbar */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg">
            🤖
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Brain Graph AI Tutor
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                Active &amp; Grounded
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Personalized explanations tuned to your current mastery equations
            </p>
          </div>
        </div>

        {/* Topic Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Focus Topic:</span>
          <select
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
          >
            {topics.map(t => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.masteryScore}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Feed */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-4 overflow-y-auto">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-sm shrink-0 mt-1 shadow">
                🤖
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 shadow-xl'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-800/80 text-[11px] text-slate-400 font-mono">
                  <span>AI Tutor</span>
                  {m.masteryLevel && (
                    <span className="text-blue-400">• Level: {m.masteryLevel}</span>
                  )}
                  {m.ragUsed && (
                    <span className="text-emerald-400">• Grounded with RAG</span>
                  )}
                </div>
              )}
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-1 text-slate-300">
                AR
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-sm shrink-0 animate-pulse">
              🤖
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              Thinking and retrieving curriculum context...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Actions & Input Form */}
      <div className="border-t border-slate-800 bg-slate-900/90 p-4 max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2">
          {[
            'Explain Simpler',
            'Give Concrete Example',
            'Test Me with MCQ',
            'Show Implementation Code',
            'Summarize Key Pitfalls'
          ].map(action => (
            <button
              key={action}
              onClick={() => handleSend(action)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-white shrink-0 transition-all font-medium"
            >
              {action}
            </button>
          ))}
        </div>

        <form
          onSubmit={e => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Ask about ${selectedTopic === 'topic_recursion' ? 'Recursion' : 'your topic'} or request practice...`}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AITutorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading AI Tutor...</div>}>
      <AITutorContent />
    </Suspense>
  )
}
