import { get_student_profile, get_today_study_plan, analyze_weak_topics, get_learning_history } from './tools'
import { db } from '../db/database'

export interface CoachAdvice {
  greeting: string
  todayFocus: string
  sessionBreakdown: string[]
  consistency: { streak: number; message: string }
  motivationalMessage: string
  recoveryPlan?: string
  weeklyGoal: string
}

export function runStudyCoach(): CoachAdvice {
  db.logAgentRun({
    studentId: 'student_1',
    agentType: 'COACH',
    goal: 'Generate coaching advice and daily plan summary',
    status: 'RUNNING',
    result: {}
  })

  try {
    const profile = get_student_profile()
    const todayPlan = get_today_study_plan()
    const weakTopics = analyze_weak_topics()
    const recentEvents = get_learning_history(30)

    // Greeting based on time of day
    const hour = new Date().getHours()
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    const greeting = `${timeGreeting}, ${profile.name}! 👋`

    // Streak analysis
    const eventDates = new Set(recentEvents.map(e => e.createdAt.split('T')[0]))
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const hadYesterday = eventDates.has(yesterday)
    const streak = profile.currentStreak

    let consistencyMessage = ''
    if (streak >= 7) consistencyMessage = `🔥 Amazing! ${streak}-day streak! You're on fire!`
    else if (streak >= 3) consistencyMessage = `✅ Great consistency! ${streak} days strong. Keep it up!`
    else if (!hadYesterday && streak === 0) consistencyMessage = `⚠️ You missed yesterday. Let's get back on track today!`
    else consistencyMessage = `📚 Study streak: ${streak} day${streak !== 1 ? 's' : ''}. Stay consistent!`

    // Today's focus
    const sessions = todayPlan.sessions
    const pendingSessions = sessions.filter(s => s.status === 'PENDING')
    const completedSessions = sessions.filter(s => s.status === 'COMPLETED')
    const completedMinutes = todayPlan.completedMinutes

    const todayFocus = weakTopics.length > 0
      ? `Your priority today: **${weakTopics[0].topicTitle}** (${weakTopics[0].masteryScore}% mastery)`
      : `Continue strengthening your knowledge across all topics.`

    const sessionBreakdown = sessions.map((s, i) => {
      const status = s.status === 'COMPLETED' ? '✅' : s.status === 'SKIPPED' ? '⏭️' : '⏳'
      return `${status} Session ${i + 1}: ${s.title} — ${s.plannedDurationMinutes} min (${s.scheduledFor})`
    })

    if (sessionBreakdown.length === 0) {
      sessionBreakdown.push('📋 No sessions planned yet. Generate your AI study plan!')
    }

    // Recovery plan if missed sessions
    let recoveryPlan: string | undefined
    if (!hadYesterday && streak === 0) {
      const priorityTopic = weakTopics[0]
      if (priorityTopic) {
        recoveryPlan = `Recovery plan: Start with a 15-min review of ${priorityTopic.topicTitle}, then take a quick quiz to rebuild momentum.`
      }
    }

    // Weekly goal
    const goalMinutes = profile.dailyStudyMinutesGoal * 5 // 5 days a week
    const weeklyGoal = `Weekly target: ${goalMinutes} minutes. You've completed ${completedMinutes} min today.`

    // Motivational message
    const motivationalMessages = [
      `Every minute of study brings you closer to mastery. You've got this! 💪`,
      `Progress over perfection. Keep showing up every day. 🌟`,
      `The best time to study is now. The second best time is still now. ⚡`,
      `Your brain is literally rewiring as you learn. Neuroscience confirms you're growing! 🧠`,
      `${weakTopics.length > 0 ? `${weakTopics[0].topicTitle} is your challenge today — make it your victory!` : 'You\'re doing great!'} 🎯`
    ]
    const motivationalMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]

    db.logAgentRun({
      studentId: 'student_1',
      agentType: 'COACH',
      goal: 'Generate coaching advice',
      status: 'COMPLETED',
      result: { streak, pendingSessions: pendingSessions.length },
      completedAt: new Date().toISOString()
    })

    return {
      greeting,
      todayFocus,
      sessionBreakdown,
      consistency: { streak, message: consistencyMessage },
      motivationalMessage,
      recoveryPlan,
      weeklyGoal
    }
  } catch (error) {
    console.error('[StudyCoach] Error:', error)
    return {
      greeting: 'Hello! 👋',
      todayFocus: 'Focus on your most challenging topic today.',
      sessionBreakdown: ['⏳ Load your study plan to see today\'s sessions'],
      consistency: { streak: 0, message: 'Keep learning every day!' },
      motivationalMessage: 'Every step forward counts. Keep going! 💪',
      weeklyGoal: 'Aim for 45 minutes of focused study today.'
    }
  }
}
