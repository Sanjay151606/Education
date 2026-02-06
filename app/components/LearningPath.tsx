'use client'

import { useEffect, useRef } from 'react'

interface PathNode {
  id: string
  title: string
  description: string
  completed: boolean
  x: number
  y: number
}

export default function LearningPath() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const pathNodes: PathNode[] = [
    { id: '1', title: 'Start', description: 'Begin your journey', completed: true, x: 100, y: 200 },
    { id: '2', title: 'Reading Skills', description: 'Section A - 23 Questions', completed: true, x: 250, y: 150 },
    { id: '3', title: 'Speaking Skills', description: 'Section B - 4 Topics', completed: true, x: 400, y: 100 },
    { id: '4', title: 'Grammar Mastery', description: 'Section C - 34 Questions', completed: true, x: 550, y: 150 },
    { id: '5', title: 'Listening Comp.', description: 'Section D - 16 Questions', completed: true, x: 700, y: 200 },
    { id: '6', title: 'Certificate', description: 'Achievement Unlocked!', completed: true, x: 850, y: 250 }
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

      // Draw path connections
      for (let i = 0; i < pathNodes.length - 1; i++) {
        const current = pathNodes[i]
        const next = pathNodes[i + 1]

        // Animated dashed line
        ctx.beginPath()
        ctx.moveTo(current.x, current.y)
        ctx.lineTo(next.x, next.y)
        
        if (current.completed && next.completed) {
          ctx.strokeStyle = '#22c55e'
          ctx.lineWidth = 4
          ctx.setLineDash([])
        } else {
          ctx.strokeStyle = '#d1d5db'
          ctx.lineWidth = 2
          ctx.setLineDash([10, 5])
          ctx.lineDashOffset = -frame * 0.5
        }
        
        ctx.stroke()
        ctx.setLineDash([])

        // Animated particles
        if (current.completed && next.completed) {
          const progress = (frame * 0.02) % 1
          const particleX = current.x + (next.x - current.x) * progress
          const particleY = current.y + (next.y - current.y) * progress
          
          ctx.beginPath()
          ctx.arc(particleX, particleY, 4, 0, Math.PI * 2)
          ctx.fillStyle = '#3b82f6'
          ctx.fill()
        }

        // Arrow
        const angle = Math.atan2(next.y - current.y, next.x - current.x)
        const arrowX = next.x - Math.cos(angle) * 40
        const arrowY = next.y - Math.sin(angle) * 40
        
        ctx.save()
        ctx.translate(arrowX, arrowY)
        ctx.rotate(angle)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(-10, -5)
        ctx.lineTo(-10, 5)
        ctx.closePath()
        ctx.fillStyle = current.completed && next.completed ? '#22c55e' : '#d1d5db'
        ctx.fill()
        ctx.restore()
      }

      // Draw nodes
      pathNodes.forEach((node, index) => {
        const pulse = Math.sin(frame * 0.1 + index) * 3
        const radius = 30 + (node.completed ? pulse : 0)

        // Node shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        // Node circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius)
        if (node.completed) {
          gradient.addColorStop(0, '#22c55e')
          gradient.addColorStop(1, '#16a34a')
        } else {
          gradient.addColorStop(0, '#9ca3af')
          gradient.addColorStop(1, '#6b7280')
        }
        
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.shadowColor = 'transparent'

        // Node number
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 20px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(node.id, node.x, node.y)

        // Completion checkmark
        if (node.completed) {
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(node.x - 8, node.y)
          ctx.lineTo(node.x - 3, node.y + 5)
          ctx.lineTo(node.x + 8, node.y - 5)
          ctx.stroke()
        }
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Journey</h3>
      
      <div className="relative">
        <canvas ref={canvasRef} width={950} height={350} className="w-full h-auto" />
        
        {/* Node labels */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {pathNodes.map((node, index) => (
            <div key={node.id} className={`p-3 rounded-lg border-2 ${
              node.completed ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  node.completed ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  {node.id}
                </div>
                <span className="font-bold text-sm text-gray-900">{node.title}</span>
              </div>
              <p className="text-xs text-gray-600">{node.description}</p>
              {node.completed && (
                <div className="mt-2 text-xs font-semibold text-green-600">✓ Completed</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-green-600">100%</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  )
}
