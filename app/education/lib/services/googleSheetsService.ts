/**
 * Frontend Service for Google Sheets Integration
 * Encapsulates all backend API communication outside of UI components.
 */

export const googleSheetsService = {
  // 1. Get Google OAuth Authentication URL
  connectGoogle: async () => {
    const res = await fetch('/api/google/auth')
    if (!res.ok) throw new Error('Failed to initialize Google authentication')
    return res.json()
  },

  // 2. Fetch available spreadsheets
  getSpreadsheets: async () => {
    const res = await fetch('/api/google/spreadsheets')
    if (!res.ok) throw new Error('Failed to retrieve Google spreadsheets')
    return res.json()
  },

  // 3. Fetch sheet / tab names for a spreadsheet
  getSheets: async (spreadsheetId: string) => {
    const res = await fetch(`/api/google/spreadsheets/${spreadsheetId}/sheets`)
    if (!res.ok) throw new Error('Failed to retrieve sheets for this spreadsheet')
    return res.json()
  },

  // 4. Preview and validate rows in a sheet
  previewSheet: async (spreadsheetId: string, sheetName: string = 'Sheet1') => {
    const res = await fetch(`/api/google/sheets/${spreadsheetId}/preview?sheetName=${encodeURIComponent(sheetName)}`)
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to preview Google Sheet')
    }
    return res.json()
  },

  // 5. Import validated rows and trigger Agentic AI
  importSheet: async (data: {
    spreadsheetId: string
    spreadsheetName: string
    sheetName: string
    rows: any[]
    mapping?: Record<string, string>
    enableAI?: boolean
  }) => {
    const res = await fetch('/api/google/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Import failed')
    }
    return res.json()
  },

  // 6. Synchronize active integration
  syncSheet: async (integrationId?: string) => {
    const res = await fetch('/api/google/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ integrationId })
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Sync failed')
    }
    return res.json()
  },

  // 7. Get sync history logs
  getSyncHistory: async (integrationId?: string) => {
    const url = integrationId
      ? `/api/google/sync-history?integrationId=${integrationId}`
      : '/api/google/sync-history'
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch synchronization history')
    return res.json()
  },

  // 8. Disconnect integration
  disconnect: async (integrationId: string) => {
    const res = await fetch(`/api/google/integration/${integrationId}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Failed to disconnect Google integration')
    return res.json()
  }
}
