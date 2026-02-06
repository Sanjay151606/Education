'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactMethods = [
    { icon: '📧', title: 'Email Support', value: 'support@braingraph.com', desc: 'Response within 24 hours' },
    { icon: '💬', title: 'Live Chat', value: 'Available 24/7', desc: 'Instant support' },
    { icon: '📞', title: 'Phone Support', value: '+1 (555) 123-4567', desc: 'Mon-Fri, 9AM-6PM EST' },
    { icon: '📍', title: 'Office Location', value: '123 Education St, Learning City', desc: 'Visit us in person' }
  ]

  const faqs = [
    { q: 'How do I enroll in a course?', a: 'Browse our courses page, select your desired course, and click "Enroll Now". Follow the registration process to get started.' },
    { q: 'What is the assessment process?', a: 'Our comprehensive assessment tests your communication skills across multiple areas. Results help us recommend personalized learning paths.' },
    { q: 'Are certificates recognized?', a: 'Yes! Our certificates are industry-recognized and can be shared on LinkedIn and other professional platforms.' },
    { q: 'Can I access courses on mobile?', a: 'Absolutely! Our platform is fully responsive and works seamlessly on all devices including smartphones and tablets.' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-blue-100">
            Have questions? We're here to help! Reach out to our support team.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactMethods.map((method, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center border-2 border-blue-200 hover:border-blue-400 transition-all transform hover:scale-105">
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                <div className="text-blue-600 font-semibold mb-1">{method.value}</div>
                <div className="text-sm text-gray-600">{method.desc}</div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              {submitted ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-600">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select a subject</option>
                      <option value="course">Course Inquiry</option>
                      <option value="assessment">Assessment Support</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 hover:border-blue-300 transition-all">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">❓ {faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="font-bold text-lg text-gray-900 mb-4">📚 Quick Links</h3>
                <div className="space-y-2">
                  <a href="/education/courses" className="block text-blue-600 hover:text-blue-800 font-semibold">
                    → Browse Courses
                  </a>
                  <a href="/test" className="block text-blue-600 hover:text-blue-800 font-semibold">
                    → Take Assessment
                  </a>
                  <a href="/education/dashboard" className="block text-blue-600 hover:text-blue-800 font-semibold">
                    → My Dashboard
                  </a>
                  <a href="/education/about" className="block text-blue-600 hover:text-blue-800 font-semibold">
                    → About Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">⏰</div>
          <h2 className="text-4xl font-bold mb-6">Support Hours</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-3">Live Chat & Email</h3>
              <p className="text-blue-100">Available 24/7</p>
              <p className="text-sm text-blue-200 mt-2">Instant responses anytime</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-3">Phone Support</h3>
              <p className="text-blue-100">Monday - Friday</p>
              <p className="text-sm text-blue-200 mt-2">9:00 AM - 6:00 PM EST</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
