'use client'

import { useEffect, useRef } from 'react'

interface SkillData {
  skill: string
  score: number
  maxScore: number
}

export default function SkillsRadar() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const skills: SkillData[] = [
    { skill: 'Reading', score: 95, maxScore: 100 },
    { skill: 'Speaking', score: 88, maxScore: 100 },
    { skill: 'Listening', score: 92, maxScore: 100 },
    { skill: 'Writing', score: 85, maxScore: 100 },
    { skill: 'Grammar', score: 90, maxScore: 100 },
    { skill: 'Vocabulary', score: 87, maxScore: 100 }
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0

    const animate = () => {
      frame++
      const progress = Math.min(frame / 60, 1)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = 250
      const centerY = 250
      const maxRadius = 180
      const numSkills = skills.length

      // Draw background circles
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, (maxRadius / 5) * i, 0, Math.PI * 2)
        ctx.strokeStyle = i === 5 ? '#d1d5db' : '#e5e7eb'
        ctx.lineWidth = i === 5 ? 2 : 1
        ctx.stroke()

        // Score labels
        if (i === 5) {
          ctx.fillStyle = '#9ca3af'
          ctx.font = '12px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('100', centerX, centerY - maxRadius - 10)
        }
      }

      // Draw axes
      skills.forEach((skill, index) => {
        const angle = (Math.PI * 2 * index) / numSkills - Math.PI / 2
        const x = centerX + Math.cos(angle) * maxRadius
        const y = centerY + Math.sin(angle) * maxRadius

        // Axis line
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = '#e5e7eb'
        ctx.lineWidth = 1
        ctx.stroke()

        // Skill label
        const labelDistance = maxRadius + 30
        const labelX = centerX + Math.cos(angle) * labelDistance
        const labelY = centerY + Math.sin(angle) * labelDistance

        ctx.fillStyle = '#1f2937'
        ctx.font = 'bold 14px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(skill.skill, labelX, labelY)

        // Score label
        ctx.font = '12px sans-serif'
        ctx.fillStyle = '#6b7280'
        ctx.fillText(`${skill.score}%`, labelX, labelY + 16)
      })

      // Draw skill polygon
      ctx.beginPath()
      skills.forEach((skill, index) => {
        const angle = (Math.PI * 2 * index) / numSkills - Math.PI / 2
        const radius = (skill.score / skill.maxScore) * maxRadius * progress
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.closePath()

      // Fill
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius)
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)')
      gradient.addColorStop(1, 'rgba(147, 51, 234, 0.2)')
      ctx.fillStyle = gradient
      ctx.fill()

      // Stroke
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw points
      skills.forEach((skill, index) => {
        const angle = (Math.PI * 2 * index) / numSkills - Math.PI / 2
        const radius = (skill.score / skill.maxScore) * maxRadius * progress
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        // Point shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = 5

        // Point
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fillStyle = '#3b82f6'
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.shadowColor = 'transparent'
      })

      // Center point
      ctx.beginPath()
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#6b7280'
      ctx.fill()

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Skills Assessment</h3>
      <canvas ref={canvasRef} width={500} height={500} className="mx-auto" />
      
      {/* Average score */}
      <div className="mt-6 text-center">
        <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
          <span className="text-white font-bold text-lg">
            Average Score: {Math.round(skills.reduce((sum, s) => sum + s.score, 0) / skills.length)}%
          </span>
        </div>
      </div>

      {/* Skills breakdown */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">{skill.skill}</span>
              <span className="text-sm font-bold text-blue-600">{skill.score}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                style={{ width: `${skill.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
