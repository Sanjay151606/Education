import { NextRequest, NextResponse } from 'next/server'
import { get_student_progress } from '@/app/education/lib/agents/tools'

export async function GET() {
  try {
    const progress = get_student_progress()
    return NextResponse.json({ progress })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching progress' }, { status: 500 })
  }
}
