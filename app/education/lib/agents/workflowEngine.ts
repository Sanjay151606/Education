import { db } from '../db/database'
import { Workflow, WorkflowRun, WorkflowLog, WorkflowNode, WorkflowTriggerType } from '../db/schema'
import { runStudentAnalysis } from './studentAnalyzer'
import { runLearningPlanner } from './learningPlanner'
import { generateQuizQuestions } from './assessmentAgent'
import { runTutorAgent } from './tutorAgent'
import { update_topic_mastery, create_recommendation, send_notification, create_study_plan } from './tools'

const MAX_NODE_EXECS = 25

export interface ExecutionContext {
  studentId: string
  triggerType: WorkflowTriggerType
  triggerData: Record<string, any>
  nodeOutputs: Record<string, any>
  currentTopicId?: string
  currentScore?: number
}

/**
 * Execute an individual node based on its type and context.
 */
async function executeNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<{ status: 'SUCCESS' | 'FAILED' | 'SKIPPED'; output: Record<string, any>; branchChoice?: 'true' | 'false' | 'default'; error?: string }> {
  try {
    switch (node.type) {
      case 'TRIGGER':
        return {
          status: 'SUCCESS',
          output: { trigger: context.triggerType, data: context.triggerData }
        }

      case 'AI_ANALYZE_STUDENT': {
        const analysis = runStudentAnalysis()
        return {
          status: 'SUCCESS',
          output: { analysis, weakCount: analysis.weakTopics.length, priorityTopic: analysis.priorityTopic }
        }
      }

      case 'AI_DETECT_WEAK_TOPIC': {
        const topicId = context.triggerData.topicId || context.nodeOutputs['analyze']?.priorityTopic?.topicId || 'topic_recursion'
        const topic = db.getTopicById(topicId)
        const mastery = db.getTopicMastery(topicId, context.studentId)
        return {
          status: 'SUCCESS',
          output: {
            weakTopicId: topicId,
            weakTopicTitle: topic?.title || 'Target Topic',
            masteryScore: mastery?.masteryScore ?? 35,
            identifiedGap: 'Core concept gaps identified from low quiz performance.'
          }
        }
      }

      case 'AI_EVALUATE_ANSWER': {
        const score = context.triggerData.score !== undefined ? context.triggerData.score : (context.currentScore ?? 40)
        const threshold = node.config.threshold ?? 50
        const isBelowThreshold = score < threshold
        return {
          status: 'SUCCESS',
          output: {
            score,
            threshold,
            passed: score >= threshold,
            needsRemediation: isBelowThreshold,
            summary: `Evaluated quiz performance with score ${score}%. ${isBelowThreshold ? 'Remediation triggered.' : 'Mastery criteria satisfied.'}`
          }
        }
      }

      case 'LOGIC_IF': {
        // Evaluate IF branch
        const score = context.triggerData.score !== undefined ? context.triggerData.score : 40
        const threshold = node.config.value ?? 50
        const op = node.config.operator ?? '<'
        
        let conditionMet = false
        if (op === '<') conditionMet = score < threshold
        else if (op === '<=') conditionMet = score <= threshold
        else if (op === '>') conditionMet = score > threshold
        else if (op === '>=') conditionMet = score >= threshold
        else conditionMet = score === threshold

        return {
          status: 'SUCCESS',
          output: { conditionMet, score, threshold, branch: conditionMet ? 'true' : 'false' },
          branchChoice: conditionMet ? 'true' : 'false'
        }
      }

      case 'AI_GENERATE_QUIZ': {
        const topicId = context.triggerData.topicId || 'topic_recursion'
        const count = node.config.count || 3
        const diff = (node.config.difficulty || 'EASY') as 'EASY' | 'MEDIUM' | 'HARD'
        const questions = generateQuizQuestions(topicId, count, diff)
        return {
          status: 'SUCCESS',
          output: { topicId, generatedCount: questions.length, difficulty: diff, questions }
        }
      }

      case 'AI_CREATE_STUDY_PLAN': {
        const plan = runLearningPlanner()
        return {
          status: 'SUCCESS',
          output: { planSummary: plan.summary, sessionCount: plan.actions.length, plan }
        }
      }

      case 'AI_RECOMMEND_TOPIC': {
        const topicId = context.triggerData.topicId || 'topic_recursion'
        const rec = create_recommendation(
          topicId,
          'Recursion Recovery Practice',
          'HIGH',
          'Immediate Remediation Recommended',
          'Quiz score indicated a knowledge gap in recursive call stacks.',
          'PRACTICE'
        )
        return {
          status: 'SUCCESS',
          output: { recommendationId: rec.id, topicId, priority: rec.priority }
        }
      }

      case 'AI_GENERATE_EXPLANATION': {
        const topicId = context.triggerData.topicId || 'topic_recursion'
        const tutor = await runTutorAgent('Explain the key concepts and common pitfalls for this topic.', topicId, [])
        return {
          status: 'SUCCESS',
          output: { explanation: tutor.response, masteryLevel: tutor.masteryLevel }
        }
      }

      case 'AI_SUMMARIZE_CONTENT': {
        const summary = 'Document decomposed into 4 core semantic chunks and indexed for vector search.'
        return {
          status: 'SUCCESS',
          output: { summary, indexedChunks: 4 }
        }
      }

      case 'AI_GENERATE_REVISION': {
        return {
          status: 'SUCCESS',
          output: {
            revisionPoints: ['Review base conditions', 'Inspect stack frames', 'Handle edge cases'],
            durationMinutes: 15
          }
        }
      }

      case 'ACTION_UPDATE_MASTERY': {
        const topicId = context.triggerData.topicId || 'topic_recursion'
        const score = context.triggerData.score ?? 40
        const diff = (context.triggerData.difficulty || 'HARD') as 'EASY' | 'MEDIUM' | 'HARD'
        const updated = update_topic_mastery(topicId, score, diff, 1, 2)
        return {
          status: 'SUCCESS',
          output: { topicId, newMasteryScore: updated.masteryScore, status: updated.status }
        }
      }

      case 'ACTION_CREATE_RECOMMENDATION': {
        const topicId = context.triggerData.topicId || 'topic_recursion'
        const rec = create_recommendation(
          topicId,
          'Recursion Fundamentals & Stack Tracing',
          'HIGH',
          'Review Recursion Fundamentals',
          'Score below 50% triggers automatic recovery plan.',
          'PRACTICE'
        )
        return {
          status: 'SUCCESS',
          output: { recommendation: rec }
        }
      }

      case 'ACTION_SCHEDULE_REVISION': {
        const topicId = context.triggerData.topicId || 'topic_recursion'
        const notif = send_notification(
          'Targeted Revision Scheduled',
          `A specialized recovery session for ${topicId === 'topic_recursion' ? 'Recursion' : topicId} has been scheduled for tomorrow.`,
          'REVISION_DUE'
        )
        return {
          status: 'SUCCESS',
          output: { notificationId: notif.id, scheduledFor: 'Tomorrow' }
        }
      }

      case 'ACTION_SEND_NOTIFICATION': {
        const type = (node.config.type || 'INFO') as 'INFO' | 'SUCCESS' | 'WARNING' | 'REVISION_DUE'
        const notif = send_notification(
          'Automated AI Learning Alert',
          node.config.message || 'Brain Graph Agent has updated your study plan and scheduled recovery practice.',
          type
        )
        return {
          status: 'SUCCESS',
          output: { notification: notif }
        }
      }

      case 'ACTION_CREATE_STUDY_SESSION': {
        const plan = create_study_plan([
          {
            studentId: context.studentId,
            topicId: 'topic_recursion',
            title: 'AI Recovery: Recursion Trace Session',
            plannedDurationMinutes: 20,
            status: 'PENDING',
            sessionType: 'PRACTICE',
            scheduledFor: '2:00 PM'
          }
        ])
        return {
          status: 'SUCCESS',
          output: { studyPlan: plan }
        }
      }

      case 'ACTION_UPDATE_KNOWLEDGE_GRAPH': {
        return {
          status: 'SUCCESS',
          output: { graphUpdated: true, timestamp: new Date().toISOString() }
        }
      }

      default:
        return {
          status: 'SUCCESS',
          output: { executed: node.type }
        }
    }
  } catch (err: any) {
    return {
      status: 'FAILED',
      output: {},
      error: err?.message || String(err)
    }
  }
}

