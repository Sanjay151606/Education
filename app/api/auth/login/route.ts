import { NextRequest, NextResponse } from 'next/server'
import { triggerWorkflowsByEvent } from '@/app/education/lib/agents/workflowEngine'

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    // Deterministic simulation & mock token issuance
    const userRole = role || (email?.includes('admin') ? 'admin' : 'student')
    const user = {
      id: userRole === 'admin' ? 'admin_1' : 'student_1',
      name: userRole === 'admin' ? 'System Administrator' : 'Alex Rivera',
      email: email || 'alex.rivera@braingraph.ai',
      role: userRole
    }

    // Trigger daily login workflow for students
    if (userRole === 'student') {
      triggerWorkflowsByEvent('STUDENT_LOGIN', { userId: user.id }).catch(console.error)
    }

    return NextResponse.json({
      success: true,
      token: `bg_token_${Date.now()}_${user.id}`,
      user
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 })
  }
}
