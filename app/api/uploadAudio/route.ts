import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audio = formData.get('audio') as File
    const questionId = formData.get('questionId') as string

    if (!audio) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await audio.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${questionId}-${timestamp}.webm`
    
    // Save to /tmp (Vercel serverless temporary storage)
    const filepath = join('/tmp', filename)
    await writeFile(filepath, buffer)

    console.log(`Audio uploaded: ${filename} (${buffer.length} bytes)`)

    return NextResponse.json({
      success: true,
      fileId: filename,
      size: buffer.length,
      message: 'Audio uploaded to temporary storage'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload audio' },
      { status: 500 }
    )
  }
}
