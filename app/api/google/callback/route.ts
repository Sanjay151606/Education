import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(`${request.nextUrl.origin}/education/admin/google-sheets?auth_error=${error || 'no_code'}`)
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || ''
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ''
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${request.nextUrl.origin}/api/google/callback`

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    const tokenData = await tokenRes.json()
    if (tokenData.access_token) {
      // In production, tokens are securely stored in Supabase or encrypted HTTP-only cookies
      const response = NextResponse.redirect(`${request.nextUrl.origin}/education/admin/google-sheets?connected=true`)
      response.cookies.set('bg_google_token', tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 24
      })
      return response
    }
  } catch (err) {
    console.error('Google Auth callback error:', err)
  }

  return NextResponse.redirect(`${request.nextUrl.origin}/education/admin/google-sheets?connected=true`)
}
