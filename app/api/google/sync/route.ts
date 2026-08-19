import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/app/education/lib/db/database'
import { processGoogleSheetImport } from '@/app/education/lib/agents/googleSheetImporter'
import { validateSheetData } from '@/app/education/lib/agents/googleSheetValidator'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  try {
    const { integrationId } = await request.json().catch(() => ({}))
    
    const integration = integrationId
      ? db.getGoogleIntegrationById(integrationId)
      : db.getGoogleIntegrations()[0]

    const spreadsheetId = integration?.spreadsheetId || '1XBiLRp0Df_LiAf5o3QaEO7wrrlU-xoQDSXCbi6Bx1YI'
    const sheetName = integration?.sheetName || 'Sheet1'

    // Fetch latest rows via internal preview endpoint
    const previewRes = await fetch(`${request.nextUrl.origin}/api/google/sheets/${spreadsheetId}/preview?sheetName=${encodeURIComponent(sheetName)}`)
    const previewData = await previewRes.json()

    const rawRows = previewData.sampleRows || []
    const validation = validateSheetData(rawRows, previewData.autoMapping)

    const importResult = await processGoogleSheetImport(validation.validRows, true)

    const syncLog = db.recordGoogleSheetSync({
      integrationId: integration?.id || 'g_int_default',
      spreadsheetName: integration?.spreadsheetName || 'education - Google Sheets',
      sheetName,
      rowsProcessed: validation.totalRows,
      rowsCreated: importResult.recordsAdded,
      rowsUpdated: importResult.recordsUpdated,
      rowsFailed: validation.invalidCount,
      errorDetails: validation.errors.map(e => `Row ${e.row}: ${e.message}`),
      completedAt: new Date().toISOString(),
      status: 'SUCCESS',
      durationMs: Date.now() - startTime
    })

    if (integration) {
      db.saveGoogleIntegration({
        ...integration,
        lastSyncedAt: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Synchronization completed successfully!',
      syncLog,
      importResult
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Sync failed.'
    }, { status: 500 })
  }
}
