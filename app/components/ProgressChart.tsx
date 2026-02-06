'use client'

import { useEffect, useRef, useState } from 'react'

interface ChartData {
  label: string
  value: number
  maxValue: number
  color: string
}

export default function ProgressChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)

  const data: ChartData[] = [
    { label: 'Reading & Listening', value: 23, maxValue: 23, color: '#3b82f6' },
    { label: 'Speaking', value: 4, maxValue: 4, color: '#22c55e' },
    { label: 'Grammar', value: 34, maxValue: 34, color: '#a855f7' },
    { label: 'Listening Comp.', value: 16, maxValue: 16, color: '#f97316' }
  ]

  const totalCompleted = data.reduce((sum, item) => sum + item.value, 0)
  const totalMax = data.reduce((sum, item) => sum + item.maxValue, 0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    const animate = () => {
      frame++
      const progress = Math.min(frame / 60, 1) // 60 frames = 1 second

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw circular progress chart
      const centerX = 200
      const centerY = 200
      const radius = 120
      let currentAngle = -Math.PI / 2

      // Background circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 20
      ctx.stroke()

      // Draw segments
      data.forEach((item, index) => {
        const segmentAngle = (item.value / totalMax) * Math.PI * 2 * progress
        
        // Segment arc
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + segmentAngle)
        ctx.strokeStyle = item.color
        ctx.lineWidth = 20
        ctx.lineCap = 'round'
        ctx.stroke()

        // Segment label
        const labelAngle = currentAngle + segmentAngle / 2
        const labelRadius = radius + 50
        const labelX = centerX + Math.cos(labelAngle) * labelRadius
        const labelY = centerY + Math.sin(labelAngle) * labelRadius

        ctx.fillStyle = item.color
        ctx.font = 'bold 14px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(item.label, labelX, labelY)
        ctx.font = '12px sans-serif'
        ctx.fillText(`${item.value}/${item.maxValue}`, labelX, labelY + 16)

        currentAngle += segmentAngle
      })

      // Center text
      ctx.fillStyle = '#1f2937'
      ctx.font = 'bold 48px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${Math.round(totalCompleted * progress)}`, centerX, centerY - 10)
      
      ctx.font = '16px sans-serif'
      ctx.fillStyle = '#6b7280'
      ctx.fillText('Questions', centerX, centerY + 20)
      ctx.fillText('Completed', centerX, centerY + 38)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Assessment Progress</h3>
      <canvas ref={canvasRef} width={400} height={400} className="mx-auto" />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.map((item, index) => (
          <div key={index} className="p-4 rounded-lg border-2" style={{ borderColor: item.color }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm font-semibold text-gray-700">{item.label}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: item.color }}>
              {item.value}/{item.maxValue}
            </div>
            <div className="text-xs text-gray-500">
              {Math.round((item.value / item.maxValue) * 100)}% Complete
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
