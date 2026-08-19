import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topicId = searchParams.get('topicId') || undefined
    const attempts = db.getQuizAttempts('student_1', topicId)
    return NextResponse.json({ history: attempts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching quiz history' }, { status: 500 })
  }
}
