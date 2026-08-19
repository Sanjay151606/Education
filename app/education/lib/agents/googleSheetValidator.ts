import { GoogleSheetImportRow } from '../db/schema'

export interface ValidationError {
  row: number
  field: string
  message: string
  value?: any
}

export interface ValidationSummary {
  totalRows: number
  validCount: number
  invalidCount: number
  errors: ValidationError[]
  validRows: GoogleSheetImportRow[]
}

const EXPECTED_HEADERS = [
  'Student ID',
  'Student Name',
  'Email',
  'Course',
  'Topic',
  'Difficulty',
  'Quiz Score',
  'Mastery Score',
  'Questions Attempted',
  'Correct Answers',
  'Study Time',
  'Last Studied',
  'Completion %',
  'Revision Due',
  'Learning Status',
  'Assignment Status',
  'Goal',
  'Daily Study Goal',
  'AI Recommendation'
]

// Normalizes header names to internal field keys
export function autoMapColumns(headers: string[]): Record<string, keyof GoogleSheetImportRow> {
  const mapping: Record<string, keyof GoogleSheetImportRow> = {}

  const exactMap: Record<string, keyof GoogleSheetImportRow> = {
    'student id': 'studentId',
    'student name': 'studentName',
    'email': 'email',
    'course': 'course',
    'topic': 'topic',
    'difficulty': 'difficulty',
    'quiz score': 'quizScore',
    'mastery score': 'masteryScore',
    'questions attempted': 'questionsAttempted',
    'correct answers': 'correctAnswers',
    'study time': 'studyTime',
    'last studied': 'lastStudied',
    'completion %': 'completionPercentage',
    'completion percentage': 'completionPercentage',
    'revision due': 'revisionDue',
    'learning status': 'learningStatus',
    'assignment status': 'assignmentStatus',
    'goal': 'goal',
    'daily study goal': 'dailyStudyGoal',
    'ai recommendation': 'aiRecommendation'
  }

  const fieldKeywords: Record<keyof GoogleSheetImportRow, string[]> = {
    studentId: ['student id', 'studentid', 'student_id', 'id', 'roll no'],
    studentName: ['student name', 'name', 'full name', 'student_name'],
    email: ['email', 'email address', 'mail'],
    course: ['course', 'subject', 'course name', 'course_name'],
    topic: ['topic', 'concept', 'module', 'topic_name'],
    difficulty: ['difficulty', 'level', 'difficulty level'],
    quizScore: ['quiz score', 'quiz', 'quiz_score', 'assessment score'],
    masteryScore: ['mastery score', 'mastery', 'mastery %', 'mastery_score'],
    questionsAttempted: ['questions attempted', 'attempted', 'total questions'],
    correctAnswers: ['correct answers', 'correct count', 'correct_answers'],
    studyTime: ['study time', 'time spent', 'study_time', 'minutes'],
    lastStudied: ['last studied', 'last active', 'studied date', 'last_studied'],
    completionPercentage: ['completion %', 'completion', 'completion percentage'],
    revisionDue: ['revision due', 'due date', 'next revision', 'revision_due'],
    learningStatus: ['learning status', 'mastery status', 'learning_status'],
    assignmentStatus: ['assignment status', 'assignment', 'homework status'],
    goal: ['learning goal', 'goal', 'target'],
    dailyStudyGoal: ['daily study goal', 'daily goal', 'study goal'],
    aiRecommendation: ['ai recommendation', 'recommendation', 'suggestion', 'next action'],
    lastUpdated: ['last updated', 'updated at', 'timestamp', 'modified date']
  }

  headers.forEach((header) => {
    const cleanHeader = header.trim().toLowerCase()
    
    // First try exact map
    if (exactMap[cleanHeader]) {
      mapping[header] = exactMap[cleanHeader]
      return
    }

    // Otherwise keyword search
    for (const [field, keywords] of Object.entries(fieldKeywords)) {
      if (keywords.some(k => cleanHeader === k || cleanHeader.includes(k))) {
        mapping[header] = field as keyof GoogleSheetImportRow
        break
      }
    }
  })

  return mapping
}

