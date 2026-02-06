import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const submission = await request.json()

    // Log the entire submission to console
    console.log('='.repeat(80))
    console.log('TEST SUBMISSION RECEIVED')
    console.log('='.repeat(80))
    console.log('Submitted At:', submission.submittedAt)
    console.log('User Agent:', submission.userAgent)
    console.log('\n--- SECTION A: READING & LISTENING ---')
    console.log(JSON.stringify(submission.answers.sectionA, null, 2))
    console.log('\n--- SECTION B: SPEAKING ---')
    console.log(JSON.stringify(submission.answers.sectionB, null, 2))
    console.log('\n--- SECTION C: GRAMMAR ---')
    console.log(JSON.stringify(submission.answers.sectionC, null, 2))
    console.log('\n--- SECTION D: LISTENING COMPREHENSION ---')
    console.log(JSON.stringify(submission.answers.sectionD, null, 2))
    console.log('\n--- PROGRESS DATA ---')
    console.log(JSON.stringify(submission.progress, null, 2))
    console.log('='.repeat(80))

    // Count answers
    const stats = {
      sectionA: Object.keys(submission.answers.sectionA || {}).length,
      sectionB: Object.keys(submission.answers.sectionB || {}).length,
      sectionC: Object.keys(submission.answers.sectionC || {}).length,
      sectionD: Object.keys(submission.answers.sectionD || {}).length,
    }

    const totalAnswers = stats.sectionA + stats.sectionB + stats.sectionC + stats.sectionD
    const expectedTotal = 23 + 4 + 34 + 16 // 77 total

    console.log('\n--- STATISTICS ---')
    console.log(`Section A: ${stats.sectionA}/23 items`)
    console.log(`Section B: ${stats.sectionB}/4 tasks`)
    console.log(`Section C: ${stats.sectionC}/34 questions`)
    console.log(`Section D: ${stats.sectionD}/16 questions`)
    console.log(`Total: ${totalAnswers}/${expectedTotal} responses`)
    console.log('='.repeat(80))

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Test submitted successfully',
      stats,
      totalAnswers,
      expectedTotal,
      completionRate: `${((totalAnswers / expectedTotal) * 100).toFixed(1)}%`
    })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    )
  }
}
