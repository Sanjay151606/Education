import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'

export async function GET() {
  try {
    const topics = db.getTopics()
    const masteries = db.getAllTopicMasteries('student_1')
    const masteryMap = new Map(masteries.map(m => [m.topicId, m]))

    const graphNodes = topics.map(t => {
      const m = masteryMap.get(t.id)
      return {
        id: t.id,
        title: t.title,
        category: t.category,
        difficulty: t.difficulty,
        prerequisites: t.prerequisites,
        x: t.x || 200,
        y: t.y || 200,
        masteryScore: m?.masteryScore ?? 0,
        status: m?.status || 'Not Started',
        attemptCount: m?.attemptCount ?? 0,
        lastStudiedAt: m?.lastStudiedAt || null,
        nextRevisionAt: m?.nextRevisionAt || null
      }
    })

    const edges: { source: string; target: string }[] = []
    topics.forEach(t => {
      t.prerequisites.forEach(pre => {
        edges.push({ source: pre, target: t.id })
      })
    })

    return NextResponse.json({ nodes: graphNodes, edges })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching knowledge graph' }, { status: 500 })
  }
}