export function validateSheetData(
  rows: any[],
  customMapping?: Record<string, keyof GoogleSheetImportRow>
): ValidationSummary {
  const errors: ValidationError[] = []
  const validRows: GoogleSheetImportRow[] = []
  const seenStudentTopic = new Set<string>()

  rows.forEach((rawRow, index) => {
    const rowNum = index + 2 // Account for 1-based index and header row
    const row: Partial<GoogleSheetImportRow> = {}

    // Map fields
    if (customMapping) {
      for (const [colName, fieldKey] of Object.entries(customMapping)) {
        if (rawRow[colName] !== undefined) {
          (row as any)[fieldKey] = rawRow[colName]
        }
      }
    } else {
      // Auto-extract matching standard keys
      row.studentId = String(rawRow['Student ID'] || rawRow['studentId'] || rawRow['student_id'] || '').trim()
      row.studentName = String(rawRow['Student Name'] || rawRow['studentName'] || rawRow['name'] || '').trim()
      row.email = String(rawRow['Email'] || rawRow['email'] || '').trim()
      row.course = String(rawRow['Course'] || rawRow['course'] || 'General').trim()
      row.topic = String(rawRow['Topic'] || rawRow['topic'] || 'General').trim()
      row.difficulty = (rawRow['Difficulty'] || rawRow['difficulty'] || 'MEDIUM') as any
      row.quizScore = Number(rawRow['Quiz Score'] || rawRow['quizScore'] || 0)
      row.masteryScore = Number(rawRow['Mastery Score'] || rawRow['masteryScore'] || 0)
      row.questionsAttempted = Number(rawRow['Questions Attempted'] || rawRow['questionsAttempted'] || 0)
      row.correctAnswers = Number(rawRow['Correct Answers'] || rawRow['correctAnswers'] || 0)
      row.studyTime = Number(rawRow['Study Time'] || rawRow['studyTime'] || 0)
      row.lastStudied = rawRow['Last Studied'] || rawRow['lastStudied']
      row.completionPercentage = Number(rawRow['Completion %'] || rawRow['completionPercentage'] || 0)
      row.revisionDue = rawRow['Revision Due'] || rawRow['revisionDue']
      row.learningStatus = rawRow['Learning Status'] || rawRow['learningStatus']
      row.assignmentStatus = rawRow['Assignment Status'] || rawRow['assignmentStatus']
      row.goal = rawRow['Goal'] || rawRow['goal']
      row.dailyStudyGoal = Number(rawRow['Daily Study Goal'] || rawRow['dailyStudyGoal'] || 45)
      row.aiRecommendation = rawRow['AI Recommendation'] || rawRow['aiRecommendation']
    }

    let isRowValid = true

    // 1. Required Check: Student ID
    if (!row.studentId) {
      errors.push({ row: rowNum, field: 'Student ID', message: 'Student ID is required and cannot be empty.' })
      isRowValid = false
    }

    // 2. Required Check: Student Name
    if (!row.studentName) {
      errors.push({ row: rowNum, field: 'Student Name', message: 'Student Name is required.' })
      isRowValid = false
    }

    // 3. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!row.email || !emailRegex.test(row.email)) {
      errors.push({ row: rowNum, field: 'Email', message: `Invalid email address format: "${row.email}".`, value: row.email })
      isRowValid = false
    }

    // 4. Course & Topic
    if (!row.course) {
      errors.push({ row: rowNum, field: 'Course', message: 'Course name is required.' })
      isRowValid = false
    }
    if (!row.topic) {
      errors.push({ row: rowNum, field: 'Topic', message: 'Topic name is required.' })
      isRowValid = false
    }

    // 5. Quiz Score (0 - 100)
    if (isNaN(row.quizScore!) || row.quizScore! < 0 || row.quizScore! > 100) {
      errors.push({ row: rowNum, field: 'Quiz Score', message: `Quiz Score must be between 0 and 100 (got ${row.quizScore}).`, value: row.quizScore })
      isRowValid = false
    }

    // 6. Mastery Score (0 - 100)
    if (isNaN(row.masteryScore!) || row.masteryScore! < 0 || row.masteryScore! > 100) {
      errors.push({ row: rowNum, field: 'Mastery Score', message: `Mastery Score must be between 0 and 100 (got ${row.masteryScore}).`, value: row.masteryScore })
      isRowValid = false
    }

    // 7. Questions and Correct Answers
    if (row.questionsAttempted! < 0) {
      errors.push({ row: rowNum, field: 'Questions Attempted', message: 'Questions Attempted cannot be negative.' })
      isRowValid = false
    }
    if (row.correctAnswers! < 0) {
      errors.push({ row: rowNum, field: 'Correct Answers', message: 'Correct Answers cannot be negative.' })
      isRowValid = false
    }
    if (row.correctAnswers! > row.questionsAttempted!) {
      errors.push({
        row: rowNum,
        field: 'Correct Answers',
        message: `Correct Answers (${row.correctAnswers}) cannot exceed Questions Attempted (${row.questionsAttempted}).`
      })
      isRowValid = false
    }

    // 8. Study Time
    if (row.studyTime! < 0) {
      errors.push({ row: rowNum, field: 'Study Time', message: 'Study Time cannot be negative.' })
      isRowValid = false
    }

    // 9. Completion %
    if (row.completionPercentage !== undefined && (row.completionPercentage < 0 || row.completionPercentage > 100)) {
      errors.push({ row: rowNum, field: 'Completion %', message: 'Completion % must be between 0 and 100.' })
      isRowValid = false
    }

    // 10. Duplicate within batch check (Student ID + Course + Topic)
    const uniqueKey = `${row.studentId}_${row.course}_${row.topic}`.toLowerCase()
    if (seenStudentTopic.has(uniqueKey)) {
      errors.push({
        row: rowNum,
        field: 'Student ID',
        message: `Duplicate entry for Student ID (${row.studentId}) on topic "${row.topic}" in current sheet.`
      })
      isRowValid = false
    } else {
      seenStudentTopic.add(uniqueKey)
    }

    if (isRowValid) {
      validRows.push(row as GoogleSheetImportRow)
    }
  })

  return {
    totalRows: rows.length,
    validCount: validRows.length,
    invalidCount: errors.length > 0 ? rows.length - validRows.length : 0,
    errors,
    validRows
  }
}
