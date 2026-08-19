import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'
import { executeWorkflow } from '@/app/education/lib/agents/workflowEngine'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = db.getWorkflowById(params.id)
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const triggerType = body.triggerType || workflow.trigger || 'MANUAL'
    const triggerData = body.triggerData || { score: 40, topicId: 'topic_recursion' }
    const studentId = body.studentId || 'student_1'

    const runResult = await executeWorkflow(workflow, triggerType, triggerData, studentId)

    return NextResponse.json({
      success: runResult.status === 'SUCCESS',
      run: runResult
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Workflow run failed' }, { status: 500 })
  }
}
