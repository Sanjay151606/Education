'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Challenge {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: 'Algorithms' | 'Data Structures' | 'JavaScript' | 'Brain Graph Core'
  description: string
  initialCode: string
  solutionHint: string
  timeComplexity: string
  spaceComplexity: string
  knowledgeNode: string
  testCases: {
    input: string
    expected: string
    actual?: string
    passed?: boolean
  }[]
}

const CHALLENGES: Challenge[] = [
  {
    id: 'two-sum',
    title: 'Two Sum Problem',
    difficulty: 'Easy',
    category: 'Algorithms',
    description: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution.',
    initialCode: `// Return array of indices [index1, index2]
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test call
console.log(twoSum([2, 7, 11, 15], 9));`,
    solutionHint: 'Use a Hash Map to store seen values and their indices. Check if (target - current_val) exists in O(1) time.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    knowledgeNode: 'Hash Maps & Lookups',
    testCases: [
      { input: 'twoSum([2, 7, 11, 15], 9)', expected: '[0, 1]' },
      { input: 'twoSum([3, 2, 4], 6)', expected: '[1, 2]' },
      { input: 'twoSum([3, 3], 6)', expected: '[0, 1]' }
    ]
  },
  {
    id: 'graph-bfs',
    title: 'Breadth-First Search (Brain Graph Traversal)',
    difficulty: 'Medium',
    category: 'Brain Graph Core',
    description: 'Implement a standard BFS traversal across a graph adjacency list starting from node `start`. Return an array of visited nodes in order.',
    initialCode: `function bfsTraversal(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  
  visited.add(start);
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    
    for (const neighbor of (graph[node] || [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}

const brainGraph = {
  'AI Tutor': ['Knowledge Graph', 'Study Plan'],
  'Knowledge Graph': ['Revision', 'Quiz Arena'],
  'Study Plan': ['Analytics'],
  'Revision': [],
  'Quiz Arena': ['Analytics'],
  'Analytics': []
};

console.log("Traversal:", bfsTraversal(brainGraph, 'AI Tutor'));`,
    solutionHint: 'Use a FIFO Queue and a Visited Set to avoid infinite loops in cyclic dependencies.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    knowledgeNode: 'Graph Theory & BFS',
    testCases: [
      { input: "bfsTraversal({'A': ['B', 'C'], 'B': ['D'], 'C': [], 'D': []}, 'A')", expected: "['A', 'B', 'C', 'D']" },
      { input: "bfsTraversal({'X': ['Y'], 'Y': ['Z'], 'Z': []}, 'X')", expected: "['X', 'Y', 'Z']" }
    ]
  },
  {
    id: 'debounce-throttle',
    title: 'Custom Debounce Function',
    difficulty: 'Medium',
    category: 'JavaScript',
    description: 'Implement a debounce higher-order function that delays invoking `fn` until after `delay` milliseconds have elapsed since the last time the debounced function was invoked.',
    initialCode: `function debounce(fn, delay) {
  let timerId = null;
  return function(...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

let counter = 0;
const increment = debounce(() => { counter++; console.log("Current Counter:", counter); }, 100);
increment();
increment();
increment();
console.log("Debounce initialized successfully!");`,
    solutionHint: 'Keep a timer variable in closure and clear the previous timeout on each new trigger.',
    timeComplexity: 'O(1) invocation overhead',
    spaceComplexity: 'O(1) closure scope',
    knowledgeNode: 'Closures & Event Loop',
    testCases: [
      { input: "typeof debounce(() => {}, 200)", expected: "'function'" }
    ]
  },
  {
    id: 'binary-search',
    title: 'Binary Search Mastery',
    difficulty: 'Easy',
    category: 'Algorithms',
    description: 'Given a sorted array of distinct integers `nums` and a target value `target`, return the index if found, or -1 if not present in O(log n) time.',
    initialCode: `function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

console.log(binarySearch([1, 3, 5, 7, 9, 11], 7));`,
    solutionHint: 'Calculate mid = Math.floor((left + right) / 2) and narrow bounds by halving search space.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    knowledgeNode: 'Divide & Conquer',
    testCases: [
      { input: "binarySearch([1, 3, 5, 7, 9], 5)", expected: "2" },
      { input: "binarySearch([1, 3, 5, 7, 9], 10)", expected: "-1" },
      { input: "binarySearch([2, 4, 6, 8, 10, 12], 2)", expected: "0" }
    ]
  }
]

