import { NextRequest, NextResponse } from 'next/server'
import { get_recommendations, recommend_next_topic } from '@/app/education/lib/agents/tools'

export async function GET() {
  try {
    const recommendations = get_recommendations()
    const priority = recommend_next_topic()
    return NextResponse.json({ recommendations, priority })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching recommendations' }, { status: 500 })
  }
}
