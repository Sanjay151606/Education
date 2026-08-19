import { db } from '../db/database'
import { TopicMastery, Recommendation, LearningSession } from '../db/schema'
import { calculateMastery, getMasteryStatus, getNextRevisionDate } from './masteryCalculator'

const STUDENT_ID = 'student_1'

// ─── Student Profile Tools ────────────────────────────────────────────────────

export function get_student_profile() {
  const student = db.getStudent(STUDENT_ID)
  const masteries = db.getAllTopicMasteries(STUDENT_ID)
  const overallMastery = masteries.length > 0
    ? Math.round(masteries.reduce((sum, m) => sum + m.masteryScore, 0) / masteries.length)
    : 0
  return { ...student, overallMastery }
}

export function get_student_progress() {
  const masteries = db.getAllTopicMasteries(STUDENT_ID)
  const quizAttempts = db.getQuizAttempts(STUDENT_ID)
  const events = db.getLearningEvents(STUDENT_ID, 30)
  const topics = db.getTopics()

  const topicMap = new Map(topics.map(t => [t.id, t]))

  return {
    masteries: masteries.map(m => ({
      ...m,
      topicTitle: topicMap.get(m.topicId)?.title ?? m.topicId
    })),
    quizAttempts: quizAttempts.slice(0, 20),
    recentEvents: events.slice(0, 10),
    totalAttempts: quizAttempts.length,
    averageScore: quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((s, a) => s + a.score, 0) / quizAttempts.length)
      : 0
  }
}

export function get_topic_mastery(topicId: string) {
  const mastery = db.getTopicMastery(topicId, STUDENT_ID)
  const topic = db.getTopicById(topicId)
  return { mastery, topic }
}

export function get_learning_history(limit = 20) {
  return db.getLearningEvents(STUDENT_ID, limit)
}

export function get_quiz_history(topicId?: string) {
  return db.getQuizAttempts(STUDENT_ID, topicId)
}

export function get_pending_assignments() {
  return db.getAssignments(STUDENT_ID).filter(a => a.status === 'PENDING')
}

export function get_upcoming_deadlines() {
  const now = new Date()
  const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  return db.getAssignments(STUDENT_ID).filter(a => {
    const due = new Date(a.dueDate)
    return due >= now && due <= sevenDays && a.status === 'PENDING'
  })
}

export function get_available_learning_content(topicId?: string) {
  const topics = db.getTopics()
  const results = []
  for (const topic of (topicId ? topics.filter(t => t.id === topicId) : topics)) {
    const lessons = db.getLessonsByTopic(topic.id)
    results.push({ topic, lessons })
  }
  return results
}

// ─── Mastery Update Tools ─────────────────────────────────────────────────────

export function update_topic_mastery(topicId: string, latestScore: number, difficulty: 'EASY' | 'MEDIUM' | 'HARD', correctCount: number, incorrectCount: number) {
  const current = db.getTopicMastery(topicId, STUDENT_ID)
  const recentAttempts = db.getQuizAttempts(STUDENT_ID, topicId).slice(0, 5)

  const newMasteryScore = calculateMastery({
    currentMastery: current,
    recentAttempts,
    latestScore,
    difficulty
  })

  const status = getMasteryStatus(newMasteryScore)
  const nextRevisionAt = getNextRevisionDate(newMasteryScore)

  return db.upsertTopicMastery({
    topicId,
    studentId: STUDENT_ID,
    masteryScore: newMasteryScore,
    confidenceScore: Math.round(latestScore * 0.8),
    attemptCount: (current?.attemptCount ?? 0) + 1,
    correctCount: (current?.correctCount ?? 0) + correctCount,
    incorrectCount: (current?.incorrectCount ?? 0) + incorrectCount,
    lastStudiedAt: new Date().toISOString(),
    nextRevisionAt: nextRevisionAt.toISOString(),
    difficultyLevel: difficulty,
    status
  })
}

// ─── Recommendation Tools ─────────────────────────────────────────────────────

export function get_recommendations() {
  return db.getRecommendations(STUDENT_ID)
}

export function create_recommendation(
  topicId: string,
  topicTitle: string,
  priority: 'HIGH' | 'MEDIUM' | 'LOW',
  title: string,
  reason: string,
  actionType: 'LESSON' | 'QUIZ' | 'REVISION' | 'PRACTICE'
): Recommendation {
  const rec: Recommendation = {
    id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    studentId: STUDENT_ID,
    topicId,
    topicTitle,
    priority,
    title,
    reason,
    actionType,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }
  const existing = db.getRecommendations(STUDENT_ID).filter(r => r.status === 'ACTIVE')
  db.setRecommendations([rec, ...existing.filter(r => r.topicId !== topicId).slice(0, 4)])
  return rec
}

