'use client'

import { useEffect, useRef, useState } from 'react'

interface Task {
  id: number
  title: string
  status: 'completed' | 'in-progress' | 'pending'
  progress: number
}

export default function TaskWorkflow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationFrame, setAnimationFrame] = useState(0)

  const tasks: Task[] = [
    { id: 1, title: 'Complete Section A', status: 'completed', progress: 100 },
    { id: 2, title: 'Complete Section B', status: 'completed', progress: 100 },
    { id: 3, title: 'Complete Section C', status: 'completed', progress: 100 },
    { id: 4, title: 'Complete Section D', status: 'completed', progress: 100 },
    { id: 5, title: 'Review Results', status: 'completed', progress: 100 },
    { id: 6, title: 'Get Certificate', status: 'completed', progress: 100 }
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0

    const animate = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerY = 150
      const startX = 80
      const spacing = 150

      // Draw workflow connections
      tasks.forEach((task, index) => {
        if (index < tasks.length - 1) {
          const x1 = startX + index * spacing
          const x2 = startX + (index + 1) * spacing
          
          // Animated flowing line
          ctx.beginPath()
          ctx.moveTo(x1 + 40, centerY)
          ctx.lineTo(x2 - 40, centerY)
          
          if (task.status === 'completed' && tasks[index + 1].status !== 'pending') {
            // Animated gradient
            const gradient = ctx.createLinearGradient(x1, centerY, x2, centerY)
            const offset = (frame * 0.02) % 1
            gradient.addColorStop(0, '#22c55e')
            gradient.addColorStop(offset, '#3b82f6')
            gradient.addColorStop(1, '#8b5cf6')
            ctx.strokeStyle = gradient
            ctx.lineWidth = 4
            
            // Flowing particles
            for (let i = 0; i < 3; i++) {
              const particleProgress = ((frame * 0.02) + (i * 0.33)) % 1
              const particleX = x1 + 40 + (x2 - x1 - 80) * particleProgress
              
              ctx.shadowColor = 'rgba(59, 130, 246, 0.8)'
              ctx.shadowBlur = 15
              ctx.beginPath()
              ctx.arc(particleX, centerY, 5 - i, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(59, 130, 246, ${1 - i * 0.3})`
              ctx.fill()
              ctx.shadowBlur = 0
            }
          } else {
            ctx.strokeStyle = '#d1d5db'
            ctx.lineWidth = 2
            ctx.setLineDash([10, 5])
          }
          
          ctx.stroke()
          ctx.setLineDash([])

          // Arrow
          if (task.status === 'completed') {
            ctx.save()
            ctx.translate(x2 - 40, centerY)
            ctx.rotate(0)
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(-12, -6)
            ctx.lineTo(-12, 6)
            ctx.closePath()
            ctx.fillStyle = task.status === 'completed' ? '#22c55e' : '#d1d5db'
            ctx.fill()
            ctx.restore()
          }
        }
      })

      // Draw task nodes
      tasks.forEach((task, index) => {
        const x = startX + index * spacing
        const y = centerY
        
        // Outer glow for active/completed tasks
        if (task.status !== 'pending') {
          const glowRadius = 45 + Math.sin(frame * 0.1 + index) * 3
          ctx.beginPath()
          ctx.arc(x, y, glowRadius, 0, Math.PI * 2)
          const glowGradient = ctx.createRadialGradient(x, y, 35, x, y, glowRadius)
          glowGradient.addColorStop(0, task.status === 'completed' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)')
          glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
          ctx.fillStyle = glowGradient
          ctx.fill()
        }

        // Node circle
        const radius = 35 + (task.status === 'completed' ? Math.sin(frame * 0.08 + index) * 2 : 0)
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = 15
        ctx.shadowOffsetX = 3
        ctx.shadowOffsetY = 3
        
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        
        const gradient = ctx.createRadialGradient(x - 10, y - 10, 0, x, y, radius)
        if (task.status === 'completed') {
          gradient.addColorStop(0, '#4ade80')
          gradient.addColorStop(1, '#16a34a')
        } else if (task.status === 'in-progress') {
          gradient.addColorStop(0, '#60a5fa')
          gradient.addColorStop(1, '#2563eb')
        } else {
          gradient.addColorStop(0, '#d1d5db')
          gradient.addColorStop(1, '#9ca3af')
        }
        
        ctx.fillStyle = gradient
        ctx.fill()
        
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 3
        ctx.stroke()
        
        ctx.shadowBlur = 0
        
        // Task number or checkmark
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 20px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        if (task.status === 'completed') {
          // Animated checkmark
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = 3
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(x - 10, y)
          ctx.lineTo(x - 3, y + 7)
          ctx.lineTo(x + 10, y - 7)
          ctx.stroke()
        } else {
          ctx.fillText(task.id.toString(), x, y)
        }

        // Progress ring for in-progress tasks
        if (task.status === 'in-progress') {
          const progressAngle = (task.progress / 100) * Math.PI * 2
          ctx.beginPath()
          ctx.arc(x, y, radius + 5, -Math.PI / 2, -Math.PI / 2 + progressAngle)
          ctx.strokeStyle = '#3b82f6'
          ctx.lineWidth = 4
          ctx.stroke()
        }
      })

      // Draw task labels below nodes
      tasks.forEach((task, index) => {
        const x = startX + index * spacing
        const y = centerY + 60
        
        ctx.fillStyle = task.status === 'completed' ? '#16a34a' : task.status === 'in-progress' ? '#2563eb' : '#6b7280'
        ctx.font = 'bold 12px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(task.title, x, y)
        
        // Status indicator
        ctx.font = '10px sans-serif'
        ctx.fillStyle = '#6b7280'
        if (task.status === 'completed') {
          ctx.fillText('✓ Done', x, y + 15)
        } else if (task.status === 'in-progress') {
          ctx.fillText(`${task.progress}%`, x, y + 15)
        } else {
          ctx.fillText('Pending', x, y + 15)
        }
      })

      setAnimationFrame(frame)
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const totalTasks = tasks.length
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Task Workflow</h3>
          <p className="text-gray-600">Your learning journey progress</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-green-600">{completionPercentage}%</div>
          <div className="text-sm text-gray-600">{completedTasks}/{totalTasks} Complete</div>
        </div>
      </div>

      <canvas ref={canvasRef} width={950} height={250} className="w-full h-auto mb-6" />

      {/* Task list */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-lg border-2 transition-all ${
              task.status === 'completed'
                ? 'border-green-500 bg-green-50'
                : task.status === 'in-progress'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  task.status === 'completed'
                    ? 'bg-green-500'
                    : task.status === 'in-progress'
                    ? 'bg-blue-500'
                    : 'bg-gray-400'
                }`}
              >
                {task.status === 'completed' ? '✓' : task.id}
              </div>
              <span className="text-xs font-semibold text-gray-700">{task.title}</span>
            </div>
            {task.status === 'completed' && (
              <div className="text-xs font-semibold text-green-600">✓ Completed</div>
            )}
            {task.status === 'in-progress' && (
              <div className="text-xs font-semibold text-blue-600">{task.progress}% Done</div>
            )}
            {task.status === 'pending' && (
              <div className="text-xs font-semibold text-gray-500">Pending</div>
            )}
          </div>
        ))}
      </div>

      {/* Completion message */}
      {completionPercentage === 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white text-center animate-fadeIn">
          <div className="text-3xl mb-2">🎉</div>
          <div className="font-bold text-lg">All Tasks Completed!</div>
          <div className="text-sm">Congratulations on finishing your learning journey</div>
        </div>
      )}
    </div>
  )
}
