import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'
import { executeWorkflow } from '@/app/education/lib/agents/workflowEngine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trigger = searchParams.get('trigger')
    
    if (trigger) {
      const workflows = db.getWorkflowsByTrigger(trigger)
      return NextResponse.json({ workflows })
    }

    const workflows = db.getWorkflows()
    return NextResponse.json({ workflows })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch workflows' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const saved = db.saveWorkflow(body)
    return NextResponse.json({ workflow: saved })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save workflow' }, { status: 500 })
  }
}
