import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topic = db.getTopicById(params.id)
    if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })

    const mastery = db.getTopicMastery(topic.id, 'student_1')
    const lessons = db.getLessonsByTopic(topic.id)
    const questions = db.getQuestionsByTopic(topic.id)

    return NextResponse.json({ topic, mastery, lessons, questions })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching topic' }, { status: 500 })
  }
}
