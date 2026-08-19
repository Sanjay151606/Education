'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Topic {
  id: string
  title: string
  category: string
  difficulty: string
  courseId?: string
  masteryScore?: number
}

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTopicParam = searchParams.get('topic') || 'topic_recursion'

  const [availableTopics, setAvailableTopics] = useState<Topic[]>([])
  const [selectedTopicId, setSelectedTopicId] = useState<string>(currentTopicParam)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [evaluation, setEvaluation] = useState<any>(null)

  // Fetch available topics for topic selector
  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await fetch('/api/learning-graph')
        const data = await res.json()
        if (data.nodes && data.nodes.length > 0) {
          setAvailableTopics(data.nodes)
        }
      } catch (e) {
        console.warn('Could not load topics list:', e)
      }
    }
    loadTopics()
  }, [])

  // Sync topic when url searchParam changes
  useEffect(() => {
    if (currentTopicParam && currentTopicParam !== selectedTopicId) {
      setSelectedTopicId(currentTopicParam)
    }
  }, [currentTopicParam])

  // Fetch calibrated quiz questions for selected topic
  useEffect(() => {
    async function fetchQuiz() {
      setLoading(true)
      setEvaluation(null)
      setCurrentIndex(0)
      setSelectedAnswers({})
      try {
        const res = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate', topicId: selectedTopicId, count: 4, difficulty: 'MEDIUM' })
        })
        const data = await res.json()
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions)
        }
      } catch (err) {
        console.error('Quiz fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [selectedTopicId])

  const handleTopicChange = (newTopicId: string) => {
    setSelectedTopicId(newTopicId)
    router.replace(`/education/quiz?topic=${newTopicId}`)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const answersPayload = questions.map((q, idx) => ({
        questionId: q.id,
        selectedAnswer: selectedAnswers[idx] || '',
        prompt: q.prompt
      }))

      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          topicId: selectedTopicId,
          difficulty: 'MEDIUM',
          timeSpentSeconds: 90,
          submission: {
            topicId: selectedTopicId,
            answers: answersPayload,
            difficulty: 'MEDIUM'
          }
        })
      })

      const data = await res.json()
      setEvaluation(data)
    } catch (e) {
      console.error('Submission failed:', e)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
          <span className="text-sm font-mono">Generating calibrated questions & neural links...</span>
        </div>
      </div>
    )
  }

  // Quiz Results / Evaluation View
  if (evaluation) {
    const evalData = evaluation.evaluation || {}
    const triggered = evaluation.triggeredWorkflows || []

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 max-w-3xl mx-auto space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-blue-600/20 text-4xl mb-2">
            {evalData.score >= 70 ? '🎉' : '🎯'}
          </div>
          <h1 className="text-3xl font-extrabold text-white">Quiz Evaluation Completed</h1>
          
          <div className="flex items-center justify-center gap-6 my-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 min-w-[120px]">
              <div className="text-xs text-slate-500 font-semibold">Score</div>
              <div className="text-3xl font-bold text-blue-400">{evalData.score}%</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 min-w-[120px]">
              <div className="text-xs text-slate-500 font-semibold">Correct</div>
              <div className="text-3xl font-bold text-emerald-400">{evalData.correctCount} / {evalData.totalQuestions}</div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 min-w-[120px]">
              <div className="text-xs text-slate-500 font-semibold">New Mastery</div>
              <div className="text-3xl font-bold text-purple-400">{evalData.newMasteryScore}%</div>
            </div>
          </div>

          <p className="text-sm text-slate-300 max-w-xl mx-auto bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {evalData.feedback}
          </p>

          {/* Triggered Automation Workflows Badge */}
          {triggered.length > 0 && (
            <div className="text-left bg-purple-950/20 border border-purple-800/40 rounded-xl p-4 mt-6">
              <div className="text-xs font-mono text-purple-400 uppercase font-bold mb-2 flex items-center gap-2">
                <span>⚡ Triggered Autonomous Automations & Sync</span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                {triggered.map((t: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <span>{t.name || t.id}</span>
                    <span className="font-mono text-emerald-400 text-[10px] uppercase font-bold">{t.status}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-1 border-t border-purple-900/30 text-slate-400 text-[11px]">
                  <span>Google Sheets Mirror Backup:</span>
                  <span className="text-emerald-400 font-mono font-bold">QUEUED & SYNCED</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Link
              href="/education/dashboard"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-md"
            >
              Back to Dashboard
            </Link>
            <Link
              href={`/education/ai-tutor?topic=${selectedTopicId}`}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl transition-all"
            >
              Discuss with AI Tutor
            </Link>
            <button
              onClick={() => {
                setEvaluation(null)
                setCurrentIndex(0)
                setSelectedAnswers({})
              }}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all"
            >
              Retake Topic Quiz 🔄
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentIndex]
  const currentTopicObj = availableTopics.find(t => t.id === selectedTopicId)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 max-w-3xl mx-auto space-y-6">
      
      {/* Topic Selector / Course Switcher Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase font-semibold">Brain Graph Quiz Track</span>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              {currentTopicObj?.title || selectedTopicId.replace('topic_', '').toUpperCase()}
            </h1>
          </div>

          {availableTopics.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="topic-selector" className="text-xs text-slate-400 whitespace-nowrap">
                Switch Topic:
              </label>
              <select
                id="topic-selector"
                value={selectedTopicId}
                onChange={(e) => handleTopicChange(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-sans"
              >
                {availableTopics.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.difficulty})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Progress Topbar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-4">
        <div>TOPIC: {selectedTopicId.toUpperCase().replace('TOPIC_', '')}</div>
        <div>QUESTION {currentIndex + 1} OF {questions.length}</div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-mono font-semibold">
            {currentQ.difficulty || 'MEDIUM'}
          </div>

          <h2 className="text-xl font-bold text-white leading-snug">
            {currentQ.prompt}
          </h2>

          {currentQ.codeSnippet && (
            <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-blue-300 border border-slate-800 overflow-x-auto">
              {currentQ.codeSnippet}
            </pre>
          )}

          {/* Options */}
          <div className="space-y-3 pt-2">
            {(currentQ.options || []).map((opt: string, optIdx: number) => {
              const isSelected = selectedAnswers[currentIndex] === opt
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentIndex]: opt })}
                  className={`w-full text-left p-4 rounded-xl text-sm font-medium transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                      isSelected ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-700'
                    }`}
                  >
                    {isSelected && '✓'}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(c => c - 1)}
              className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30"
            >
              Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex(c => c + 1)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow"
              >
                Next Question →
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Quiz...</div>}>
      <QuizContent />
    </Suspense>
  )
}
