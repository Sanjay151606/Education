'use client'

import { useEffect, useRef, useState } from 'react'

interface Node {
  id: string
  label: string
  x: number
  y: number
  category: 'core' | 'skill' | 'assessment' | 'achievement'
  completed: boolean
  connections: string[]
  vx?: number
  vy?: number
}

export default function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  const [animationFrame, setAnimationFrame] = useState(0)
  const nodesRef = useRef<Node[]>([])

  const initialNodes: Node[] = [
    // Core Learning
    { id: 'communication', label: 'Communication\nSkills', x: 400, y: 200, category: 'core', completed: true, connections: ['reading', 'speaking', 'listening', 'writing'], vx: 0, vy: 0 },
    
    // Skills
    { id: 'reading', label: 'Reading', x: 250, y: 100, category: 'skill', completed: true, connections: ['section-a', 'comprehension'], vx: 0, vy: 0 },
    { id: 'speaking', label: 'Speaking', x: 550, y: 100, category: 'skill', completed: true, connections: ['section-b', 'presentation'], vx: 0, vy: 0 },
    { id: 'listening', label: 'Listening', x: 250, y: 300, category: 'skill', completed: true, connections: ['section-d', 'comprehension'], vx: 0, vy: 0 },
    { id: 'writing', label: 'Writing', x: 550, y: 300, category: 'skill', completed: false, connections: ['grammar', 'technical'], vx: 0, vy: 0 },
    
    // Assessments
    { id: 'section-a', label: 'Section A\n23 Questions', x: 100, y: 50, category: 'assessment', completed: true, connections: ['cert-reading'], vx: 0, vy: 0 },
    { id: 'section-b', label: 'Section B\n4 Topics', x: 700, y: 50, category: 'assessment', completed: true, connections: ['cert-speaking'], vx: 0, vy: 0 },
    { id: 'section-c', label: 'Section C\n34 Questions', x: 700, y: 350, category: 'assessment', completed: true, connections: ['cert-grammar'], vx: 0, vy: 0 },
    { id: 'section-d', label: 'Section D\n16 Questions', x: 100, y: 350, category: 'assessment', completed: true, connections: ['cert-listening'], vx: 0, vy: 0 },
    
    // Sub-skills
    { id: 'grammar', label: 'Grammar', x: 550, y: 400, category: 'skill', completed: true, connections: ['section-c'], vx: 0, vy: 0 },
    { id: 'comprehension', label: 'Comprehension', x: 150, y: 200, category: 'skill', completed: true, connections: [], vx: 0, vy: 0 },
    { id: 'presentation', label: 'Presentation', x: 650, y: 200, category: 'skill', completed: false, connections: [], vx: 0, vy: 0 },
    { id: 'technical', label: 'Technical\nWriting', x: 450, y: 400, category: 'skill', completed: false, connections: [], vx: 0, vy: 0 },
    
    // Achievements
    { id: 'cert-reading', label: '🏆 Reading\nCertified', x: 50, y: 0, category: 'achievement', completed: true, connections: [], vx: 0, vy: 0 },
    { id: 'cert-speaking', label: '🏆 Speaking\nCertified', x: 750, y: 0, category: 'achievement', completed: true, connections: [], vx: 0, vy: 0 },
    { id: 'cert-grammar', label: '🏆 Grammar\nCertified', x: 750, y: 400, category: 'achievement', completed: true, connections: [], vx: 0, vy: 0 },
    { id: 'cert-listening', label: '🏆 Listening\nCertified', x: 50, y: 400, category: 'achievement', completed: true, connections: [], vx: 0, vy: 0 },
  ]

  useEffect(() => {
    nodesRef.current = initialNodes.map(node => ({ ...node }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    const particles: Array<{ x: number; y: number; targetX: number; targetY: number; progress: number; speed: number }> = []

    const animate = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const nodes = nodesRef.current

      // Apply gentle floating animation to nodes
      nodes.forEach((node, index) => {
        const floatSpeed = 0.02
        const floatAmount = 2
        node.y += Math.sin(frame * floatSpeed + index) * 0.1
        node.x += Math.cos(frame * floatSpeed + index * 0.5) * 0.05
      })

      // Draw connections with enhanced animations
      nodes.forEach(node => {
        node.connections.forEach(targetId => {
          const target = nodes.find(n => n.id === targetId)
          if (!target) return

          // Enhanced bezier curve
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          
          const midX = (node.x + target.x) / 2
          const midY = (node.y + target.y) / 2
          const offsetX = (target.y - node.y) * 0.2
          const offsetY = (node.x - target.x) * 0.2
          
          // Animated control point
          const animOffset = Math.sin(frame * 0.03) * 10
          ctx.quadraticCurveTo(
            midX + offsetX + animOffset,
            midY + offsetY + animOffset,
            target.x,
            target.y
          )
          
          // Enhanced gradient
          const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y)
          if (node.completed && target.completed) {
            gradient.addColorStop(0, `rgba(34, 197, 94, ${0.6 + Math.sin(frame * 0.05) * 0.2})`)
            gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.8 + Math.sin(frame * 0.05) * 0.2})`)
            gradient.addColorStop(1, `rgba(147, 51, 234, ${0.6 + Math.sin(frame * 0.05) * 0.2})`)
          } else {
            gradient.addColorStop(0, 'rgba(156, 163, 175, 0.3)')
            gradient.addColorStop(1, 'rgba(156, 163, 175, 0.3)')
          }
          
          ctx.strokeStyle = gradient
          ctx.lineWidth = node.completed && target.completed ? 3 : 1
          ctx.stroke()

          // Multiple animated particles
          if (node.completed && target.completed) {
            for (let i = 0; i < 3; i++) {
              const progress = ((frame * 0.015) + (i * 0.33)) % 1
              const particleX = node.x + (target.x - node.x) * progress
              const particleY = node.y + (target.y - node.y) * progress
              
              // Particle with glow
              ctx.shadowColor = 'rgba(59, 130, 246, 0.8)'
              ctx.shadowBlur = 10
              ctx.beginPath()
              ctx.arc(particleX, particleY, 4 - i, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(59, 130, 246, ${1 - i * 0.3})`
              ctx.fill()
              ctx.shadowBlur = 0
            }
          }
        })
      })

      // Draw nodes with enhanced effects
      nodes.forEach((node, index) => {
        const isHovered = hoveredNode?.id === node.id
        const baseRadius = isHovered ? 35 : 30
        const pulseRadius = baseRadius + Math.sin(frame * 0.08 + index) * 3

        // Outer glow ring for completed nodes
        if (node.completed) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, pulseRadius + 8, 0, Math.PI * 2)
          const glowGradient = ctx.createRadialGradient(node.x, node.y, pulseRadius, node.x, node.y, pulseRadius + 8)
          glowGradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
          glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
          ctx.fillStyle = glowGradient
          ctx.fill()
        }

        // Node shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = 15
        ctx.shadowOffsetX = 3
        ctx.shadowOffsetY = 3

        // Node circle with animated gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.completed ? pulseRadius : baseRadius, 0, Math.PI * 2)
        
        const gradient = ctx.createRadialGradient(node.x - 10, node.y - 10, 0, node.x, node.y, baseRadius)
        
        if (node.category === 'core') {
          gradient.addColorStop(0, node.completed ? '#60a5fa' : '#9ca3af')
          gradient.addColorStop(1, node.completed ? '#1e40af' : '#6b7280')
        } else if (node.category === 'skill') {
          gradient.addColorStop(0, node.completed ? '#a78bfa' : '#9ca3af')
          gradient.addColorStop(1, node.completed ? '#6d28d9' : '#6b7280')
        } else if (node.category === 'assessment') {
          gradient.addColorStop(0, node.completed ? '#4ade80' : '#9ca3af')
          gradient.addColorStop(1, node.completed ? '#16a34a' : '#6b7280')
        } else if (node.category === 'achievement') {
          gradient.addColorStop(0, node.completed ? '#fbbf24' : '#9ca3af')
          gradient.addColorStop(1, node.completed ? '#d97706' : '#6b7280')
        }
        
        ctx.fillStyle = gradient
        ctx.fill()

        // Animated border
        ctx.strokeStyle = isHovered ? '#fff' : 'rgba(255, 255, 255, 0.6)'
        ctx.lineWidth = isHovered ? 4 : 2
        ctx.stroke()

        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0

        // Node label
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 11px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        const lines = node.label.split('\n')
        lines.forEach((line, i) => {
          ctx.fillText(line, node.x, node.y + (i - lines.length / 2 + 0.5) * 12)
        })

        // Animated completion indicator
        if (node.completed) {
          const checkSize = 8 + Math.sin(frame * 0.1 + index) * 1
          ctx.beginPath()
          ctx.arc(node.x + 20, node.y - 20, checkSize, 0, Math.PI * 2)
          ctx.fillStyle = '#22c55e'
          ctx.fill()
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = 2
          ctx.stroke()
          
          // Checkmark
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(node.x + 17, node.y - 20)
          ctx.lineTo(node.x + 19, node.y - 18)
          ctx.lineTo(node.x + 23, node.y - 23)
          ctx.stroke()
        }
      })

      setAnimationFrame(frame)
      requestAnimationFrame(animate)
    }

    animate()
  }, [hoveredNode])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const hovered = nodesRef.current.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
      return distance < 30
    })

    setHoveredNode(hovered || null)
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        onMouseMove={handleMouseMove}
        className="w-full h-auto bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-xl shadow-2xl cursor-pointer"
        style={{ animation: 'fadeInUp 0.6s ease-out' }}
      />
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2 animate-fadeIn">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 animate-pulse"></div>
          <span className="text-gray-700">Core Skills</span>
        </div>
        <div className="flex items-center gap-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 animate-pulse"></div>
          <span className="text-gray-700">Sub-Skills</span>
        </div>
        <div className="flex items-center gap-2 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-green-700 animate-pulse"></div>
          <span className="text-gray-700">Assessments</span>
        </div>
        <div className="flex items-center gap-2 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 animate-pulse"></div>
          <span className="text-gray-700">Achievements</span>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredNode && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 border-2 border-blue-200 animate-fadeIn">
          <h4 className="font-bold text-gray-900 mb-1">{hoveredNode.label.replace('\n', ' ')}</h4>
          <p className="text-sm text-gray-600 mb-2">
            {hoveredNode.category === 'core' && 'Core Learning Area'}
            {hoveredNode.category === 'skill' && 'Skill Component'}
            {hoveredNode.category === 'assessment' && 'Assessment Module'}
            {hoveredNode.category === 'achievement' && 'Achievement Unlocked'}
          </p>
          <div className={`text-sm font-semibold ${hoveredNode.completed ? 'text-green-600' : 'text-gray-500'}`}>
            {hoveredNode.completed ? '✅ Completed' : '⏳ In Progress'}
          </div>
        </div>
      )}
    </div>
  )
}
