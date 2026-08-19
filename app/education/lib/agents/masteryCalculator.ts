import { QuizAttempt, TopicMastery } from '../db/schema'

interface MasteryInput {
  currentMastery: TopicMastery | undefined
  recentAttempts: QuizAttempt[]
  latestScore: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
}

/**
 * Calculates a weighted mastery score based on multiple signals.
 * Weight breakdown:
 *   40% - Recent quiz performance (last 3 attempts, exponentially weighted)
 *   20% - Historical average performance
 *   15% - Difficulty-adjusted score (HARD questions worth more)
 *   15% - Consistency (frequency of study)
 *   10% - Revision/improvement trend
 */
export function calculateMastery(input: MasteryInput): number {
  const { currentMastery, recentAttempts, latestScore, difficulty } = input

  // 1. Recent quiz performance (40%)
  const recent = recentAttempts.slice(0, 3)
  let recentScore: number
  if (recent.length === 0) {
    recentScore = latestScore
  } else {
    const weights = [0.5, 0.3, 0.2]
    let weightedSum = 0
    let totalWeight = 0
    recent.forEach((attempt, i) => {
      const w = weights[i] ?? 0.1
      weightedSum += attempt.score * w
      totalWeight += w
    })
    recentScore = latestScore * 0.6 + (weightedSum / totalWeight) * 0.4
  }

  // 2. Historical average (20%)
  const allScores = [...recentAttempts.map(a => a.score), latestScore]
  const historicalAvg = allScores.reduce((sum, s) => sum + s, 0) / allScores.length

  // 3. Difficulty-adjusted score (15%)
  const difficultyMultiplier: Record<string, number> = { EASY: 0.85, MEDIUM: 1.0, HARD: 1.2 }
  const diffMultiplier = difficultyMultiplier[difficulty] ?? 1.0
  const difficultyAdjustedScore = Math.min(100, latestScore * diffMultiplier)

  // 4. Consistency (15%)
  let consistencyScore = 50
  if (currentMastery && currentMastery.attemptCount > 0) {
    const attemptsBonus = Math.min(30, currentMastery.attemptCount * 5)
    const accuracyRatio = currentMastery.correctCount / Math.max(1, currentMastery.correctCount + currentMastery.incorrectCount)
    consistencyScore = accuracyRatio * 70 + attemptsBonus
  }

  // 5. Improvement trend (10%)
  let trendBonus = 0
  if (recentAttempts.length >= 2) {
    const newest = recentAttempts[0].score
    const previous = recentAttempts[1].score
    trendBonus = newest > previous
      ? Math.min(20, (newest - previous) * 0.5)
      : Math.max(-10, (newest - previous) * 0.2)
  }

  const composite =
    recentScore * 0.40 +
    historicalAvg * 0.20 +
    difficultyAdjustedScore * 0.15 +
    consistencyScore * 0.15 +
    (latestScore + trendBonus) * 0.10

  return Math.round(Math.min(100, Math.max(0, composite)))
}

export function getMasteryStatus(score: number): 'Not Started' | 'Weak' | 'Medium' | 'Strong' {
  if (score >= 80) return 'Strong'
  if (score >= 60) return 'Medium'
  if (score > 0) return 'Weak'
  return 'Not Started'
}

export function getNextDifficultyLevel(
  currentScore: number,
  currentDifficulty: 'EASY' | 'MEDIUM' | 'HARD'
): 'EASY' | 'MEDIUM' | 'HARD' {
  if (currentScore >= 80) {
    if (currentDifficulty === 'EASY') return 'MEDIUM'
    if (currentDifficulty === 'MEDIUM') return 'HARD'
    return 'HARD'
  } else if (currentScore < 50) {
    if (currentDifficulty === 'HARD') return 'MEDIUM'
    if (currentDifficulty === 'MEDIUM') return 'EASY'
    return 'EASY'
  }
  return currentDifficulty
}

export function getNextRevisionDate(masteryScore: number): Date {
  const now = new Date()
  const daysUntilRevision = masteryScore >= 80 ? 7 : masteryScore >= 60 ? 3 : 1
  return new Date(now.getTime() + daysUntilRevision * 24 * 60 * 60 * 1000)
}
