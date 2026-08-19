'use client'

export default function AboutPage() {
  const features = [
    { icon: '🎓', title: 'Expert Instructors', desc: 'Learn from industry professionals with years of experience' },
    { icon: '📱', title: 'Mobile Learning', desc: 'Access courses anytime, anywhere on any device' },
    { icon: '🏆', title: 'Certifications', desc: 'Earn recognized certificates upon course completion' },
    { icon: '💬', title: 'Interactive Learning', desc: 'Engage with peers and instructors in real-time' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Monitor your learning journey with detailed analytics' },
    { icon: '🎯', title: 'Skill Assessments', desc: 'Test your knowledge with comprehensive evaluations' }
  ]

  const team = [
    { name: 'Dr. Sarah Johnson', role: 'Chief Learning Officer', icon: '👩‍🏫', expertise: 'Communication & Pedagogy' },
    { name: 'Michael Chen', role: 'Head of Curriculum', icon: '👨‍💼', expertise: 'Business English' },
    { name: 'Emily Rodriguez', role: 'Assessment Director', icon: '👩‍💻', expertise: 'Educational Technology' },
    { name: 'David Kim', role: 'Technical Lead', icon: '👨‍🔬', expertise: 'Platform Development' }
  ]

  const stats = [
    { value: '50+', label: 'Expert Courses' },
    { value: '10,000+', label: 'Active Students' },
    { value: '95%', label: 'Success Rate' },
    { value: '24/7', label: 'Support' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Brain Graph</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            We're on a mission to make quality education accessible to everyone, everywhere. 
            Brain Graph combines expert instruction with cutting-edge neural network visualizations 
            to deliver an unparalleled learning experience that shows how knowledge connects.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="text-5xl mb-4">🧠</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                To empower individuals worldwide with the communication skills and knowledge 
                they need to succeed in their personal and professional lives. Brain Graph 
                visualizes learning connections, making education accessible, engaging, and 
                effective through neural network-style knowledge mapping.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                To become the world's leading neural learning platform, helping millions of 
                learners visualize and understand how their knowledge connects. Through 
                innovative brain-inspired technology and interactive knowledge graphs, we're 
                revolutionizing how people learn and grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-xl text-gray-600">Comprehensive features designed for your success</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Experts dedicated to your learning success</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center border-2 border-blue-200 hover:border-blue-400 transition-all">
                <div className="text-6xl mb-4">{member.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-blue-600 font-semibold mb-2">{member.role}</div>
                <div className="text-sm text-gray-600">{member.expertise}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🧠</div>
          <h2 className="text-4xl font-bold mb-6">Powered by Advanced Neural Technology</h2>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            Brain Graph leverages cutting-edge technology including AI-powered assessments, 
            neural network visualizations, real-time progress tracking, and adaptive learning 
            algorithms to provide a personalized learning experience that shows how your 
            knowledge connects and grows.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 bg-white/20 rounded-full font-semibold">Next.js 14</div>
            <div className="px-6 py-3 bg-white/20 rounded-full font-semibold">TypeScript</div>
            <div className="px-6 py-3 bg-white/20 rounded-full font-semibold">Neural Graphs</div>
            <div className="px-6 py-3 bg-white/20 rounded-full font-semibold">Real-time Analytics</div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                Continuously improving our platform with the latest educational technology and methodologies.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Accessibility</h3>
              <p className="text-gray-600">
                Making quality education available to everyone, regardless of location or background.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                Maintaining the highest standards in course content, instruction, and student support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
