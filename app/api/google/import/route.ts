import { NextRequest, NextResponse } from 'next/server'
import { validateSheetData } from '@/app/education/lib/agents/googleSheetValidator'
import { processGoogleSheetImport } from '@/app/education/lib/agents/googleSheetImporter'
import { db } from '@/app/education/lib/db/database'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  try {
    const body = await request.json()
    const { spreadsheetId, spreadsheetName, sheetName, rows, mapping, enableAI } = body

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No data rows provided for import.' }, { status: 400 })
    }

    // 1. Validate data
    const validation = validateSheetData(rows, mapping)

    if (validation.validRows.length === 0) {
      return NextResponse.json({
        error: 'No valid records found to import.',
        validationErrors: validation.errors
      }, { status: 400 })
    }

    // 2. Process import & trigger Agentic AI
    const result = await processGoogleSheetImport(validation.validRows, enableAI !== false)

    // 3. Save / Update Integration state
    const integration = db.saveGoogleIntegration({
      userId: 'admin_1',
      spreadsheetId: spreadsheetId || '1XBiLRp0Df_LiAf5o3QaEO7wrrlU-xoQDSXCbi6Bx1YI',
      spreadsheetName: spreadsheetName || 'education - Google Sheets',
      sheetName: sheetName || 'Sheet1',
      syncFrequency: 'MANUAL',
      lastSyncedAt: new Date().toISOString(),
      syncStatus: 'ACTIVE'
    })

    // 4. Log Sync History
    const syncLog = db.recordGoogleSheetSync({
      integrationId: integration.id,
      spreadsheetName: integration.spreadsheetName,
      sheetName: integration.sheetName,
      rowsProcessed: validation.totalRows,
      rowsCreated: result.recordsAdded,
      rowsUpdated: result.recordsUpdated,
      rowsFailed: validation.invalidCount + result.recordsFailed,
      errorDetails: validation.errors.map(e => `Row ${e.row}: ${e.message}`),
      completedAt: new Date().toISOString(),
      status: result.recordsFailed === 0 && validation.invalidCount === 0 ? 'SUCCESS' : 'PARTIAL',
      durationMs: Date.now() - startTime
    })

    return NextResponse.json({
      success: true,
      message: 'Google Sheet data imported successfully!',
      importResult: result,
      syncLog,
      validationSummary: {
        totalRows: validation.totalRows,
        validCount: validation.validCount,
        invalidCount: validation.invalidCount,
        errors: validation.errors
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Failed to import Google Sheet data.'
    }, { status: 500 })
  }
}
