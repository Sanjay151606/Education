'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')

  const categories = [
    { id: 'all', name: 'All Courses', icon: '📚' },
    { id: 'communication', name: 'Communication', icon: '🗣️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'technical', name: 'Technical', icon: '💻' },
    { id: 'language', name: 'Language', icon: '🌍' }
  ]

  const courses = [
    {
      id: 1,
      title: 'Professional Communication Skills',
      category: 'communication',
      level: 'Beginner',
      duration: '8 weeks',
      lessons: 24,
      students: 2500,
      rating: 4.8,
      icon: '🗣️',
      description: 'Master essential communication skills for professional success',
      features: ['Speaking', 'Listening', 'Writing', 'Presentation']
    },
    {
      id: 2,
      title: 'Business English Mastery',
      category: 'business',
      level: 'Intermediate',
      duration: '10 weeks',
      lessons: 30,
      students: 1800,
      rating: 4.9,
      icon: '💼',
      description: 'Advanced business communication and professional English',
      features: ['Email Writing', 'Meetings', 'Negotiations', 'Reports']
    },
    {
      id: 3,
      title: 'Technical Writing Excellence',
      category: 'technical',
      level: 'Advanced',
      duration: '6 weeks',
      lessons: 18,
      students: 1200,
      rating: 4.7,
      icon: '✍️',
      description: 'Create clear, concise technical documentation',
      features: ['Documentation', 'API Docs', 'User Guides', 'Best Practices']
    },
    {
      id: 4,
      title: 'Public Speaking & Presentation',
      category: 'communication',
      level: 'Intermediate',
      duration: '5 weeks',
      lessons: 15,
      students: 2100,
      rating: 4.9,
      icon: '🎤',
      description: 'Deliver confident and engaging presentations',
      features: ['Body Language', 'Voice Control', 'Storytelling', 'Q&A Handling']
    },
    {
      id: 5,
      title: 'Cross-Cultural Communication',
      category: 'language',
      level: 'Intermediate',
      duration: '7 weeks',
      lessons: 21,
      students: 1500,
      rating: 4.6,
      icon: '🌍',
      description: 'Navigate global business communication effectively',
      features: ['Cultural Awareness', 'Global Etiquette', 'Virtual Teams', 'Diversity']
    },
    {
      id: 6,
      title: 'Leadership Communication',
      category: 'business',
      level: 'Advanced',
      duration: '8 weeks',
      lessons: 24,
      students: 980,
      rating: 4.8,
      icon: '👔',
      description: 'Lead teams with powerful communication strategies',
      features: ['Team Management', 'Conflict Resolution', 'Motivation', 'Feedback']
    }
  ]

  const filteredCourses = courses.filter(course => {
    const categoryMatch = selectedCategory === 'all' || course.category === selectedCategory
    const levelMatch = selectedLevel === 'all' || course.level === selectedLevel
    return categoryMatch && levelMatch
  })

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Explore Our Courses</h1>
          <p className="text-xl text-gray-600">Choose from our comprehensive course catalog</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Level</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedLevel === level
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level === 'all' ? 'All Levels' : level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-bold text-blue-600">{filteredCourses.length}</span> courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105">
              {/* Course Header */}
              <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative">
                <div className="text-7xl">{course.icon}</div>
                <div className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold shadow-lg">
                  FREE
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                    course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {course.level}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span>⭐</span>
                    <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📚</span>
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>{course.students}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
                  Enroll Now - Free
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Assessment CTA */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-12 text-center text-white shadow-2xl">
          <div className="inline-block p-4 bg-white/20 rounded-full mb-6">
            <div className="text-6xl">🎯</div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Test Your Skills</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Before enrolling, take our comprehensive assessment to identify your current skill level and get personalized course recommendations.
          </p>
          <Link href="/test" className="inline-block px-10 py-5 bg-white text-green-600 rounded-lg font-bold text-xl hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl">
            Take Assessment →
          </Link>
        </div>
      </div>
    </div>
  )
}
