import {
  analyze_weak_topics,
  get_upcoming_deadlines,
  get_student_profile,
  recommend_next_topic,
  create_recommendation,
  create_study_plan,
  get_today_study_plan,
  send_notification
} from './tools'
import { db } from '../db/database'
import { LearningSession } from '../db/schema'

export interface PlanAction {
  topicId: string
  topicTitle: string
  sessionType: 'LESSON' | 'QUIZ' | 'REVISION' | 'PRACTICE'
  durationMinutes: number
  scheduledFor: string
  reason: string
}

export interface LearningPlan {
  priorityTopic: { topicId: string; topicTitle: string; masteryScore: number; reason: string } | null
  actions: PlanAction[]
  summary: string
  totalMinutes: number
  studyPlanId: string
}

export function runLearningPlanner(): LearningPlan {
  db.logAgentRun({
    studentId: 'student_1',
    agentType: 'PLANNER',
    goal: 'Create personalized daily learning plan',
    status: 'RUNNING',
    result: {}
  })

  try {
    const profile = get_student_profile()
    const weakTopics = analyze_weak_topics()
    const deadlines = get_upcoming_deadlines()
    const priorityTopic = recommend_next_topic()

    const actions: PlanAction[] = []
    const times = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM']
    let timeIndex = 0

    // 1. Priority: lowest mastery topic — lesson + quiz
    if (priorityTopic) {
      actions.push({
        topicId: priorityTopic.topicId,
        topicTitle: priorityTopic.topicTitle,
        sessionType: 'LESSON',
        durationMinutes: 20,
        scheduledFor: times[timeIndex++] ?? '9:00 AM',
        reason: priorityTopic.reason
      })
      actions.push({
        topicId: priorityTopic.topicId,
        topicTitle: priorityTopic.topicTitle,
        sessionType: 'QUIZ',
        durationMinutes: 15,
        scheduledFor: times[timeIndex++] ?? '9:30 AM',
        reason: `Test understanding of ${priorityTopic.topicTitle} after lesson`
      })

      // Create/update recommendation
      create_recommendation(
        priorityTopic.topicId,
        priorityTopic.topicTitle,
        'HIGH',
        `Study ${priorityTopic.topicTitle} Today`,
        priorityTopic.reason,
        'LESSON'
      )
    }

    // 2. Second weak topic — revision
    if (weakTopics.length > 1) {
      const secondWeak = weakTopics[1]
      actions.push({
        topicId: secondWeak.topicId,
        topicTitle: secondWeak.topicTitle,
        sessionType: 'REVISION',
        durationMinutes: 15,
        scheduledFor: times[timeIndex++] ?? '10:00 AM',
        reason: `Mastery at ${secondWeak.masteryScore}% — scheduled revision`
      })
    }

    // 3. Deadline-based topics
    for (const deadline of deadlines.slice(0, 1)) {
      if (timeIndex < times.length) {
        const topic = db.getTopics().find(t => t.courseId === deadline.courseId)
        if (topic) {
          actions.push({
            topicId: topic.id,
            topicTitle: topic.title,
            sessionType: 'PRACTICE',
            durationMinutes: 20,
            scheduledFor: times[timeIndex++] ?? '10:30 AM',
            reason: `Assignment "${deadline.title}" due ${deadline.dueDate}`
          })
        }
      }
    }

    // Ensure minimum 2 sessions
    if (actions.length < 2 && weakTopics.length > 0) {
      const fallback = weakTopics[0]
      actions.push({
        topicId: fallback.topicId,
        topicTitle: fallback.topicTitle,
        sessionType: 'PRACTICE',
        durationMinutes: 20,
        scheduledFor: times[timeIndex++] ?? '10:00 AM',
        reason: `Practice to improve ${fallback.masteryScore}% mastery`
      })
    }

    // Convert to LearningSession format
    const sessions: Omit<LearningSession, 'id' | 'completedAt'>[] = actions.map(a => ({
      studentId: 'student_1',
      topicId: a.topicId,
      title: `${a.topicTitle} — ${a.sessionType === 'LESSON' ? 'Learn' : a.sessionType === 'QUIZ' ? 'Quiz' : a.sessionType === 'REVISION' ? 'Revision' : 'Practice'}`,
      plannedDurationMinutes: a.durationMinutes,
      status: 'PENDING' as const,
      sessionType: a.sessionType,
      scheduledFor: a.scheduledFor
    }))

    const plan = create_study_plan(sessions)
    const totalMinutes = actions.reduce((sum, a) => sum + a.durationMinutes, 0)

    const summary = priorityTopic
      ? `Today's focus: ${priorityTopic.topicTitle} (${priorityTopic.masteryScore}% → target 60%+). ${actions.length} sessions planned for ${totalMinutes} min.`
      : `${actions.length} study sessions planned covering your weak areas.`

    // Send notification if new plan generated
    send_notification(
      'Today\'s AI Study Plan Ready',
      `${actions.length} sessions planned: ${totalMinutes} minutes. Priority: ${priorityTopic?.topicTitle ?? 'Review weak topics'}`,
      'INFO'
    )

    db.logAgentRun({
      studentId: 'student_1',
      agentType: 'PLANNER',
      goal: 'Create personalized daily learning plan',
      status: 'COMPLETED',
      result: { sessionsCount: sessions.length, totalMinutes, priorityTopic },
      completedAt: new Date().toISOString()
    })

    return { priorityTopic, actions, summary, totalMinutes, studyPlanId: plan.id }
  } catch (error) {
    console.error('[LearningPlanner] Error:', error)
    db.logAgentRun({
      studentId: 'student_1',
      agentType: 'PLANNER',
      goal: 'Create personalized daily learning plan',
      status: 'FAILED',
      result: {},
      error: String(error),
      completedAt: new Date().toISOString()
    })
    throw error
  }
}
