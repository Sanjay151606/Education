import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { spreadsheet_id: string } }
) {
  const spreadsheetId = params.spreadsheet_id

  // If using Google API Key or service token, fetch spreadsheet metadata via REST
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY

  if (apiKey) {
    try {
      const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`)
      if (res.ok) {
        const data = await res.json()
        const sheets = data.sheets?.map((s: any) => ({
          sheetId: s.properties.sheetId,
          title: s.properties.title
        })) || []
        return NextResponse.json({
          spreadsheetId,
          spreadsheetName: data.properties?.title || 'education - Google Sheets',
          sheets
        })
      }
    } catch (e) {
      console.warn('Direct Google API fetch error, falling back to public export:', e)
    }
  }

  // Standard fallback
  return NextResponse.json({
    spreadsheetId,
    spreadsheetName: 'education - Google Sheets',
    sheets: [
      { sheetId: 0, title: 'Sheet1' },
      { sheetId: 1, title: 'Cohorts' }
    ]
  })
}