/**
 * Execute a complete workflow DAG from trigger to terminal nodes.
 */
export async function executeWorkflow(
  workflow: Workflow,
  triggerType: WorkflowTriggerType,
  triggerData: Record<string, any>,
  studentId: string = 'student_1'
): Promise<WorkflowRun> {
  const runRecord = db.logWorkflowRun({
    workflowId: workflow.id,
    workflowName: workflow.name,
    status: 'RUNNING',
    triggerType,
    triggerData,
    executedNodeCount: 0,
    logs: []
  })

  const context: ExecutionContext = {
    studentId,
    triggerType,
    triggerData,
    nodeOutputs: {},
    currentTopicId: triggerData.topicId,
    currentScore: triggerData.score
  }

  const logs: WorkflowLog[] = []
  let executedCount = 0
  let isFailed = false
  let failureError = ''

  // Build adjacency map
  const adjMap = new Map<string, { targetId: string; handle?: string }[]>()
  workflow.connections.forEach(conn => {
    const list = adjMap.get(conn.sourceNodeId) || []
    list.push({ targetId: conn.targetNodeId, handle: conn.sourceHandle })
    adjMap.set(conn.sourceNodeId, list)
  })

  // Find entry nodes (TRIGGER or nodes with no incoming edges)
  const incomingCounts = new Map<string, number>()
  workflow.nodes.forEach(n => incomingCounts.set(n.id, 0))
  workflow.connections.forEach(c => {
    incomingCounts.set(c.targetNodeId, (incomingCounts.get(c.targetNodeId) || 0) + 1)
  })

  const queue: string[] = []
  workflow.nodes.forEach(n => {
    if (n.type === 'TRIGGER' || (incomingCounts.get(n.id) === 0)) {
      queue.push(n.id)
    }
  })

  const visited = new Set<string>()

  while (queue.length > 0 && executedCount < MAX_NODE_EXECS) {
    const nodeId = queue.shift()!
    if (visited.has(nodeId)) continue
    visited.add(nodeId)

    const node = workflow.nodes.find(n => n.id === nodeId)
    if (!node) continue

    executedCount++
    const execution = await executeNode(node, context)
    context.nodeOutputs[node.id] = execution.output

    const logEntry: WorkflowLog = {
      id: `log_${Date.now()}_${executedCount}`,
      workflowRunId: runRecord.id,
      nodeId: node.id,
      nodeType: node.type,
      status: execution.status,
      input: { contextTrigger: context.triggerType, nodeConfig: node.config },
      output: execution.output,
      error: execution.error,
      executedAt: new Date().toISOString()
    }
    logs.push(logEntry)

    if (execution.status === 'FAILED') {
      isFailed = true
      failureError = execution.error || 'Node execution failed'
      break
    }

    // Determine next nodes
    const outgoing = adjMap.get(node.id) || []
    for (const edge of outgoing) {
      if (node.type === 'LOGIC_IF') {
        const choice = execution.branchChoice // 'true' or 'false'
        if (edge.handle && edge.handle !== choice) {
          continue // Skip branch not taken
        }
      }
      if (!visited.has(edge.targetId)) {
        queue.push(edge.targetId)
      }
    }
  }

  const finalStatus: 'SUCCESS' | 'FAILED' = isFailed ? 'FAILED' : 'SUCCESS'
  const updatedRun = db.updateWorkflowRun(runRecord.id, {
    status: finalStatus,
    executedNodeCount: executedCount,
    logs,
    completedAt: new Date().toISOString(),
    error: failureError || undefined
  })

  return updatedRun || {
    ...runRecord,
    status: finalStatus,
    executedNodeCount: executedCount,
    logs,
    completedAt: new Date().toISOString(),
    error: failureError || undefined
  }
}

/**
 * Dispatcher: triggers matching active workflows on system events.
 */
export async function triggerWorkflowsByEvent(
  triggerType: WorkflowTriggerType,
  triggerData: Record<string, any>,
  studentId: string = 'student_1'
): Promise<WorkflowRun[]> {
  const matchingWorkflows = db.getWorkflowsByTrigger(triggerType)
  const results: WorkflowRun[] = []

  for (const wf of matchingWorkflows) {
    try {
      const run = await executeWorkflow(wf, triggerType, triggerData, studentId)
      results.push(run)
    } catch (e) {
      console.error(`[WorkflowEngine] Error executing ${wf.name}:`, e)
    }
  }

  return results
}
