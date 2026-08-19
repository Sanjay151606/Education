import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'

export async function GET() {
  try {
    const student = db.getStudent('student_1')
    const masteries = db.getAllTopicMasteries('student_1')
    const topics = db.getTopics()
    const overallMastery = masteries.length > 0
      ? Math.round(masteries.reduce((sum, m) => sum + m.masteryScore, 0) / masteries.length)
      : 0

    return NextResponse.json({
      student: {
        ...student,
        overallMastery
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching profile' }, { status: 500 })
  }
}