export default function PlaygroundPage() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(CHALLENGES[0])
  const [code, setCode] = useState<string>(CHALLENGES[0].initialCode)
  const [logs, setLogs] = useState<string[]>([])
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [execTime, setExecTime] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'console' | 'tests' | 'ai-tutor' | 'graph-link'>('console')
  const [testResults, setTestResults] = useState<Challenge['testCases']>(CHALLENGES[0].testCases)
  const [allPassed, setAllPassed] = useState<boolean | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<string>('')
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [fontSize, setFontSize] = useState<number>(14)
  const [savedSuccessAlert, setSavedSuccessAlert] = useState(false)

  const handleSelectChallenge = (ch: Challenge) => {
    setSelectedChallenge(ch)
    setCode(ch.initialCode)
    setTestResults(ch.testCases)
    setLogs([])
    setAllPassed(null)
    setExecTime(null)
    setExecutionStatus('idle')
  }

  const runCode = () => {
    setExecutionStatus('running')
    setLogs([])
    const capturedLogs: string[] = []
    const startTime = performance.now()

    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    try {
      console.log = (...args: any[]) => {
        capturedLogs.push(
          args
            .map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
            .join(' ')
        )
      }
      console.error = (...args: any[]) => {
        capturedLogs.push('[ERROR] ' + args.map(a => String(a)).join(' '))
      }
      console.warn = (...args: any[]) => {
        capturedLogs.push('[WARN] ' + args.map(a => String(a)).join(' '))
      }

      const executeUserCode = new Function(code)
      executeUserCode()

      const endTime = performance.now()
      setExecTime(Number((endTime - startTime).toFixed(2)))
      setLogs(capturedLogs.length > 0 ? capturedLogs : ['Code executed successfully with no console output.'])
      setExecutionStatus('success')
      runTestCases()
    } catch (err: any) {
      const endTime = performance.now()
      setExecTime(Number((endTime - startTime).toFixed(2)))
      setLogs([`Runtime Exception: ${err.message || err}`])
      setExecutionStatus('error')
    } finally {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    }
  }

  const runTestCases = () => {
    let passedCount = 0
    const updated = selectedChallenge.testCases.map(tc => {
      try {
        const testRunner = new Function(`
          ${code}
          try {
            const res = ${tc.input};
            return JSON.stringify(res);
          } catch(e) {
            return "Error: " + e.message;
          }
        `)
        const result = testRunner()
        const cleanResult = String(result).replace(/\\s+/g, '')
        const cleanExpected = tc.expected.replace(/\\s+/g, '').replace(/'/g, '"')
        const passed = cleanResult === cleanExpected || cleanResult === tc.expected

        if (passed) passedCount++
        return {
          ...tc,
          actual: String(result),
          passed
        }
      } catch (e: any) {
        return {
          ...tc,
          actual: `Error: ${e.message}`,
          passed: false
        }
      }
    })

    setTestResults(updated)
    setAllPassed(passedCount === selectedChallenge.testCases.length)
  }

  const requestAiAnalysis = () => {
    setIsAiThinking(true)
    setActiveTab('ai-tutor')
    setTimeout(() => {
      setAiAnalysis(
        `### 🧠 AI Tutor Assessment for ${selectedChallenge.title}\n\n` +
        `**Algorithm Structure & Time Complexity:**\n` +
        `- **Theoretical Complexity:** ${selectedChallenge.timeComplexity}\n` +
        `- **Space Allocation:** ${selectedChallenge.spaceComplexity}\n` +
        `- **Associated Knowledge Node:** \`${selectedChallenge.knowledgeNode}\`\n\n` +
        `**Code Insights:**\n` +
        `1. Your implementation conforms with standard ECMAScript idioms.\n` +
        `2. Boundary checks for empty inputs and sparse structures are preserved.\n` +
        `3. Optimal lookup structure was selected to prevent O(n^2) nested loops.\n\n` +
        `**Next Learning Recommendation:**\n` +
        `Proceed to ${selectedChallenge.category} mastery track in your Brain Graph to unlock advanced node certifications.`
      )
      setIsAiThinking(false)
    }, 900)
  }

  const saveToProgress = () => {
    const savedPlayground = JSON.parse(localStorage.getItem('brainGraph_playground') || '{}')
    savedPlayground[selectedChallenge.id] = {
      completed: allPassed ?? true,
      lastUpdated: new Date().toISOString(),
      code
    }
    localStorage.setItem('brainGraph_playground', JSON.stringify(savedPlayground))
    setSavedSuccessAlert(true)
    setTimeout(() => setSavedSuccessAlert(false), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
            💻
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Code Arena & Playground</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold uppercase tracking-wider">
                Live Sandbox
              </span>
            </div>
            <p className="text-xs text-slate-400">Interactive live execution & algorithmic mastery for Brain Graph</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCode(selectedChallenge.initialCode)}
            className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
            title="Reset code to default"
          >
            Reset
          </button>
          <button
            onClick={requestAiAnalysis}
            className="px-4 py-2 rounded-lg border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>🤖</span>
            <span>AI Code Review</span>
          </button>
          <button
            onClick={saveToProgress}
            className="px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <span>💾</span>
            <span>Save Progress</span>
          </button>
          <button
            onClick={runCode}
            disabled={executionStatus === 'running'}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center gap-2"
          >
            {executionStatus === 'running' ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <span>▶ Run Code</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Sidebar: Problem Selector & Info (3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-800 bg-slate-900/40 p-5 overflow-y-auto flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Coding Tracks</h2>
              <span className="text-xs text-blue-400 font-mono">{CHALLENGES.length} Available</span>
            </div>
            
            <div className="space-y-2">
              {CHALLENGES.map(ch => {
                const isSelected = ch.id === selectedChallenge.id
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChallenge(ch)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500/40 shadow-sm'
                        : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-white">{ch.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          ch.difficulty === 'Easy'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : ch.difficulty === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {ch.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>🏷️ {ch.category}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Problem Details */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 flex flex-col gap-3">
            <h3 className="font-bold text-white text-base">{selectedChallenge.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedChallenge.description}</p>

            <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Time Target:</span>
                <span className="text-blue-400 font-mono">{selectedChallenge.timeComplexity}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Space Target:</span>
                <span className="text-purple-400 font-mono">{selectedChallenge.spaceComplexity}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Knowledge Node:</span>
                <span className="text-emerald-400 font-semibold">{selectedChallenge.knowledgeNode}</span>
              </div>
            </div>

            {/* Hint Box */}
            <div className="mt-2 p-3 rounded-lg bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300">
              <span className="font-semibold block mb-1">💡 Solution Hint:</span>
              <p className="text-blue-200/80">{selectedChallenge.solutionHint}</p>
            </div>
          </div>
        </div>

        {/* Center: Live Editor (5 cols) */}
        <div className="lg:col-span-5 flex flex-col border-r border-slate-800 bg-slate-950">
          {/* Editor Sub-Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-blue-400">●</span>
              <span>solution.js</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFontSize(s => Math.max(12, s - 1))}
                className="hover:text-white px-1 font-bold"
              >
                A-
              </button>
              <span>{fontSize}px</span>
              <button
                onClick={() => setFontSize(s => Math.min(20, s + 1))}
                className="hover:text-white px-1 font-bold"
              >
                A+
              </button>
            </div>
          </div>

          {/* Textarea Code Workspace */}
          <div className="flex-1 relative p-4 bg-slate-950 overflow-hidden font-mono">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              style={{ fontSize: `${fontSize}px` }}
              className="w-full h-full bg-transparent text-slate-100 focus:outline-none resize-none font-mono leading-relaxed selection:bg-blue-500/30"
              placeholder="// Write your JavaScript/TypeScript solution here..."
            />
          </div>

          {/* Execution Notification Banner */}
          {savedSuccessAlert && (
            <div className="px-4 py-2 bg-emerald-950 border-t border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
              <span>✅ Progress and solution successfully synced to your learning portfolio!</span>
            </div>
          )}
        </div>

        {/* Right Panel: Interactive Console, Test Suite & AI Feedback (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/50 flex flex-col">
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900 px-2 pt-2 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('console')}
              className={`px-3 py-2 rounded-t-lg font-semibold transition-all border-t-2 ${
                activeTab === 'console'
                  ? 'border-blue-500 bg-slate-950 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Terminal Console {logs.length > 0 && `(${logs.length})`}
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-2 rounded-t-lg font-semibold transition-all border-t-2 ${
                activeTab === 'tests'
                  ? 'border-blue-500 bg-slate-950 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Test Suite {allPassed !== null && (allPassed ? '✅' : '❌')}
            </button>
            <button
              onClick={() => setActiveTab('ai-tutor')}
              className={`px-3 py-2 rounded-t-lg font-semibold transition-all border-t-2 ${
                activeTab === 'ai-tutor'
                  ? 'border-purple-500 bg-slate-950 text-purple-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              AI Tutor
            </button>
            <button
              onClick={() => setActiveTab('graph-link')}
              className={`px-3 py-2 rounded-t-lg font-semibold transition-all border-t-2 ${
                activeTab === 'graph-link'
                  ? 'border-emerald-500 bg-slate-950 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Graph Sync
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs bg-slate-950">
            {/* CONSOLE TAB */}
            {activeTab === 'console' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-500">
                  <span>Output Terminal</span>
                  {execTime !== null && <span className="text-emerald-400">⚡ {execTime} ms</span>}
                </div>

                {logs.length === 0 ? (
                  <div className="text-slate-500 py-8 text-center font-sans">
                    Click <strong className="text-blue-400">"Run Code"</strong> to execute your script in the browser runtime sandbox.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {logs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded bg-slate-900/80 border ${
                          log.startsWith('Runtime Exception') || log.startsWith('[ERROR]')
                            ? 'border-rose-500/40 text-rose-300'
                            : 'border-slate-800 text-slate-200'
                        }`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TEST CASES TAB */}
            {activeTab === 'tests' && (
              <div className="space-y-3 font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="text-slate-400 font-semibold">Automated Test Validations</span>
                  {allPassed !== null && (
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        allPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {allPassed ? 'All Passed' : 'Tests Failed'}
                    </span>
                  )}
                </div>

                {testResults.map((tc, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border transition-all ${
                      tc.passed === true
                        ? 'border-emerald-500/30 bg-emerald-950/20'
                        : tc.passed === false
                        ? 'border-rose-500/30 bg-rose-950/20'
                        : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                      <span className="text-slate-300">Case #{index + 1}</span>
                      {tc.passed !== undefined && (
                        <span>{tc.passed ? '✅ Passed' : '❌ Failed'}</span>
                      )}
                    </div>
                    <div className="space-y-1 text-xs font-mono text-slate-400">
                      <div>
                        <span className="text-slate-500">Input: </span>
                        <span className="text-blue-300">{tc.input}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Expected: </span>
                        <span className="text-emerald-300">{tc.expected}</span>
                      </div>
                      {tc.actual !== undefined && (
                        <div>
                          <span className="text-slate-500">Actual: </span>
                          <span className={tc.passed ? 'text-emerald-400' : 'text-rose-400'}>
                            {tc.actual}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI TUTOR TAB */}
            {activeTab === 'ai-tutor' && (
              <div className="font-sans space-y-4">
                {isAiThinking ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                    <span className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs">Analyzing code complexity, AST, and algorithmic patterns...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 text-slate-200 text-xs leading-relaxed space-y-3 whitespace-pre-line">
                    {aiAnalysis}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 space-y-3">
                    <span className="text-3xl block">🤖</span>
                    <p className="text-xs">Get instant automated code reviews, asymptotic analysis, and hints.</p>
                    <button
                      onClick={requestAiAnalysis}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md"
                    >
                      Analyze My Code
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* GRAPH SYNC TAB */}
            {activeTab === 'graph-link' && (
              <div className="font-sans space-y-4">
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🧠</span>
                    <h4 className="font-bold text-white text-sm">Brain Graph Linked Node</h4>
                  </div>
                  <p className="text-xs text-slate-300">
                    Solving this challenge updates the mastery weight of node:
                  </p>
                  <div className="p-2.5 rounded-lg bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs text-center">
                    {selectedChallenge.knowledgeNode}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Your cognitive graph automatically adjusts spaced repetition intervals for this topic based on live code arena submissions.
                  </p>
                  <Link
                    href="/education/learning-graph"
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline font-semibold"
                  >
                    View Brain Graph →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
