import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'
import { runLearningPlanner } from '@/app/education/lib/agents/learningPlanner'

export async function GET() {
  try {
    const plan = db.getTodayStudyPlan('student_1')
    return NextResponse.json({ studyPlan: plan })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching study plan' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const generated = runLearningPlanner()
    const todayPlan = db.getTodayStudyPlan('student_1')
    return NextResponse.json({ success: true, plan: todayPlan || generated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating study plan' }, { status: 500 })
  }
}
