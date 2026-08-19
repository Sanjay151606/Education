import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'
import { queueGoogleSheetBackup } from '@/app/education/lib/services/googleSheetBackupService'

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const updated = db.updateStudent('student_1', body)
    queueGoogleSheetBackup('student_1')
    return NextResponse.json({ success: true, student: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating profile' }, { status: 500 })
  }
}

