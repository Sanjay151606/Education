import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID || ''
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${request.nextUrl.origin}/api/google/callback`
  
  // Google OAuth 2.0 Auth URL generator
  const scope = encodeURIComponent('https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.readonly email profile')
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`

  return NextResponse.json({
    authUrl,
    isConfigured: Boolean(clientId && process.env.GOOGLE_CLIENT_SECRET)
  })
}
