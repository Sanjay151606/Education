'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import KnowledgeGraph from '@/app/components/KnowledgeGraph'
import ProgressChart from '@/app/components/ProgressChart'
import LearningPath from '@/app/components/LearningPath'
import SkillsRadar from '@/app/components/SkillsRadar'
import TaskWorkflow from '@/app/components/TaskWorkflow'

export default function DashboardPage() {
  const [userName, setUserName] = useState('Student')
  const [testResults, setTestResults] = useState<any>(null)

  useEffect(() => {
    const name = localStorage.getItem('candidateName') || 'Student'
    setUserName(name)

    const answers = localStorage.getItem('answers')
    if (answers) {
      const parsed = JSON.parse(answers)
      const sectionACount = Object.keys(parsed.sectionA || {}).length
      const sectionBCount = Object.keys(parsed.sectionB || {}).length
      const sectionCCount = Object.keys(parsed.sectionC || {}).length
      const sectionDCount = Object.keys(parsed.sectionD || {}).length
      
      setTestResults({
        sectionA: sectionACount,
        sectionB: sectionBCount,
        sectionC: sectionCCount,
        sectionD: sectionDCount,
        total: sectionACount + sectionBCount + sectionCCount + sectionDCount,
        completed: sectionACount + sectionBCount + sectionCCount + sectionDCount === 77
      })
    }
  }, [])

  const enrolledCourses = [
    { id: 1, title: 'Professional Communication', progress: 65, icon: '🗣️', nextLesson: 'Lesson 16: Active Listening' },
    { id: 2, title: 'Business English', progress: 40, icon: '💼', nextLesson: 'Lesson 12: Email Etiquette' },
    { id: 3, title: 'Public Speaking', progress: 80, icon: '🎤', nextLesson: 'Lesson 12: Q&A Handling' }
  ]

  const recentActivity = [
    { type: 'course', title: 'Completed Lesson 15', course: 'Professional Communication', time: '2 hours ago', icon: '✅' },
    { type: 'test', title: 'Assessment Completed', course: 'Communication Test', time: '1 day ago', icon: '🎯' },
    { type: 'achievement', title: 'Earned Certificate', course: 'Basic Communication', time: '3 days ago', icon: '🏆' }
  ]

  const upcomingTasks = [
    { task: 'Complete Module 4 Quiz', course: 'Professional Communication', due: 'Tomorrow', priority: 'high' },
    { task: 'Submit Assignment 3', course: 'Business English', due: 'In 3 days', priority: 'medium' },
    { task: 'Practice Session', course: 'Public Speaking', due: 'This week', priority: 'low' }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
              <p className="text-blue-100 text-lg">Continue your learning journey</p>
            </div>
            <div className="hidden md:block">
              <div className="text-6xl animate-bounce">🎓</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Knowledge Graph Visualization */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🧠 Knowledge Network</h2>
              <p className="text-gray-600 mb-6">Interactive visualization of your learning connections and progress</p>
              <KnowledgeGraph />
            </div>

            {/* Learning Path */}
            <LearningPath />

            {/* Task Workflow */}
            <TaskWorkflow />

            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl">📚</div>
                  <div className="text-3xl font-bold text-blue-600">3</div>
                </div>
                <div className="text-gray-600 font-semibold">Active Courses</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl">✅</div>
                  <div className="text-3xl font-bold text-green-600">12</div>
                </div>
                <div className="text-gray-600 font-semibold">Completed Lessons</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl">🏆</div>
                  <div className="text-3xl font-bold text-purple-600">5</div>
                </div>
                <div className="text-gray-600 font-semibold">Certificates</div>
              </div>
            </div>

            {/* Assessment Status */}
            {testResults && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Assessment Status</h2>
                {testResults.completed ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-5xl">✅</div>
                      <div>
                        <h3 className="text-xl font-bold text-green-800">Assessment Completed!</h3>
                        <p className="text-green-600">All {testResults.total} questions answered</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{testResults.sectionA}</div>
                        <div className="text-xs text-gray-600">Section A</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{testResults.sectionB}</div>
                        <div className="text-xs text-gray-600">Section B</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{testResults.sectionC}</div>
                        <div className="text-xs text-gray-600">Section C</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{testResults.sectionD}</div>
                        <div className="text-xs text-gray-600">Section D</div>
                      </div>
                    </div>
                    <Link href="/finish" className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all">
                      View Results
                    </Link>
                  </div>
                ) : testResults.total > 0 ? (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-5xl">⏳</div>
                      <div>
                        <h3 className="text-xl font-bold text-yellow-800">Assessment In Progress</h3>
                        <p className="text-yellow-600">{testResults.total} of 77 questions completed</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all"
                          style={{ width: `${(testResults.total / 77) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Link href="/test" className="block w-full text-center px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-all">
                      Continue Assessment
                    </Link>
                  </div>
                ) : (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-5xl">🎯</div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-800">Ready to Test Your Skills?</h3>
                        <p className="text-blue-600">Take our comprehensive assessment</p>
                      </div>
                    </div>
                    <Link href="/test" className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
                      Start Assessment
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Progress Chart */}
            <ProgressChart />

            {/* Skills Radar */}
            <SkillsRadar />

            {/* Enrolled Courses */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 My Courses</h2>
              <div className="space-y-4">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-4xl">{course.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.nextLesson}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{course.progress}%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
                      Continue Learning →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                    <div className="text-3xl">{activity.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{activity.title}</div>
                      <div className="text-sm text-gray-600">{activity.course}</div>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Upcoming Tasks</h2>
              <div className="space-y-3">
                {upcomingTasks.map((task, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                    task.priority === 'high' ? 'bg-red-50 border-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-green-50 border-green-500'
                  }`}>
                    <div className="font-semibold text-gray-900 mb-1">{task.task}</div>
                    <div className="text-sm text-gray-600 mb-2">{task.course}</div>
                    <div className="text-xs font-semibold text-gray-500">Due: {task.due}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">⚡ Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/education/courses" className="block w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all text-center">
                  Browse Courses
                </Link>
                <Link href="/test" className="block w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all text-center">
                  Take Assessment
                </Link>
                <Link href="/education/about" className="block w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all text-center">
                  View Certificates
                </Link>
              </div>
            </div>

            {/* Learning Streak */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🔥 Learning Streak</h2>
              <div className="text-center mb-4">
                <div className="text-6xl font-bold text-orange-500 mb-2">7</div>
                <div className="text-gray-600">Days in a row!</div>
              </div>
              <div className="flex justify-center gap-2">
                {[1,2,3,4,5,6,7].map(day => (
                  <div key={day} className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
