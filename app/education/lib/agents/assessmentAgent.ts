import { get_topic_mastery, update_topic_mastery, record_learning_activity } from './tools'
import { getNextDifficultyLevel } from './masteryCalculator'
import { db } from '../db/database'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent'

export interface GeneratedQuestion {
  id: string
  type: 'mcq' | 'short_answer'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  prompt: string
  options?: string[]
  correctAnswer: string
  explanation: string
}

export interface QuizResult {
  topicId: string
  topicTitle: string
  score: number
  totalQuestions: number
  correctCount: number
  incorrectCount: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  newMastery: number
  previousMastery: number
  nextDifficulty: 'EASY' | 'MEDIUM' | 'HARD'
  answeredQuestions: {
    question: string
    studentAnswer: string
    correctAnswer: string
    isCorrect: boolean
    explanation: string
  }[]
  adaptiveMessage: string
}

export async function generateQuiz(
  topicId: string,
  count: number = 5
): Promise<GeneratedQuestion[]> {
  const apiKey = process.env.GEMINI_API_KEY
  const topic = db.getTopicById(topicId)
  const mastery = db.getTopicMastery(topicId, 'student_1')

  if (!apiKey) {
    // Fallback: use questions from DB
    const dbQuestions = db.getQuestionsByTopic(topicId)
    return dbQuestions.slice(0, count).map(q => ({
      id: q.id,
      type: q.type === 'code' ? 'short_answer' : q.type,
      difficulty: q.difficulty,
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }))
  }

  // Adaptive difficulty based on current mastery
  let difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM'
  if (mastery) {
    if (mastery.masteryScore < 50) difficulty = 'EASY'
    else if (mastery.masteryScore >= 80) difficulty = 'HARD'
    else difficulty = 'MEDIUM'
  }

  const topicTitle = topic?.title ?? topicId
  const diffDesc = {
    EASY: 'foundational concepts, simple recall, basic application',
    MEDIUM: 'applied concepts, moderate problem-solving, pattern recognition',
    HARD: 'complex analysis, edge cases, optimization, deep understanding'
  }[difficulty]

  const prompt = `Generate ${count} quiz questions about "${topicTitle}" for a student assessment.

Difficulty: ${difficulty} (${diffDesc})
Current student mastery: ${mastery?.masteryScore ?? 50}%

Return ONLY valid JSON array. No markdown, no explanation, just the JSON:
[
  {
    "type": "mcq",
    "prompt": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation of why this is correct"
  }
]

Rules:
- All questions must be about ${topicTitle}
- Exactly ${count} questions
- Each MCQ must have exactly 4 options
- correctAnswer must exactly match one of the options
- Make explanations educational and helpful
- Vary question styles (definition, application, analysis)`

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 2000 }
      })
    })

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error('No JSON array found in response')

    const rawQuestions = JSON.parse(jsonMatch[0])
    return rawQuestions.slice(0, count).map((q: any, i: number) => ({
      id: `gen_q_${Date.now()}_${i}`,
      type: 'mcq' as const,
      difficulty,
      prompt: q.prompt ?? q.question ?? '',
      options: q.options ?? [],
      correctAnswer: q.correctAnswer ?? q.correct_answer ?? '',
      explanation: q.explanation ?? ''
    }))
  } catch (error) {
    console.error('[AssessmentAgent] Quiz generation error:', error)
    // Fallback to DB questions
    const dbQ = db.getQuestionsByTopic(topicId).slice(0, count)
    return dbQ.map(q => ({
      id: q.id,
      type: 'mcq' as const,
      difficulty: q.difficulty,
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    }))
  }
}

