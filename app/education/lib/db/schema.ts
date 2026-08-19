export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD'
export type AgentType = 'ANALYZER' | 'TUTOR' | 'ASSESSMENT' | 'PLANNER' | 'COACH' | 'ORCHESTRATOR'
export type EventType = 'QUIZ_COMPLETED' | 'LESSON_VIEWED' | 'PRACTICE_SUBMITTED' | 'CHAT_INTERACTION' | 'STUDY_SESSION_COMPLETED' | 'REVISION_COMPLETED'

export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'admin' | 'instructor'
  avatar?: string
  createdAt: string
}

export interface Student {
  id: string
  userId: string
  name: string
  gradeOrLevel: string
  targetGoal: string
  dailyStudyMinutesGoal: number
  currentStreak: number
  totalPoints: number
  preferredLearningStyle: 'visual' | 'code' | 'reading' | 'audio'
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  title: string
  slug: string
  category: string
  level: DifficultyLevel | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  description: string
  icon: string
  duration: string
  isFree: boolean
  rating: number
  studentsCount: number
  createdAt: string
}

export interface Topic {
  id: string
  courseId: string
  title: string
  slug: string
  category: 'core' | 'skill' | 'assessment' | 'achievement' | 'data_structures' | 'algorithms' | 'communication'
  description: string
  orderIndex: number
  prerequisites: string[] // topic IDs
  difficulty: DifficultyLevel
  x?: number
  y?: number
}

export interface Lesson {
  id: string
  topicId: string
  title: string
  content: string
  durationMinutes: number
  type: 'video' | 'reading' | 'interactive' | 'code'
  videoUrl?: string
  orderIndex: number
}

export interface Question {
  id: string
  topicId: string
  type: 'mcq' | 'code' | 'short_answer'
  difficulty: DifficultyLevel
  prompt: string
  options?: string[]
  correctAnswer: string
  explanation: string
  codeSnippet?: string
  hints?: string[]
}

export interface QuizAttempt {
  id: string
  studentId: string
  topicId: string
  score: number // percentage 0 - 100
  totalQuestions: number
  correctCount: number
  incorrectCount: number
  difficulty: DifficultyLevel
  timeSpentSeconds: number
  answers: {
    questionId: string
    selectedAnswer: string
    isCorrect: boolean
    explanation: string
  }[]
  createdAt: string
}

export interface TopicMastery {
  id: string
  studentId: string
  topicId: string
  masteryScore: number // 0 - 100
  confidenceScore: number // 0 - 100
  attemptCount: number
  correctCount: number
  incorrectCount: number
  lastStudiedAt: string | null
  nextRevisionAt: string | null
  difficultyLevel: DifficultyLevel
  status: 'Not Started' | 'Weak' | 'Medium' | 'Strong'
  updatedAt: string
}

export interface LearningSession {
  id: string
  studentId: string
  topicId: string
  title: string
  plannedDurationMinutes: number
  actualDurationMinutes?: number
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'RESCHEDULED'
  sessionType: 'LESSON' | 'PRACTICE' | 'QUIZ' | 'REVISION'
  scheduledFor: string
  completedAt?: string
  notes?: string
}

export interface StudyPlan {
  id: string
  studentId: string
  date: string
  goalMinutes: number
  completedMinutes: number
  summary: string
  status: 'ACTIVE' | 'COMPLETED' | 'MISSED'
  sessions: LearningSession[]
  createdAt: string
  updatedAt: string
}

export interface Recommendation {
  id: string
  studentId: string
  topicId: string
  topicTitle: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  reason: string
  actionType: 'LESSON' | 'QUIZ' | 'REVISION' | 'PRACTICE'
  status: 'ACTIVE' | 'DISMISSED' | 'COMPLETED'
  createdAt: string
}

export interface Assignment {
  id: string
  studentId: string
  title: string
  courseId: string
  dueDate: string
  status: 'PENDING' | 'SUBMITTED' | 'GRADED'
  grade?: number
}

export interface Notification {
  id: string
  studentId: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'REVISION_DUE'
  isRead: boolean
  createdAt: string
}

