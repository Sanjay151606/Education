import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const runs = db.getWorkflowRuns(params.id, 50)
    return NextResponse.json({ runs })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching runs' }, { status: 500 })
  }
}
