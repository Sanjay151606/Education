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
      features: ['Speaking', 'Listening', 'Writing', 'Presentation'],
      link: 'https://youtu.be/7hr60EumwQ4?si=eq3Rt2IiZsObQMxC'
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
      features: ['Email Writing', 'Meetings', 'Negotiations', 'Reports'],
      link: 'https://youtu.be/fm6PtyM4qMw?si=_pzIvAnqdj8F8FNy'
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
      features: ['Documentation', 'API Docs', 'User Guides', 'Best Practices'],
      link: 'https://youtu.be/4CpIkWh0YyE?si=1bpOXTYGL_A6pMn5'
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
      features: ['Body Language', 'Voice Control', 'Storytelling', 'Q&A Handling'],
      link: 'https://www.youtube.com/watch?v=Edg54WnYqkE'
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
      features: ['Cultural Awareness', 'Global Etiquette', 'Virtual Teams', 'Diversity'],
      link: 'https://www.youtube.com/watch?v=YMyofREc5Jk'
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
      features: ['Team Management', 'Conflict Resolution', 'Motivation', 'Feedback'],
      link: 'https://www.youtube.com/watch?v=lg48Bi9DA54'
    }
  ]

  const filteredCourses = courses.filter(course => {
    const categoryMatch =
      selectedCategory === 'all' || course.category === selectedCategory
    const levelMatch =
      selectedLevel === 'all' || course.level === selectedLevel
    return categoryMatch && levelMatch
  })

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-600">
            Learn for free with curated expert video content
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="grid md:grid-cols-2 gap-6">

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Level
              </label>
              <div className="flex flex-wrap gap-2">
                {['all', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedLevel === level
                        ? 'bg-green-600 text-white'
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

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-105"
            >
              {/* Header */}
              <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <div className="text-7xl">{course.icon}</div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {course.level}
                  </span>
                  <span className="text-yellow-500 font-semibold">
                    ⭐ {course.rating}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {course.features.slice(0, 3).map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all"
                >
                  ▶ Watch on YouTube
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Assessment CTA */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Test Your Skills</h2>
          <p className="text-lg mb-6">
            Take our assessment and get personalized learning recommendations
          </p>
          <Link
            href="/test"
            className="inline-block px-8 py-4 bg-white text-green-600 rounded-lg font-bold hover:bg-green-50 transition-all"
          >
            Take Assessment →
          </Link>
        </div>

      </div>
    </div>
  )
}
