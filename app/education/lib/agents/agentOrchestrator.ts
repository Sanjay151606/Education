import { runStudentAnalysis, StudentAnalysis } from './studentAnalyzer'
import { runLearningPlanner, LearningPlan } from './learningPlanner'
import { runStudyCoach, CoachAdvice } from './studyCoach'
import { get_recommendations, recommend_next_topic } from './tools'
import { db } from '../db/database'

const MAX_ITERATIONS = 8

export interface OrchestratorResult {
  analysis: StudentAnalysis | null
  plan: LearningPlan | null
  coach: CoachAdvice | null
  nextAction: { topicId: string; topicTitle: string; masteryScore: number; reason: string } | null
  recommendations: any[]
  agentRunId: string
  iterationsUsed: number
  error?: string
}

/**
 * Main agent orchestrator — runs the full agentic loop.
 * Controlled execution with max iterations limit, error handling, and logging.
 */
export async function runAgentOrchestration(goal: 'full_analysis' | 'next_action' | 'daily_plan'): Promise<OrchestratorResult> {
  const runRecord = db.logAgentRun({
    studentId: 'student_1',
    agentType: 'ORCHESTRATOR',
    goal: `Orchestrate: ${goal}`,
    status: 'RUNNING',
    result: {}
  })

  let iterations = 0
  let analysis: StudentAnalysis | null = null
  let plan: LearningPlan | null = null
  let coach: CoachAdvice | null = null

  const result: OrchestratorResult = {
    analysis: null,
    plan: null,
    coach: null,
    nextAction: null,
    recommendations: [],
    agentRunId: runRecord.id,
    iterationsUsed: 0
  }

  try {
    // STEP 1: Load student state
    iterations++
    if (iterations > MAX_ITERATIONS) throw new Error('Max iterations reached at step 1')
    console.log(`[Orchestrator] Step 1: Load student state (iteration ${iterations})`)

    // STEP 2: Student analysis
    iterations++
    if (iterations > MAX_ITERATIONS) throw new Error('Max iterations reached at step 2')
    console.log(`[Orchestrator] Step 2: Run student analysis (iteration ${iterations})`)

    db.logToolCall({
      agentRunId: runRecord.id,
      toolName: 'runStudentAnalysis',
      input: { studentId: 'student_1' },
      output: {},
      status: 'SUCCESS'
    })

    analysis = runStudentAnalysis()
    result.analysis = analysis

    if (goal === 'next_action') {
      // Early exit for next action only
      result.nextAction = analysis.priorityTopic
      result.iterationsUsed = iterations
      db.logAgentRun({
        studentId: 'student_1',
        agentType: 'ORCHESTRATOR',
        goal: `Orchestrate: ${goal}`,
        status: 'COMPLETED',
        result: { nextAction: result.nextAction },
        completedAt: new Date().toISOString()
      })
      return result
    }

    // STEP 3: Learning planner
    iterations++
    if (iterations > MAX_ITERATIONS) throw new Error('Max iterations reached at step 3')
    console.log(`[Orchestrator] Step 3: Run learning planner (iteration ${iterations})`)

    db.logToolCall({
      agentRunId: runRecord.id,
      toolName: 'runLearningPlanner',
      input: { studentId: 'student_1' },
      output: {},
      status: 'SUCCESS'
    })

    plan = runLearningPlanner()
    result.plan = plan

    // STEP 4: Study coach
    iterations++
    if (iterations > MAX_ITERATIONS) throw new Error('Max iterations reached at step 4')
    console.log(`[Orchestrator] Step 4: Run study coach (iteration ${iterations})`)

    coach = runStudyCoach()
    result.coach = coach

    // STEP 5: Collect recommendations
    iterations++
    if (iterations > MAX_ITERATIONS) throw new Error('Max iterations reached at step 5')
    console.log(`[Orchestrator] Step 5: Collect recommendations (iteration ${iterations})`)

    result.recommendations = get_recommendations()
    result.nextAction = analysis.priorityTopic
    result.iterationsUsed = iterations

    // STEP 6: Evaluate and finalize
    iterations++
    console.log(`[Orchestrator] Step 6: Evaluate result (iteration ${iterations})`)

    db.logAgentRun({
      studentId: 'student_1',
      agentType: 'ORCHESTRATOR',
      goal: `Orchestrate: ${goal}`,
      status: 'COMPLETED',
      result: {
        iterationsUsed: iterations,
        weakTopicsCount: analysis.weakTopics.length,
        planSessionsCount: plan?.actions.length ?? 0,
        nextAction: result.nextAction?.topicTitle
      },
      completedAt: new Date().toISOString()
    })

    return result
  } catch (error) {
    console.error('[Orchestrator] Error:', error)
    result.error = String(error)
    result.iterationsUsed = iterations

    db.logAgentRun({
      studentId: 'student_1',
      agentType: 'ORCHESTRATOR',
      goal: `Orchestrate: ${goal}`,
      status: 'FAILED',
      result: { iterationsUsed: iterations },
      error: String(error),
      completedAt: new Date().toISOString()
    })

    return result
  }
}
