import fs from 'fs'
import path from 'path'
import {
  Student,
  Course,
  Topic,
  Lesson,
  Question,
  QuizAttempt,
  TopicMastery,
  LearningSession,
  StudyPlan,
  Recommendation,
  Assignment,
  Notification,
  LearningEvent,
  AgentRun,
  AgentToolCall,
  Document,
  DocumentChunk,
  Workflow,
  WorkflowRun,
  WorkflowLog,
  GoogleIntegration,
  GoogleSheetSync
} from './schema'
import {
  INITIAL_STUDENT,
  INITIAL_COURSES,
  INITIAL_TOPICS,
  INITIAL_MASTERY,
  INITIAL_LESSONS,
  INITIAL_QUESTIONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_STUDY_PLAN,
  INITIAL_WORKFLOWS
} from './seed'

interface DBData {
  students: Student[]
  courses: Course[]
  topics: Topic[]
  lessons: Lesson[]
  questions: Question[]
  quizAttempts: QuizAttempt[]
  topicMasteries: TopicMastery[]
  studyPlans: StudyPlan[]
  recommendations: Recommendation[]
  assignments: Assignment[]
  notifications: Notification[]
  learningEvents: LearningEvent[]
  agentRuns: AgentRun[]
  agentToolCalls: AgentToolCall[]
  documents: Document[]
  documentChunks: DocumentChunk[]
  workflows: Workflow[]
  workflowRuns: WorkflowRun[]
  googleIntegrations: GoogleIntegration[]
  googleSheetSyncs: GoogleSheetSync[]
}

class DatabaseManager {
  private data: DBData
  private dbFilePath: string
  private initialized: boolean = false

  constructor() {
    this.dbFilePath = path.join(process.cwd(), 'brain_graph_store.json')
    this.data = this.getDefaultState()
    this.load()
  }

