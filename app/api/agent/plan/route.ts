import { NextRequest, NextResponse } from 'next/server'
import { runLearningPlanner } from '@/app/education/lib/agents/learningPlanner'

export async function POST() {
  try {
    const plan = runLearningPlanner()
    return NextResponse.json({ success: true, plan })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Plan generation failed' }, { status: 500 })
  }
}
