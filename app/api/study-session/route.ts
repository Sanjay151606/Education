import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'
import { queueGoogleSheetBackup } from '@/app/education/lib/services/googleSheetBackupService'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, status } = await request.json()
    if (!sessionId || !status) {
      return NextResponse.json({ error: 'sessionId and status required' }, { status: 400 })
    }

    const updated = db.updateSessionStatus(sessionId, status, 'student_1')
    queueGoogleSheetBackup('student_1')
    return NextResponse.json({ success: !!updated, plan: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating session' }, { status: 500 })
  }
}
