import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const integrationId = searchParams.get('integrationId') || undefined
    const history = db.getGoogleSheetSyncHistory(integrationId, 50)
    const integrations = db.getGoogleIntegrations()

    return NextResponse.json({
      syncHistory: history,
      integrations
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Failed to fetch sync history'
    }, { status: 500 })
  }
}
