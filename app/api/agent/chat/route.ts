import { NextRequest, NextResponse } from 'next/server'
import { runTutorAgent } from '@/app/education/lib/agents/tutorAgent'

export async function POST(request: NextRequest) {
  try {
    const { message, topicId, history } = await request.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const result = await runTutorAgent(message, topicId, history || [])
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({
      response: "I'm having trouble connecting right now. Please try again in a moment.",
      masteryLevel: 'Unknown',
      topicTitle: 'General',
      ragContextUsed: false,
      error: error.message
    }, { status: 500 })
  }
}
