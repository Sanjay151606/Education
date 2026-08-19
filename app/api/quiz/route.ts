import { NextRequest, NextResponse } from 'next/server'
import { generateQuizQuestions, evaluateQuizSubmission } from '@/app/education/lib/agents/assessmentAgent'
import { triggerWorkflowsByEvent } from '@/app/education/lib/agents/workflowEngine'
import { db } from '@/app/education/lib/db/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, topicId, count, difficulty, submission, timeSpentSeconds } = body

    if (action === 'generate') {
      const questions = generateQuizQuestions(topicId || 'topic_recursion', count || 5, difficulty || 'MEDIUM')
      return NextResponse.json({ questions })
    }

    if (action === 'submit' || submission) {
      const sub = submission || body
      const evaluation = evaluateQuizSubmission(
        sub.topicId || 'topic_recursion',
        sub.answers || [],
        sub.difficulty || 'MEDIUM',
        timeSpentSeconds || 60
      )

      // Trigger automatic workflow execution (e.g. if score < 50%)
      const triggeredRuns = await triggerWorkflowsByEvent('QUIZ_COMPLETED', {
        topicId: sub.topicId || 'topic_recursion',
        score: evaluation.score,
        correctCount: evaluation.correctCount,
        incorrectCount: evaluation.incorrectCount,
        difficulty: sub.difficulty || 'MEDIUM'
      })

      return NextResponse.json({
        evaluation,
        triggeredWorkflows: triggeredRuns.map(r => ({ id: r.id, name: r.workflowName, status: r.status }))
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Quiz error' }, { status: 500 })
  }
}