export interface LearningEvent {
  id: string
  studentId: string
  eventType: EventType
  topicId: string
  metadata: Record<string, any>
  createdAt: string
}

export interface AgentRun {
  id: string
  studentId: string
  agentType: AgentType
  goal: string
  status: 'RUNNING' | 'COMPLETED' | 'FAILED'
  result: Record<string, any>
  error?: string
  createdAt: string
  completedAt?: string
}

export interface AgentToolCall {
  id: string
  agentRunId: string
  toolName: string
  input: Record<string, any>
  output: Record<string, any>
  status: 'SUCCESS' | 'ERROR'
  createdAt: string
}

export interface Document {
  id: string
  title: string
  source: string
  category: string
  chunkCount: number
  createdAt: string
}

export interface DocumentChunk {
  id: string
  documentId: string
  content: string
  metadata: Record<string, any>
  embedding?: number[]
}

// ─── Workflow Engine Types (n8n-style) ─────────────────────────────────────────

export type WorkflowTriggerType =
  | 'STUDENT_LOGIN'
  | 'QUIZ_COMPLETED'
  | 'LESSON_COMPLETED'
  | 'LOW_QUIZ_SCORE'
  | 'LOW_MASTERY'
  | 'ASSIGNMENT_CREATED'
  | 'ASSIGNMENT_DUE_SOON'
  | 'REVISION_DUE'
  | 'STREAK_BROKEN'
  | 'NEW_COURSE_ADDED'
  | 'NEW_DOCUMENT_UPLOADED'
  | 'STUDY_SESSION_COMPLETED'
  | 'GOAL_CREATED'
  | 'MANUAL'

export type WorkflowNodeType =
  | 'TRIGGER'
  | 'AI_ANALYZE_STUDENT'
  | 'AI_DETECT_WEAK_TOPIC'
  | 'AI_GENERATE_EXPLANATION'
  | 'AI_GENERATE_QUIZ'
  | 'AI_EVALUATE_ANSWER'
  | 'AI_CREATE_STUDY_PLAN'
  | 'AI_RECOMMEND_TOPIC'
  | 'AI_SUMMARIZE_CONTENT'
  | 'AI_GENERATE_REVISION'
  | 'AI_ANALYZE_LEARNING_RISK'
  | 'ACTION_UPDATE_MASTERY'
  | 'ACTION_CREATE_RECOMMENDATION'
  | 'ACTION_CREATE_STUDY_SESSION'
  | 'ACTION_SCHEDULE_REVISION'
  | 'ACTION_SEND_NOTIFICATION'
  | 'ACTION_UPDATE_KNOWLEDGE_GRAPH'
  | 'ACTION_GENERATE_REPORT'
  | 'ACTION_SAVE_LEARNING_EVENT'
  | 'LOGIC_IF'
  | 'LOGIC_AND'
  | 'LOGIC_OR'
  | 'LOGIC_CONDITION'
  | 'LOGIC_DELAY'
  | 'LOGIC_SCHEDULE'

export interface WorkflowNode {
  id: string
  type: WorkflowNodeType
  label: string
  config: Record<string, any>
  x: number
  y: number
}

export interface WorkflowConnection {
  id: string
  sourceNodeId: string
  targetNodeId: string
  sourceHandle?: 'true' | 'false' | 'default' | string
}

export interface Workflow {
  id: string
  name: string
  description: string
  trigger: WorkflowTriggerType
  isActive: boolean
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  createdAt: string
  updatedAt: string
}

export interface WorkflowLog {
  id: string
  workflowRunId: string
  nodeId: string
  nodeType: string
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED'
  input: Record<string, any>
  output: Record<string, any>
  error?: string
  executedAt: string
}

export interface WorkflowRun {
  id: string
  workflowId: string
  workflowName: string
  status: 'SUCCESS' | 'RUNNING' | 'FAILED'
  triggerType: WorkflowTriggerType
  triggerData: Record<string, any>
  executedNodeCount: number
  logs: WorkflowLog[]
  startedAt: string
  completedAt?: string
  error?: string
}
