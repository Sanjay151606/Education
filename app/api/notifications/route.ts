import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'

export async function GET() {
  try {
    const notifications = db.getNotifications('student_1')
    return NextResponse.json({ notifications })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching notifications' }, { status: 500 })
  }
}
