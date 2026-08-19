import {
  analyze_weak_topics,
  analyze_strong_topics,
  get_quiz_history,
  get_learning_history,
  get_student_profile,
  recommend_next_topic
} from './tools'
import { db } from '../db/database'

export interface StudentAnalysis {
  studentName: string
  overallMastery: number
  weakTopics: { topicId: string; topicTitle: string; masteryScore: number; status: string }[]
  strongTopics: { topicId: string; topicTitle: string; masteryScore: number; status: string }[]
  neglectedTopics: { topicId: string; topicTitle: string; masteryScore: number }[]
  repeatedMistakes: { topicId: string; topicTitle: string; incorrectCount: number }[]
  learningPatterns: {
    totalQuizAttempts: number
    averageScore: number
    studyFrequency: string
    mostActiveArea: string
  }
  recommendedAction: string
  priorityTopic: { topicId: string; topicTitle: string; masteryScore: number; reason: string } | null
  analysisTimestamp: string
}

export function runStudentAnalysis(): StudentAnalysis {
  const agentRunId = db.logAgentRun({
    studentId: 'student_1',
    agentType: 'ANALYZER',
    goal: 'Analyze student performance and identify weak/strong topics',
    status: 'RUNNING',
    result: {}
  })

  try {
    // Gather data via tools
    const profile = get_student_profile()
    const weakTopics = analyze_weak_topics()
    const strongTopics = analyze_strong_topics()
    const quizHistory = get_quiz_history()
    const learningEvents = get_learning_history(50)

    // Identify neglected topics (not studied in 7+ days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const allMasteries = db.getAllTopicMasteries('student_1')
    const topics = db.getTopics()
    const topicMap = new Map(topics.map(t => [t.id, t]))

    const neglectedTopics = allMasteries
      .filter(m => {
        if (!m.lastStudiedAt) return true
        return new Date(m.lastStudiedAt) < sevenDaysAgo
      })
      .map(m => ({
        topicId: m.topicId,
        topicTitle: topicMap.get(m.topicId)?.title ?? m.topicId,
        masteryScore: m.masteryScore
      }))

    // Identify repeated mistakes (high incorrectCount)
    const repeatedMistakes = allMasteries
      .filter(m => m.incorrectCount > 3)
      .sort((a, b) => b.incorrectCount - a.incorrectCount)
      .slice(0, 5)
      .map(m => ({
        topicId: m.topicId,
        topicTitle: topicMap.get(m.topicId)?.title ?? m.topicId,
        incorrectCount: m.incorrectCount
      }))

    // Learning patterns
    const avgScore = quizHistory.length > 0
      ? Math.round(quizHistory.reduce((s, a) => s + a.score, 0) / quizHistory.length)
      : 0

    // Study frequency from events
    const eventDates = new Set(learningEvents.map(e => e.createdAt.split('T')[0]))
    const studyFrequency = eventDates.size >= 5
      ? 'Daily learner'
      : eventDates.size >= 3
      ? 'Regular learner'
      : 'Occasional learner'

    // Most active area
    const topicCounts: Record<string, number> = {}
    learningEvents.forEach(e => {
      topicCounts[e.topicId] = (topicCounts[e.topicId] ?? 0) + 1
    })
    const mostActiveTopicId = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    const mostActiveArea = mostActiveTopicId
      ? (topicMap.get(mostActiveTopicId)?.title ?? mostActiveTopicId)
      : 'No recent activity'

    const priorityTopic = recommend_next_topic()

    const recommendedAction = priorityTopic
      ? weakTopics.length > 0
        ? `Focus on ${priorityTopic.topicTitle} — currently ${priorityTopic.masteryScore}% mastery. Take a lesson then practice quiz.`
        : `Great progress! Continue challenging yourself with advanced ${priorityTopic.topicTitle} problems.`
      : 'Explore new topics to expand your knowledge graph.'

    const analysis: StudentAnalysis = {
      studentName: profile.name,
      overallMastery: profile.overallMastery,
      weakTopics: weakTopics.slice(0, 5).map(t => ({
        topicId: t.topicId,
        topicTitle: t.topicTitle,
        masteryScore: t.masteryScore,
        status: t.status
      })),
      strongTopics: strongTopics.slice(0, 5).map(t => ({
        topicId: t.topicId,
        topicTitle: t.topicTitle,
        masteryScore: t.masteryScore,
        status: t.status
      })),
      neglectedTopics: neglectedTopics.slice(0, 5),
      repeatedMistakes,
      learningPatterns: {
        totalQuizAttempts: quizHistory.length,
        averageScore: avgScore,
        studyFrequency,
        mostActiveArea
      },
      recommendedAction,
      priorityTopic,
      analysisTimestamp: new Date().toISOString()
    }

    // Update agent run log
    db.logAgentRun({
      studentId: 'student_1',
      agentType: 'ANALYZER',
      goal: 'Analyze student performance and identify weak/strong topics',
      status: 'COMPLETED',
      result: { weakTopicsCount: weakTopics.length, strongTopicsCount: strongTopics.length, priorityTopic },
      completedAt: new Date().toISOString()
    })

    return analysis
  } catch (error) {
    console.error('[StudentAnalyzer] Error:', error)
    db.logAgentRun({
      studentId: 'student_1',
      agentType: 'ANALYZER',
      goal: 'Analyze student performance',
      status: 'FAILED',
      result: {},
      error: String(error),
      completedAt: new Date().toISOString()
    })
    throw error
  }
}