  private getDefaultState(): DBData {
    return {
      students: [INITIAL_STUDENT],
      courses: [...INITIAL_COURSES],
      topics: [...INITIAL_TOPICS],
      lessons: [...INITIAL_LESSONS],
      questions: [...INITIAL_QUESTIONS],
      quizAttempts: [],
      topicMasteries: [...INITIAL_MASTERY],
      studyPlans: [{ ...INITIAL_STUDY_PLAN }],
      recommendations: [...INITIAL_RECOMMENDATIONS],
      assignments: [...INITIAL_ASSIGNMENTS],
      notifications: [
        {
          id: 'notif_1',
          studentId: 'student_1',
          title: 'Priority Revision Due',
          message: 'Your Recursion mastery is currently 35%. Complete the recommended practice session today!',
          type: 'REVISION_DUE',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ],
      learningEvents: [],
      agentRuns: [],
      agentToolCalls: [],
      documents: [],
      documentChunks: [],
      workflows: [...INITIAL_WORKFLOWS],
      workflowRuns: [],
      googleIntegrations: [],
      googleSheetSyncs: []
    }
  }

  private load() {
    try {
      if (fs.existsSync(this.dbFilePath)) {
        const fileContent = fs.readFileSync(this.dbFilePath, 'utf-8')
        const parsed = JSON.parse(fileContent)
        this.data = { ...this.getDefaultState(), ...parsed }
      } else {
        this.save()
      }
    } catch (e) {
      console.warn('Could not read DB file, using memory state:', e)
    }
    this.initialized = true
  }

  public save() {
    try {
      fs.writeFileSync(this.dbFilePath, JSON.stringify(this.data, null, 2), 'utf-8')
    } catch (e) {
      console.warn('Could not persist DB to disk:', e)
    }
  }

  // Student methods
  public getStudent(studentId: string = 'student_1'): Student {
    const student = this.data.students.find(s => s.id === studentId)
    return student || this.data.students[0]
  }

  public updateStudent(studentId: string, updates: Partial<Student>): Student {
    const idx = this.data.students.findIndex(s => s.id === studentId)
    if (idx !== -1) {
      this.data.students[idx] = { ...this.data.students[idx], ...updates, updatedAt: new Date().toISOString() }
      this.save()
      return this.data.students[idx]
    }
    return this.data.students[0]
  }

  // Courses & Topics
  public getCourses(): Course[] {
    return this.data.courses
  }

  public getTopics(courseId?: string): Topic[] {
    if (courseId) {
      return this.data.topics.filter(t => t.courseId === courseId)
    }
    return this.data.topics
  }

  public getTopicById(topicId: string): Topic | undefined {
    return this.data.topics.find(t => t.id === topicId || t.slug === topicId)
  }

  // Topic Mastery
  public getAllTopicMasteries(studentId: string = 'student_1'): TopicMastery[] {
    return this.data.topicMasteries.filter(m => m.studentId === studentId)
  }

  public getTopicMastery(topicId: string, studentId: string = 'student_1'): TopicMastery | undefined {
    return this.data.topicMasteries.find(m => m.topicId === topicId && m.studentId === studentId)
  }

  public upsertTopicMastery(mastery: Partial<TopicMastery> & { topicId: string; studentId?: string }): TopicMastery {
    const studentId = mastery.studentId || 'student_1'
    const idx = this.data.topicMasteries.findIndex(m => m.topicId === mastery.topicId && m.studentId === studentId)
    
    let status: 'Not Started' | 'Weak' | 'Medium' | 'Strong' = 'Medium'
    const score = mastery.masteryScore ?? 50
    if (score >= 80) status = 'Strong'
    else if (score >= 60) status = 'Medium'
    else status = 'Weak'

    if (idx !== -1) {
      this.data.topicMasteries[idx] = {
        ...this.data.topicMasteries[idx],
        ...mastery,
        status,
        updatedAt: new Date().toISOString()
      }
      this.save()
      return this.data.topicMasteries[idx]
    } else {
      const newMastery: TopicMastery = {
        id: `mastery_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        studentId,
        topicId: mastery.topicId,
        masteryScore: score,
        confidenceScore: mastery.confidenceScore || 50,
        attemptCount: mastery.attemptCount || 1,
        correctCount: mastery.correctCount || 0,
        incorrectCount: mastery.incorrectCount || 0,
        lastStudiedAt: new Date().toISOString(),
        nextRevisionAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        difficultyLevel: mastery.difficultyLevel || 'MEDIUM',
        status,
        updatedAt: new Date().toISOString()
      }
      this.data.topicMasteries.push(newMastery)
      this.save()
      return newMastery
    }
  }

  // Lessons & Questions
  public getLessonsByTopic(topicId: string): Lesson[] {
    return this.data.lessons.filter(l => l.topicId === topicId)
  }

  public getQuestionsByTopic(topicId: string, difficulty?: string): Question[] {
    let list = this.data.questions.filter(q => q.topicId === topicId)
    if (difficulty) {
      list = list.filter(q => q.difficulty.toUpperCase() === difficulty.toUpperCase())
    }
    return list
  }

  public addQuestion(question: Omit<Question, 'id'>): Question {
    const newQ: Question = {
      ...question,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    }
    this.data.questions.push(newQ)
    this.save()
    return newQ
  }

  // Quiz Attempts
  public recordQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'createdAt'>): QuizAttempt {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `attempt_${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    this.data.quizAttempts.push(newAttempt)

    // Record learning event
    this.recordLearningEvent({
      studentId: attempt.studentId,
      eventType: 'QUIZ_COMPLETED',
      topicId: attempt.topicId,
      metadata: {
        score: attempt.score,
        correct: attempt.correctCount,
        incorrect: attempt.incorrectCount,
        difficulty: attempt.difficulty
      }
    })

    this.save()
    return newAttempt
  }

  public getQuizAttempts(studentId: string = 'student_1', topicId?: string): QuizAttempt[] {
    let list = this.data.quizAttempts.filter(a => a.studentId === studentId)
    if (topicId) {
      list = list.filter(a => a.topicId === topicId)
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Study Plans & Sessions
  public getTodayStudyPlan(studentId: string = 'student_1'): StudyPlan {
    const today = new Date().toISOString().split('T')[0]
    let plan = this.data.studyPlans.find(p => p.studentId === studentId && p.date === today)
    if (!plan) {
      plan = {
        id: `plan_${today}`,
        studentId,
        date: today,
        goalMinutes: 45,
        completedMinutes: 0,
        summary: 'Daily AI Personalized Plan based on real-time topic mastery.',
        status: 'ACTIVE',
        sessions: [
          {
            id: `sess_${Date.now()}_1`,
            studentId,
            topicId: 'topic_recursion',
            title: 'Recursion Fundamentals & Base Cases',
            plannedDurationMinutes: 20,
            status: 'PENDING',
            sessionType: 'LESSON',
            scheduledFor: '10:00 AM'
          },
          {
            id: `sess_${Date.now()}_2`,
            studentId,
            topicId: 'topic_recursion',
            title: 'Recursion Practice Quiz',
            plannedDurationMinutes: 15,
            status: 'PENDING',
            sessionType: 'QUIZ',
            scheduledFor: '10:25 AM'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      this.data.studyPlans.push(plan)
      this.save()
    }
    return plan
  }

  public updateStudyPlan(planId: string, updates: Partial<StudyPlan>): StudyPlan | undefined {
    const idx = this.data.studyPlans.findIndex(p => p.id === planId)
    if (idx !== -1) {
      this.data.studyPlans[idx] = {
        ...this.data.studyPlans[idx],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      this.save()
      return this.data.studyPlans[idx]
    }
    return undefined
  }

  public updateSessionStatus(sessionId: string, status: LearningSession['status'], studentId: string = 'student_1'): LearningSession | undefined {
    for (const plan of this.data.studyPlans) {
      const sess = plan.sessions.find(s => s.id === sessionId)
      if (sess) {
        sess.status = status
        if (status === 'COMPLETED') {
          sess.completedAt = new Date().toISOString()
          plan.completedMinutes += sess.plannedDurationMinutes
          
          this.recordLearningEvent({
            studentId,
            eventType: 'STUDY_SESSION_COMPLETED',
            topicId: sess.topicId,
            metadata: { sessionId, sessionType: sess.sessionType, duration: sess.plannedDurationMinutes }
          })
        }
        plan.updatedAt = new Date().toISOString()
        this.save()
        return sess
      }
    }
    return undefined
  }

  // Recommendations
  public getRecommendations(studentId: string = 'student_1'): Recommendation[] {
    return this.data.recommendations.filter(r => r.studentId === studentId && r.status === 'ACTIVE')
  }

  public setRecommendations(recommendations: Recommendation[]) {
    this.data.recommendations = recommendations
    this.save()
  }

  // Assignments & Deadlines
  public getAssignments(studentId: string = 'student_1'): Assignment[] {
    return this.data.assignments.filter(a => a.studentId === studentId)
  }

  // Notifications
  public getNotifications(studentId: string = 'student_1'): Notification[] {
    return this.data.notifications.filter(n => n.studentId === studentId)
  }

  public addNotification(notif: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    this.data.notifications.unshift(newNotif)
    this.save()
    return newNotif
  }

  // Learning Events
  public recordLearningEvent(event: Omit<LearningEvent, 'id' | 'createdAt'>): LearningEvent {
    const newEvent: LearningEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString()
    }
    this.data.learningEvents.unshift(newEvent)
    this.save()
    return newEvent
  }

  public getLearningEvents(studentId: string = 'student_1', limit: number = 20): LearningEvent[] {
    return this.data.learningEvents.filter(e => e.studentId === studentId).slice(0, limit)
  }

  // Agent Runs & Audit Logging
  public logAgentRun(run: Omit<AgentRun, 'id' | 'createdAt'>): AgentRun {
    const newRun: AgentRun = {
      ...run,
      id: `run_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    }
    this.data.agentRuns.unshift(newRun)
    this.save()
    return newRun
  }

  public logToolCall(call: Omit<AgentToolCall, 'id' | 'createdAt'>): AgentToolCall {
    const newCall: AgentToolCall = {
      ...call,
      id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    }
    this.data.agentToolCalls.unshift(newCall)
    this.save()
    return newCall
  }

  public getAgentAuditLogs(studentId: string = 'student_1', limit: number = 20) {
    const runs = this.data.agentRuns.filter(r => r.studentId === studentId).slice(0, limit)
    const calls = this.data.agentToolCalls.slice(0, limit * 2)
    return { runs, calls }
  }

  // Document & RAG Storage
  public addDocument(title: string, source: string, category: string, chunks: string[]): Document {
    const docId = `doc_${Date.now()}`
    const newDoc: Document = {
      id: docId,
      title,
      source,
      category,
      chunkCount: chunks.length,
      createdAt: new Date().toISOString()
    }
    this.data.documents.unshift(newDoc)

    chunks.forEach((chunkText, idx) => {
      this.data.documentChunks.push({
        id: `chunk_${docId}_${idx}`,
        documentId: docId,
        content: chunkText,
        metadata: { title, category, chunkIndex: idx }
      })
    })

    this.save()
    return newDoc
  }

  public getDocuments(): Document[] {
    return this.data.documents
  }

  public searchDocumentChunks(query: string, limit: number = 4): DocumentChunk[] {
    if (!query) return this.data.documentChunks.slice(0, limit)
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2)
    if (terms.length === 0) return this.data.documentChunks.slice(0, limit)

    const scored = this.data.documentChunks.map(chunk => {
      const contentLower = chunk.content.toLowerCase()
      let score = 0
      terms.forEach(t => {
        if (contentLower.includes(t)) {
          score += 1
        }
      })
      return { chunk, score }
    })

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.chunk)
      .slice(0, limit)
  }

  // ─── Workflows ─────────────────────────────────────────────────────────────
  public getWorkflows(): Workflow[] {
    return this.data.workflows || []
  }

  public getWorkflowById(id: string): Workflow | undefined {
    return (this.data.workflows || []).find(w => w.id === id)
  }

  public getWorkflowsByTrigger(trigger: string): Workflow[] {
    return (this.data.workflows || []).filter(w => w.trigger === trigger && w.isActive)
  }

  public saveWorkflow(workflow: Omit<Workflow, 'createdAt' | 'updatedAt'> & { id?: string }): Workflow {
    if (!this.data.workflows) this.data.workflows = []
    const now = new Date().toISOString()
    const id = workflow.id || `wf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    const idx = this.data.workflows.findIndex(w => w.id === id)

    const fullWf: Workflow = {
      ...workflow,
      id,
      createdAt: idx !== -1 ? this.data.workflows[idx].createdAt : now,
      updatedAt: now
    }

    if (idx !== -1) {
      this.data.workflows[idx] = fullWf
    } else {
      this.data.workflows.unshift(fullWf)
    }

    this.save()
    return fullWf
  }

  public deleteWorkflow(id: string): boolean {
    if (!this.data.workflows) return false
    const initialLen = this.data.workflows.length
    this.data.workflows = this.data.workflows.filter(w => w.id !== id)
    if (this.data.workflows.length !== initialLen) {
      this.save()
      return true
    }
    return false
  }

  public logWorkflowRun(run: Omit<WorkflowRun, 'id' | 'startedAt'>): WorkflowRun {
    if (!this.data.workflowRuns) this.data.workflowRuns = []
    const newRun: WorkflowRun = {
      ...run,
      id: `run_wf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      startedAt: new Date().toISOString()
    }
    this.data.workflowRuns.unshift(newRun)
    this.save()
    return newRun
  }

  public updateWorkflowRun(id: string, updates: Partial<WorkflowRun>): WorkflowRun | undefined {
    if (!this.data.workflowRuns) return undefined
    const idx = this.data.workflowRuns.findIndex(r => r.id === id)
    if (idx !== -1) {
      this.data.workflowRuns[idx] = { ...this.data.workflowRuns[idx], ...updates }
      this.save()
      return this.data.workflowRuns[idx]
    }
    return undefined
  }

  public getWorkflowRuns(workflowId?: string, limit: number = 30): WorkflowRun[] {
    if (!this.data.workflowRuns) return []
    let list = this.data.workflowRuns
    if (workflowId) {
      list = list.filter(r => r.workflowId === workflowId)
    }
    return list.slice(0, limit)
  }

  // ─── Google Sheets Integration Methods ──────────────────────────────────────
  public getGoogleIntegrations(userId?: string): GoogleIntegration[] {
    if (!this.data.googleIntegrations) this.data.googleIntegrations = []
    if (userId) {
      return this.data.googleIntegrations.filter(i => i.userId === userId)
    }
    return this.data.googleIntegrations
  }

  public getGoogleIntegrationById(id: string): GoogleIntegration | undefined {
    if (!this.data.googleIntegrations) this.data.googleIntegrations = []
    return this.data.googleIntegrations.find(i => i.id === id || i.spreadsheetId === id)
  }

  public saveGoogleIntegration(integration: Omit<GoogleIntegration, 'createdAt' | 'updatedAt' | 'id'> & { id?: string }): GoogleIntegration {
    if (!this.data.googleIntegrations) this.data.googleIntegrations = []
    const now = new Date().toISOString()
    const id = integration.id || `g_int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    const idx = this.data.googleIntegrations.findIndex(i => i.id === id || i.spreadsheetId === integration.spreadsheetId)

    const fullIntegration: GoogleIntegration = {
      ...integration,
      id: idx !== -1 ? this.data.googleIntegrations[idx].id : id,
      createdAt: idx !== -1 ? this.data.googleIntegrations[idx].createdAt : now,
      updatedAt: now
    }

    if (idx !== -1) {
      this.data.googleIntegrations[idx] = fullIntegration
    } else {
      this.data.googleIntegrations.unshift(fullIntegration)
    }

    this.save()
    return fullIntegration
  }

  public deleteGoogleIntegration(id: string): boolean {
    if (!this.data.googleIntegrations) return false
    const initialLen = this.data.googleIntegrations.length
    this.data.googleIntegrations = this.data.googleIntegrations.filter(i => i.id !== id && i.spreadsheetId !== id)
    if (this.data.googleIntegrations.length !== initialLen) {
      this.save()
      return true
    }
    return false
  }

  public recordGoogleSheetSync(sync: Omit<GoogleSheetSync, 'id' | 'startedAt'>): GoogleSheetSync {
    if (!this.data.googleSheetSyncs) this.data.googleSheetSyncs = []
    const newSync: GoogleSheetSync = {
      ...sync,
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      startedAt: new Date().toISOString()
    }
    this.data.googleSheetSyncs.unshift(newSync)
    this.save()
    return newSync
  }

  public getGoogleSheetSyncHistory(integrationId?: string, limit: number = 30): GoogleSheetSync[] {
    if (!this.data.googleSheetSyncs) return []
    let list = this.data.googleSheetSyncs
    if (integrationId) {
      list = list.filter(s => s.integrationId === integrationId)
    }
    return list.slice(0, limit)
  }

  // Reset database to seed
  public resetToDefault() {
    this.data = this.getDefaultState()
    this.save()
    return this.data
  }
}

// Global Singleton for Next.js hot reload safety
const globalForDB = global as unknown as { brainGraphDB: DatabaseManager }
export const db = globalForDB.brainGraphDB || new DatabaseManager()
if (process.env.NODE_ENV !== 'production') globalForDB.brainGraphDB = db
