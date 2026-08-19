import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'

export async function GET() {
  try {
    const masteries = db.getAllTopicMasteries('student_1')
    const topics = db.getTopics()
    const topicMap = new Map(topics.map(t => [t.id, t]))

    const now = new Date()
    const dueRevision = masteries
      .filter(m => m.nextRevisionAt && new Date(m.nextRevisionAt) <= now)
      .map(m => ({
        ...m,
        topicTitle: topicMap.get(m.topicId)?.title ?? m.topicId,
        topicCategory: topicMap.get(m.topicId)?.category ?? 'General'
      }))

    return NextResponse.json({ dueRevision })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching revision' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { topicId } = await request.json()
    // Mark revision completed: push nextRevisionAt ahead and bump confidence
    const current = db.getTopicMastery(topicId || 'topic_recursion', 'student_1')
    if (current) {
      const nextDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      db.upsertTopicMastery({
        topicId: current.topicId,
        studentId: 'student_1',
        masteryScore: Math.min(100, current.masteryScore + 5),
        confidenceScore: Math.min(100, (current.confidenceScore || 50) + 10),
        lastStudiedAt: new Date().toISOString(),
        nextRevisionAt: nextDate
      })
    }
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating revision' }, { status: 500 })
  }
}
