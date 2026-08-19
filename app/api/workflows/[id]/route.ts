import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = db.getWorkflowById(params.id)
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }
    const runs = db.getWorkflowRuns(params.id, 20)
    return NextResponse.json({ workflow, runs })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching workflow' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const saved = db.saveWorkflow({ ...body, id: params.id })
    return NextResponse.json({ workflow: saved })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating workflow' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = db.deleteWorkflow(params.id)
    return NextResponse.json({ success })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error deleting workflow' }, { status: 500 })
  }
}
