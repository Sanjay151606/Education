'use client'

import { useState } from 'react'

interface QuestionItem {
  id: string
  topic: string
  prompt: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  optionsCount: number
  correctAnswer: string
  accuracyRate: number
}

const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: 'q_1',
    topic: 'Recursion',
    prompt: 'What happens if a recursive function does not have a valid base case?',
    difficulty: 'EASY',
    optionsCount: 4,
    correctAnswer: 'Stack Overflow Exception',
    accuracyRate: 74
  },
  {
    id: 'q_2',
    topic: 'Recursion',
    prompt: 'What is the time complexity of the naive recursive Fibonacci implementation?',
    difficulty: 'MEDIUM',
    optionsCount: 4,
    correctAnswer: 'O(2^n)',
    accuracyRate: 58
  },
  {
    id: 'q_3',
    topic: 'Binary Search',
    prompt: 'What is the precondition required before applying binary search on an array?',
    difficulty: 'EASY',
    optionsCount: 4,
    correctAnswer: 'Array must be sorted',
    accuracyRate: 92
  },
  {
    id: 'q_4',
    topic: 'Graph Theory',
    prompt: 'Which data structure is typically used for Breadth-First Search (BFS)?',
    difficulty: 'MEDIUM',
    optionsCount: 4,
    correctAnswer: 'FIFO Queue',
    accuracyRate: 83
  }
]

export default function AdminQuizzesPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS)
  const [selectedTopic, setSelectedTopic] = useState('All')

  const filtered = questions.filter(q => selectedTopic === 'All' || q.topic === selectedTopic)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>📝</span>
              <span>Assessment & Quiz Bank Management</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Author adaptive questions, configure scoring rubrics, and inspect item response accuracy</p>
          </div>
          <button
            onClick={() => alert('New Question Modal')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Add Question</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {['All', 'Recursion', 'Binary Search', 'Graph Theory'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTopic === t ? 'bg-purple-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Questions Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-4">Topic</th>
                  <th className="p-4">Prompt</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4">Correct Answer</th>
                  <th className="p-4">Accuracy</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(q => (
                  <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-purple-300">{q.topic}</td>
                    <td className="p-4 text-white font-medium max-w-md">{q.prompt}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300">
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="p-4 text-emerald-400 font-mono">{q.correctAnswer}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-200">{q.accuracyRate}%</div>
                      <div className="w-16 bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${q.accuracyRate}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => alert(`Edit question ${q.id}`)}
                        className="text-xs text-purple-400 hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setQuestions(questions.filter(x => x.id !== q.id))}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
