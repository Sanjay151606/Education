import { NextRequest, NextResponse } from 'next/server'
import { runStudentAnalysis } from '@/app/education/lib/agents/studentAnalyzer'

export async function POST() {
  try {
    const analysis = runStudentAnalysis()
    return NextResponse.json({ success: true, analysis })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 })
  }
}
