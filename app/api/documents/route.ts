import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'
import { triggerWorkflowsByEvent } from '@/app/education/lib/agents/workflowEngine'

export async function GET() {
  try {
    const documents = db.getDocuments()
    return NextResponse.json({ documents })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching documents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, source, category, content } = await request.json()
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Text chunking pipeline
    const rawChunks = content
      .split(/\n\n+/)
      .map((c: string) => c.trim())
      .filter((c: string) => c.length > 20)

    const chunks = rawChunks.length > 0 ? rawChunks : [content]

    const doc = db.addDocument(title, source || 'upload', category || 'General', chunks)

    // Trigger workflow pipeline for new document upload
    const triggeredRuns = await triggerWorkflowsByEvent('NEW_DOCUMENT_UPLOADED', {
      documentId: doc.id,
      title: doc.title,
      chunkCount: doc.chunkCount
    })

    return NextResponse.json({
      document: doc,
      chunksCreated: chunks.length,
      triggeredWorkflows: triggeredRuns.map(r => ({ id: r.id, name: r.workflowName }))
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing document' }, { status: 500 })
  }
}
