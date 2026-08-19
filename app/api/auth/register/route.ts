import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()
    const userRole = role || 'student'

    const user = {
      id: `user_${Date.now()}`,
      name: name || 'New Learner',
      email: email || 'student@braingraph.ai',
      role: userRole
    }

    return NextResponse.json({
      success: true,
      token: `bg_token_${Date.now()}_${user.id}`,
      user
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 })
  }
}
