'use client'

import { useState, useEffect } from 'react'
import { googleSheetsService } from '@/app/education/lib/services/googleSheetsService'
import Link from 'next/link'

export default function GoogleSheetsIntegration() {
  const [spreadsheets, setSpreadsheets] = useState<any[]>([])
  const [selectedSpreadsheetId, setSelectedSpreadsheetId] = useState('1XBiLRp0Df_LiAf5o3QaEO7wrrlU-xoQDSXCbi6Bx1YI')
  const [sheets, setSheets] = useState<any[]>([])
  const [selectedSheetName, setSelectedSheetName] = useState('Sheet1')
  const [customSheetUrl, setCustomSheetUrl] = useState('')
  
  const [previewData, setPreviewData] = useState<any>(null)
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})
  const [syncHistory, setSyncHistory] = useState<any[]>([])
  const [activeIntegration, setActiveIntegration] = useState<any>(null)

  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [enableAI, setEnableAI] = useState(true)
  const [importResult, setImportResult] = useState<any>(null)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  // 1. Initial load
  useEffect(() => {
    loadInitialData()
  }, [])

  async function loadInitialData() {
    try {
      setLoading(true)
      const [spreadsheetsRes, historyRes] = await Promise.all([
        googleSheetsService.getSpreadsheets().catch(() => ({ spreadsheets: [] })),
        googleSheetsService.getSyncHistory().catch(() => ({ syncHistory: [], integrations: [] }))
      ])

      if (spreadsheetsRes.spreadsheets) setSpreadsheets(spreadsheetsRes.spreadsheets)
      if (historyRes.syncHistory) setSyncHistory(historyRes.syncHistory)
      if (historyRes.integrations?.length > 0) setActiveIntegration(historyRes.integrations[0])

      // Load preview for default education spreadsheet
      await fetchPreview('1XBiLRp0Df_LiAf5o3QaEO7wrrlU-xoQDSXCbi6Bx1YI', 'Sheet1')
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 2. Extract SPREADSHEET_ID from URL or input
  function extractSpreadsheetId(urlOrId: string) {
    if (!urlOrId) return ''
    const match = urlOrId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    return match ? match[1] : urlOrId.trim()
  }

  async function handleConnectUrl() {
    const id = extractSpreadsheetId(customSheetUrl)
    if (!id) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid Google Spreadsheet URL or ID.' })
      return
    }
    setSelectedSpreadsheetId(id)
    await fetchPreview(id, 'Sheet1')
  }

  // 3. Fetch preview & auto column mapping
  async function fetchPreview(spreadsheetId: string, sheetName: string = 'Sheet1') {
    try {
      setLoading(true)
      setStatusMessage(null)
      const data = await googleSheetsService.previewSheet(spreadsheetId, sheetName)
      setPreviewData(data)
      if (data.autoMapping) {
        setColumnMapping(data.autoMapping)
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to preview sheet data.' })
    } finally {
      setLoading(false)
    }
  }

  // 4. Import Validated Rows
  async function handleImport() {
    if (!previewData || !previewData.sampleRows) return
    setImporting(true)
    setStatusMessage(null)
    try {
      const res = await googleSheetsService.importSheet({
        spreadsheetId: selectedSpreadsheetId,
        spreadsheetName: 'education - Student Learning Performance',
        sheetName: selectedSheetName,
        rows: previewData.sampleRows,
        mapping: columnMapping,
        enableAI
      })

      setImportResult(res.importResult)
      setStatusMessage({
        type: 'success',
        text: `Import successful! ${res.importResult.recordsProcessed} records processed, ${res.importResult.recordsAdded} added, ${res.importResult.recordsUpdated} updated.`
      })

      // Refresh sync history
      const hist = await googleSheetsService.getSyncHistory()
      if (hist.syncHistory) setSyncHistory(hist.syncHistory)
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Import failed.' })
    } finally {
      setImporting(false)
    }
  }

  // 5. Manual Sync Now
  async function handleSyncNow() {
    setSyncing(true)
    setStatusMessage(null)
    try {
      const res = await googleSheetsService.syncSheet(activeIntegration?.id)
      setStatusMessage({
        type: 'success',
        text: `Sync completed! ${res.importResult?.recordsAdded || 0} added, ${res.importResult?.recordsUpdated || 0} updated.`
      })
      const hist = await googleSheetsService.getSyncHistory()
      if (hist.syncHistory) setSyncHistory(hist.syncHistory)
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Sync failed.' })
    } finally {
      setSyncing(false)
    }
  }

  const expectedFields = [
    'studentId', 'studentName', 'email', 'course', 'topic', 'difficulty',
    'quizScore', 'masteryScore', 'questionsAttempted', 'correctAnswers',
    'studyTime', 'lastStudied', 'completionPercentage', 'revisionDue',
    'learningStatus', 'assignmentStatus', 'goal', 'dailyStudyGoal', 'aiRecommendation'
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs font-mono text-emerald-400 mb-1">DATA PIPELINE &amp; SYNC</div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <span>📊 Google Sheets Integration</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Import and synchronize student learning data with Brain Graph, Supabase, and Agentic AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span>{syncing ? 'Synchronizing...' : '🔄 Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300'
              : 'bg-red-950/40 border border-red-800/60 text-red-300'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Grid: 1. Connection & Selection */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Spreadsheet Connection */}
        <div className="space-y-6">
          {/* Section 1: Connect Google Sheet */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>🔗 Google Spreadsheet Link</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Enter Google Sheets URL</label>
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/1XBi.../edit"
                  value={customSheetUrl}
                  onChange={e => setCustomSheetUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <button
                onClick={handleConnectUrl}
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                {loading ? 'Connecting...' : 'Connect Spreadsheet'}
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Or Choose Connected Sheet</label>
              <select
                value={selectedSpreadsheetId}
                onChange={e => {
                  setSelectedSpreadsheetId(e.target.value)
                  fetchPreview(e.target.value, selectedSheetName)
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none"
              >
                {spreadsheets.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id.slice(0, 8)}...)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Sheet / Tab</label>
              <select
                value={selectedSheetName}
                onChange={e => {
                  setSelectedSheetName(e.target.value)
                  fetchPreview(selectedSpreadsheetId, e.target.value)
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none"
              >
                <option value="Sheet1">Sheet1</option>
                <option value="Cohorts">Cohorts</option>
                <option value="Assessments">Assessments</option>
              </select>
            </div>
          </div>

          {/* Section 2: AI Automation Toggle */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Agentic AI Automation</div>
                <div className="text-xs text-slate-400">Trigger analysis, recovery plans &amp; notifications</div>
              </div>
              <input
                type="checkbox"
                checked={enableAI}
                onChange={e => setEnableAI(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Section 3: Validation Summary Card */}
          {previewData?.validation && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Validation Result</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-xl">
                  <div className="text-[11px] text-emerald-400 font-semibold">Valid Records</div>
                  <div className="text-2xl font-bold text-emerald-300 mt-1">
                    ✓ {previewData.validation.validCount}
                  </div>
                </div>
                <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl">
                  <div className="text-[11px] text-amber-400 font-semibold">Invalid Records</div>
                  <div className="text-2xl font-bold text-amber-300 mt-1">
                    ⚠ {previewData.validation.invalidCount}
                  </div>
                </div>
              </div>

              {previewData.validation.errors?.length > 0 && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 max-h-36 overflow-y-auto space-y-1 font-mono text-[11px] text-red-400">
                  {previewData.validation.errors.map((err: any, i: number) => (
                    <div key={i}>Row {err.row}: {err.message}</div>
                  ))}
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={importing || previewData.validation.validCount === 0}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                {importing ? 'Ingesting into Supabase & AI...' : `Import ${previewData.validation.validCount} Valid Records`}
              </button>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Preview, Column Mapping, & Sync History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Import Result Notification */}
          {importResult && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-800/60 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-mono">
                <span>🎉 IMPORT SUCCESSFUL</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Processed</div>
                  <div className="font-bold text-white text-base">{importResult.recordsProcessed}</div>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Added</div>
                  <div className="font-bold text-emerald-400 text-base">{importResult.recordsAdded}</div>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Updated</div>
                  <div className="font-bold text-blue-400 text-base">{importResult.recordsUpdated}</div>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400">Recommendations</div>
                  <div className="font-bold text-purple-400 text-base">{importResult.recommendationsGenerated}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300 pt-2">
                <span>Knowledge Graph &amp; Study Plans updated.</span>
                <Link href="/education/dashboard" className="text-emerald-400 font-semibold hover:underline">
                  View Student Dashboard →
                </Link>
              </div>
            </div>
          )}

          {/* Preview Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Google Sheet Preview (First 15 Rows)</h3>
                <p className="text-xs text-slate-400">Direct streaming via Google Sheets API</p>
              </div>
              <span className="text-xs font-mono text-slate-400">{previewData?.sampleRows?.length || 0} rows loaded</span>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-72">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-3">Topic</th>
                    <th className="py-2.5 px-3">Quiz Score</th>
                    <th className="py-2.5 px-3">Mastery</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {previewData?.sampleRows?.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-mono font-bold text-white">{row['Student ID'] || row.studentId}</td>
                      <td className="py-2 px-3">{row['Student Name'] || row.studentName}</td>
                      <td className="py-2 px-3">{row['Course'] || row.course}</td>
                      <td className="py-2 px-3 font-semibold text-blue-300">{row['Topic'] || row.topic}</td>
                      <td className="py-2 px-3 font-mono">{row['Quiz Score'] || row.quizScore}%</td>
                      <td className="py-2 px-3 font-mono font-bold text-purple-300">{row['Mastery Score'] || row.masteryScore}%</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            (row['Mastery Score'] || row.masteryScore) >= 75
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : (row['Mastery Score'] || row.masteryScore) >= 50
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {row['Learning Status'] || (row['Mastery Score'] < 50 ? 'Weak' : 'Strong')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Column Mapping */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Visual Column Mapping</h3>
            <p className="text-xs text-slate-400">Google Sheet Column → Brain Graph Field</p>

            <div className="grid sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2">
              {previewData?.headers?.map((header: string) => (
                <div key={header} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 truncate max-w-[140px]" title={header}>{header}</span>
                  <span className="text-slate-600 font-bold">→</span>
                  <select
                    value={columnMapping[header] || ''}
                    onChange={e => setColumnMapping({ ...columnMapping, [header]: e.target.value })}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-blue-400 font-mono font-semibold"
                  >
                    <option value="">(Ignore)</option>
                    {expectedFields.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Sync History Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">Synchronization History</h3>
            
            {syncHistory.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No sync records yet.</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {syncHistory.map((sync: any) => (
                  <div key={sync.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{sync.spreadsheetName} ({sync.sheetName})</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {new Date(sync.startedAt).toLocaleString()} • {sync.rowsProcessed} processed ({sync.rowsCreated} added, {sync.rowsUpdated} updated)
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/20 text-emerald-400">
                      {sync.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
