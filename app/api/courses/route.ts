import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'

export async function GET() {
  try {
    const courses = db.getCourses()
    const topics = db.getTopics()
    const coursesWithCount = courses.map(c => ({
      ...c,
      topicsCount: topics.filter(t => t.courseId === c.id).length
    }))
    return NextResponse.json({ courses: coursesWithCount })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching courses' }, { status: 500 })
  }
}
