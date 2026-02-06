'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function EducationHome() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    { icon: '📚', title: 'Comprehensive Courses', desc: 'Expert-designed curriculum across multiple subjects' },
    { icon: '🎯', title: 'Skill Assessments', desc: 'Test your knowledge with our advanced assessment platform' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Monitor your learning journey with detailed analytics' },
    { icon: '🏆', title: 'Certifications', desc: 'Earn recognized certificates upon course completion' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fadeInUp">
                Transform Your Future with
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Quality Education
                </span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Master new skills, take professional assessments, and advance your career with our comprehensive learning platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/education/courses" className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl">
                  Explore Courses
                </Link>
                <Link href="/test" className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-xl">
                  Take Assessment
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-4xl font-bold">50+</div>
                    <div className="text-sm text-blue-100">Courses</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-4xl font-bold">10K+</div>
                    <div className="text-sm text-blue-100">Students</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-4xl font-bold">95%</div>
                    <div className="text-sm text-blue-100">Success Rate</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <div className="text-4xl font-bold">24/7</div>
                    <div className="text-sm text-blue-100">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Brain Graph?</h2>
            <p className="text-xl text-gray-600">Everything you need for successful learning</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveFeature(idx)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  activeFeature === idx
                    ? 'border-blue-500 bg-blue-50 shadow-xl transform scale-105'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Courses</h2>
            <p className="text-xl text-gray-600">Start learning today</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Communication Skills', level: 'Beginner', duration: '8 weeks', students: '2.5K', icon: '🗣️', color: 'blue' },
              { title: 'Business English', level: 'Intermediate', duration: '10 weeks', students: '1.8K', icon: '💼', color: 'green' },
              { title: 'Technical Writing', level: 'Advanced', duration: '6 weeks', students: '1.2K', icon: '✍️', color: 'purple' }
            ].map((course, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105">
                <div className={`h-48 bg-gradient-to-br from-${course.color}-400 to-${course.color}-600 flex items-center justify-center relative`}>
                  <div className="text-8xl">{course.icon}</div>
                  <div className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-bold shadow-lg">
                    FREE
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 bg-${course.color}-100 text-${course.color}-700 rounded-full text-sm font-semibold`}>
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h3>
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <span>⏱️</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      <span className="font-bold text-green-600">100% Free</span>
                    </div>
                  </div>
                  <Link href="/education/courses" className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all">
                    Enroll Now - Free
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/education/courses" className="inline-block px-8 py-4 bg-gray-900 text-white rounded-lg font-bold text-lg hover:bg-gray-800 transition-all">
              View All Courses →
            </Link>
          </div>
        </div>
      </section>

      {/* Assessment CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-4 bg-white/20 rounded-full mb-6">
            <div className="text-6xl">🎯</div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Ready to Test Your Skills?</h2>
          <p className="text-xl text-green-100 mb-8">
            Take our comprehensive communication assessment and get instant feedback on your performance.
          </p>
          <Link href="/test" className="inline-block px-10 py-5 bg-white text-green-600 rounded-lg font-bold text-xl hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl">
            Start Assessment Now →
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-400">Expert Courses</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-400 mb-2">10,000+</div>
              <div className="text-gray-400">Active Students</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