// ─── Study Plan Tools ─────────────────────────────────────────────────────────

export function get_today_study_plan() {
  return db.getTodayStudyPlan(STUDENT_ID)
}

export function update_session_status(sessionId: string, status: LearningSession['status']) {
  return db.updateSessionStatus(sessionId, status, STUDENT_ID)
}

export function create_study_plan(sessions: Omit<LearningSession, 'id' | 'completedAt'>[]) {
  const today = new Date().toISOString().split('T')[0]
  const totalMinutes = sessions.reduce((sum, s) => sum + s.plannedDurationMinutes, 0)

  const plan = {
    id: `plan_${today}_${Date.now()}`,
    studentId: STUDENT_ID,
    date: today,
    goalMinutes: totalMinutes,
    completedMinutes: 0,
    summary: 'AI-generated personalized study plan based on current mastery analysis.',
    status: 'ACTIVE' as const,
    sessions: sessions.map((s, i) => ({
      ...s,
      id: `sess_${Date.now()}_${i}`,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  return plan
}

// ─── RAG / Content Search ─────────────────────────────────────────────────────

export function search_learning_content(query: string) {
  return db.searchDocumentChunks(query, 4)
}

// ─── Learning Event Tools ─────────────────────────────────────────────────────

export function record_learning_activity(
  eventType: 'QUIZ_COMPLETED' | 'LESSON_VIEWED' | 'PRACTICE_SUBMITTED' | 'CHAT_INTERACTION' | 'STUDY_SESSION_COMPLETED' | 'REVISION_COMPLETED',
  topicId: string,
  metadata: Record<string, unknown>
) {
  return db.recordLearningEvent({ studentId: STUDENT_ID, eventType, topicId, metadata })
}

// ─── Notification Tools ───────────────────────────────────────────────────────

export function send_notification(title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'REVISION_DUE') {
  return db.addNotification({ studentId: STUDENT_ID, title, message, type, isRead: false })
}

// ─── Analysis Helpers ─────────────────────────────────────────────────────────

export function analyze_weak_topics() {
  const masteries = db.getAllTopicMasteries(STUDENT_ID)
  const topics = db.getTopics()
  const topicMap = new Map(topics.map(t => [t.id, t]))

  return masteries
    .filter(m => m.masteryScore < 60)
    .sort((a, b) => a.masteryScore - b.masteryScore)
    .map(m => ({ ...m, topicTitle: topicMap.get(m.topicId)?.title ?? m.topicId }))
}

export function analyze_strong_topics() {
  const masteries = db.getAllTopicMasteries(STUDENT_ID)
  const topics = db.getTopics()
  const topicMap = new Map(topics.map(t => [t.id, t]))

  return masteries
    .filter(m => m.masteryScore >= 80)
    .sort((a, b) => b.masteryScore - a.masteryScore)
    .map(m => ({ ...m, topicTitle: topicMap.get(m.topicId)?.title ?? m.topicId }))
}

export function recommend_next_topic(): { topicId: string; topicTitle: string; masteryScore: number; reason: string } | null {
  const masteries = db.getAllTopicMasteries(STUDENT_ID)
  const topics = db.getTopics()
  const topicMap = new Map(topics.map(t => [t.id, t]))

  if (masteries.length === 0) return null

  // Priority: lowest mastery, most recently attempted (active topic)
  const sorted = [...masteries].sort((a, b) => {
    // Primary: mastery score (ascending)
    const scoreDiff = a.masteryScore - b.masteryScore
    if (Math.abs(scoreDiff) > 10) return scoreDiff
    // Secondary: last studied (more recent first)
    const aTime = a.lastStudiedAt ? new Date(a.lastStudiedAt).getTime() : 0
    const bTime = b.lastStudiedAt ? new Date(b.lastStudiedAt).getTime() : 0
    return bTime - aTime
  })

  const priority = sorted[0]
  if (!priority) return null

  const topic = topicMap.get(priority.topicId)
  return {
    topicId: priority.topicId,
    topicTitle: topic?.title ?? priority.topicId,
    masteryScore: priority.masteryScore,
    reason: priority.masteryScore < 50
      ? `Low mastery (${priority.masteryScore}%) requires immediate attention`
      : `Mastery (${priority.masteryScore}%) is below target — needs improvement`
  }
}
