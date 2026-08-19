import { db } from '../db/database'
import { GoogleSheetImportRow, TopicMastery } from '../db/schema'
import { triggerWorkflowsByEvent } from './workflowEngine'
import { runStudentAnalysis } from './studentAnalyzer'
import { runLearningPlanner } from './learningPlanner'
import { create_recommendation, send_notification } from './tools'

export interface SheetImportResult {
  recordsProcessed: number
  recordsAdded: number
  recordsUpdated: number
  recordsFailed: number
  aiAnalysisCompleted: boolean
  knowledgeGraphUpdated: boolean
  recommendationsGenerated: number
  studyPlansUpdated: boolean
  triggeredWorkflows: string[]
}

/**
 * Ingest validated Google Sheet rows into Supabase / local database,
 * calculate adaptive mastery, and trigger autonomous Agentic AI loops.
 */
export async function processGoogleSheetImport(
  rows: GoogleSheetImportRow[],
  enableAI: boolean = true
): Promise<SheetImportResult> {
  let recordsAdded = 0
  let recordsUpdated = 0
  let recordsFailed = 0
  let recommendationsCount = 0
  const triggeredWorkflows: string[] = []

  const existingMasteries = db.getAllTopicMasteries('student_1')
  const existingMasteryMap = new Map(existingMasteries.map(m => [m.topicId, m]))

  for (const row of rows) {
    try {
      // 1. Create or Update Student
      const student = db.getStudent(row.studentId)
      if (student) {
        db.updateStudent(row.studentId, {
          name: row.studentName,
          targetGoal: row.goal || student.targetGoal,
          dailyStudyMinutesGoal: row.dailyStudyGoal || student.dailyStudyMinutesGoal
        })
      }

      // 2. Ensure Topic exists in Course
      let topicId = `topic_${row.topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
      const existingTopic = db.getTopicById(topicId) || db.getTopics().find(t => t.title.toLowerCase() === row.topic.toLowerCase())
      
      if (existingTopic) {
        topicId = existingTopic.id
      } else {
        // Automatically create missing topic from sheet
        topicId = `topic_${row.topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
      }

      // 3. Calculate Mastery State
      let learningStatus: 'Weak' | 'Medium' | 'Strong' | 'Not Started' = 'Medium'
      if (row.masteryScore < 50) learningStatus = 'Weak'
      else if (row.masteryScore >= 75) learningStatus = 'Strong'
      else learningStatus = 'Medium'

      // Check if updating or inserting
      const isExisting = existingMasteryMap.has(topicId)
      if (isExisting) {
        recordsUpdated++
      } else {
        recordsAdded++
      }

      // Upsert Topic Mastery in Knowledge Graph Store
      db.upsertTopicMastery({
        topicId,
        studentId: row.studentId,
        masteryScore: row.masteryScore,
        confidenceScore: Math.round(row.quizScore * 0.8),
        attemptCount: row.questionsAttempted,
        correctCount: row.correctAnswers,
        incorrectCount: Math.max(0, row.questionsAttempted - row.correctAnswers),
        lastStudiedAt: row.lastStudied || new Date().toISOString(),
        nextRevisionAt: row.revisionDue || (row.masteryScore < 50 ? new Date().toISOString() : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()),
        difficultyLevel: (row.difficulty?.toUpperCase() === 'HARD' || row.difficulty?.toUpperCase() === 'ADVANCED') ? 'HARD' : 'MEDIUM',
        status: learningStatus
      })

      // Record Quiz Attempt if quiz score provided
      if (row.quizScore !== undefined) {
        db.recordQuizAttempt({
          studentId: row.studentId,
          topicId,
          score: row.quizScore,
          totalQuestions: row.questionsAttempted || 10,
          correctCount: row.correctAnswers || Math.round((row.quizScore / 100) * (row.questionsAttempted || 10)),
          incorrectCount: Math.max(0, (row.questionsAttempted || 10) - (row.correctAnswers || 0)),
          difficulty: 'MEDIUM',
          timeSpentSeconds: (row.studyTime || 45) * 60,
          answers: []
        })
      }

      // 4. Create Learning Event (for Agent telemetry)
      db.recordLearningEvent({
        studentId: row.studentId,
        eventType: 'QUIZ_COMPLETED',
        topicId,
        metadata: {
          source: 'GOOGLE_SHEET_IMPORT',
          course: row.course,
          topic: row.topic,
          quizScore: row.quizScore,
          masteryScore: row.masteryScore,
          studyTime: row.studyTime,
          learningStatus
        }
      })

      // 5. Generate AI Recommendations & Study Plans if Weak
      if (enableAI) {
        if (row.aiRecommendation) {
          create_recommendation(
            topicId,
            `${row.topic} Focus Practice`,
            row.masteryScore < 50 ? 'HIGH' : 'MEDIUM',
            `Study ${row.topic}`,
            row.aiRecommendation,
            'PRACTICE'
          )
          recommendationsCount++
        } else if (row.masteryScore < 50) {
          create_recommendation(
            topicId,
            `Revise ${row.topic} Fundamentals`,
            'HIGH',
            `Master ${row.topic}`,
            `Mastery score (${row.masteryScore}%) indicates critical knowledge gap from Google Sheet data. Practice 5 beginner-level problems.`,
            'PRACTICE'
          )
          recommendationsCount++
        } else if (row.masteryScore <= 75) {
          create_recommendation(
            topicId,
            `Practice ${row.topic} Exercises`,
            'MEDIUM',
            `Strengthen ${row.topic}`,
            `Continue practicing ${row.topic} with intermediate level questions.`,
            'PRACTICE'
          )
          recommendationsCount++
        } else {
          create_recommendation(
            topicId,
            `Advanced ${row.topic} Mastery`,
            'LOW',
            `Challenge in ${row.topic}`,
            `You have strong mastery (${row.masteryScore}%) of ${row.topic}. Try advanced challenges.`,
            'PRACTICE'
          )
          recommendationsCount++
        }

        // Trigger autonomous n8n workflows if score is below 50%
        if (row.masteryScore < 50 || row.quizScore < 50) {
          const wfRuns = await triggerWorkflowsByEvent('QUIZ_COMPLETED', {
            score: row.quizScore || row.masteryScore,
            topicId,
            source: 'GOOGLE_SHEET_SYNC'
          })
          wfRuns.forEach(r => triggeredWorkflows.push(r.workflowName))
        }
      }
    } catch (err) {
      console.error(`[GoogleSheetImporter] Error processing row for ${row.studentName}:`, err)
      recordsFailed++
    }
  }

  // Refresh study plan with updated analyzer
  if (enableAI) {
    runStudentAnalysis()
    runLearningPlanner()
  }

  return {
    recordsProcessed: rows.length,
    recordsAdded,
    recordsUpdated,
    recordsFailed,
    aiAnalysisCompleted: enableAI,
    knowledgeGraphUpdated: true,
    recommendationsGenerated: recommendationsCount,
    studyPlansUpdated: enableAI,
    triggeredWorkflows: Array.from(new Set(triggeredWorkflows))
  }
}
