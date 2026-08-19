import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = db.deleteGoogleIntegration(params.id)
    return NextResponse.json({ success, message: 'Google integration disconnected.' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to disconnect integration.' }, { status: 500 })
  }
}