export async function evaluateQuiz(
  topicId: string,
  answers: { questionId: string; question: string; selectedAnswer: string; correctAnswer: string; explanation: string }[]
): Promise<QuizResult> {
  const topic = db.getTopicById(topicId)
  const topicTitle = topic?.title ?? topicId
  const previousMastery = db.getTopicMastery(topicId, 'student_1')

  const results = answers.map(a => ({
    question: a.question,
    studentAnswer: a.selectedAnswer,
    correctAnswer: a.correctAnswer,
    isCorrect: a.selectedAnswer.trim().toLowerCase() === a.correctAnswer.trim().toLowerCase(),
    explanation: a.explanation
  }))

  const correctCount = results.filter(r => r.isCorrect).length
  const incorrectCount = results.length - correctCount
  const score = Math.round((correctCount / results.length) * 100)

  const difficulty: 'EASY' | 'MEDIUM' | 'HARD' =
    (answers[0] as any)?.difficulty ?? (previousMastery?.difficultyLevel ?? 'MEDIUM')

  // Update mastery in database
  const updatedMastery = update_topic_mastery(topicId, score, difficulty, correctCount, incorrectCount)

  // Record quiz attempt
  db.recordQuizAttempt({
    studentId: 'student_1',
    topicId,
    score,
    totalQuestions: answers.length,
    correctCount,
    incorrectCount,
    difficulty,
    timeSpentSeconds: 0,
    answers: answers.map(a => ({
      questionId: a.questionId,
      selectedAnswer: a.selectedAnswer,
      isCorrect: a.selectedAnswer.trim().toLowerCase() === a.correctAnswer.trim().toLowerCase(),
      explanation: a.explanation
    }))
  })

  record_learning_activity('QUIZ_COMPLETED', topicId, { score, difficulty, correctCount, incorrectCount })

  const nextDifficulty = getNextDifficultyLevel(score, difficulty)
  const previousScore = previousMastery?.masteryScore ?? 0

  let adaptiveMessage = ''
  if (score >= 80) {
    adaptiveMessage = `Excellent work! Your mastery of ${topicTitle} has improved to ${updatedMastery.masteryScore}%. Ready for harder challenges?`
  } else if (score >= 60) {
    adaptiveMessage = `Good progress on ${topicTitle}! Keep practicing to strengthen your understanding.`
  } else if (score >= 40) {
    adaptiveMessage = `You're building your foundation in ${topicTitle}. Review the explanations for incorrect answers and try again.`
  } else {
    adaptiveMessage = `${topicTitle} needs more attention. Let's start with the fundamentals — your AI tutor can help explain the concepts.`
  }

  return {
    topicId,
    topicTitle,
    score,
    totalQuestions: answers.length,
    correctCount,
    incorrectCount,
    difficulty,
    newMastery: updatedMastery.masteryScore,
    previousMastery: previousScore,
    nextDifficulty,
    answeredQuestions: results,
    adaptiveMessage
  }
}

// Aliases for workflow engine and API handlers
export function generateQuizQuestions(
  topicId: string,
  count: number = 5,
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
) {
  const dbQuestions = db.getQuestionsByTopic(topicId, difficulty)
  if (dbQuestions.length > 0) {
    return dbQuestions.slice(0, count)
  }
  return db.getQuestionsByTopic('topic_recursion').slice(0, count)
}

export function evaluateQuizSubmission(
  topicId: string,
  answers: any[],
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM',
  timeSpentSeconds: number = 60
) {
  const questions = db.getQuestionsByTopic(topicId)
  const qMap = new Map(questions.map(q => [q.id, q]))

  let correctCount = 0
  const evaluatedAnswers = answers.map(ans => {
    const q = qMap.get(ans.questionId)
    const isCorrect = q ? (ans.selectedAnswer?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) : false
    if (isCorrect) correctCount++
    return {
      questionId: ans.questionId,
      selectedAnswer: ans.selectedAnswer || '',
      isCorrect,
      explanation: q?.explanation || 'Explanation generated by Brain Graph engine.'
    }
  })

  const totalQuestions = answers.length || 1
  const score = Math.round((correctCount / totalQuestions) * 100)
  const incorrectCount = totalQuestions - correctCount

  const updatedMastery = update_topic_mastery(topicId, score, difficulty, correctCount, incorrectCount)

  db.recordQuizAttempt({
    studentId: 'student_1',
    topicId,
    score,
    totalQuestions,
    correctCount,
    incorrectCount,
    difficulty,
    timeSpentSeconds,
    answers: evaluatedAnswers
  })

  return {
    topicId,
    score,
    totalQuestions,
    correctCount,
    incorrectCount,
    difficulty,
    newMasteryScore: updatedMastery.masteryScore,
    feedback: score >= 70
      ? `Solid work! Mastery elevated to ${updatedMastery.masteryScore}%.`
      : `Knowledge gap identified (${score}% score). Autonomous recovery plan dispatched.`
  }
}

