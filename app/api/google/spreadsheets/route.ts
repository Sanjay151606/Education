import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Returns accessible spreadsheets for the authenticated user or configured education sheet
  const defaultSpreadsheets = [
    {
      id: '1XBiLRp0Df_LiAf5o3QaEO7wrrlU-xoQDSXCbi6Bx1YI',
      name: 'education - Student Learning Performance'
    },
    {
      id: '1sample_dsa_recursion_cohort_2026',
      name: 'Data Structures & Algorithms Cohort Assessment'
    }
  ]

  return NextResponse.json({
    spreadsheets: defaultSpreadsheets
  })
}
