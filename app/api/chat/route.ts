import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyARv58Erha-p1HPwZf85RA1WKtyOXaHnfw'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent'
interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      )
    }

    // Build context from history
    let contextPrompt = `You are a helpful AI assistant for Brain Graph, an educational learning platform. 
You help students with their learning journey, answer questions about courses, provide study tips, 
explain concepts, and offer encouragement. Be friendly, supportive, and concise.

Current conversation:\n`

    if (history && Array.isArray(history)) {
      history.forEach((msg: Message) => {
        contextPrompt += `${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.content}\n`
      })
    }

    contextPrompt += `Student: ${message}\nAssistant:`

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: contextPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)
      
      // Return a friendly error message instead of throwing
      return NextResponse.json({ 
        response: 'I apologize, but I\'m having trouble connecting right now. This could be due to API rate limits or network issues. Please try again in a moment, or feel free to explore the platform features on your own!' 
      })
    }

    const data = await response.json()

    // Extract the response text
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                      'I apologize, but I couldn\'t generate a response. Please try again.'

    return NextResponse.json({ response: aiResponse })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Return a helpful fallback response instead of error
    return NextResponse.json({
      response: 'Hello! I\'m currently experiencing some technical difficulties connecting to my AI service. However, I can still help you navigate the platform! Here are some quick tips:\n\n• Click "Assessments" to take tests\n• Visit "Dashboard" to see your progress\n• Try "ADHD Mode" for focused learning\n• Check "Courses" for all available content\n\nPlease try chatting again in a moment, or explore these features on your own!'
    })
  }
}
