import { NextRequest, NextResponse } from 'next/server'
import { recommend_next_topic } from '@/app/education/lib/agents/tools'

export async function GET() {
  try {
    const nextAction = recommend_next_topic()
    return NextResponse.json({ nextAction })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching next action' }, { status: 500 })
  }
}
