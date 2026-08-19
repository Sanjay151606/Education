import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

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

    // 1. Try OpenAI API first if OPENAI_API_KEY is available
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (OPENAI_API_KEY) {
      try {
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
          {
            role: 'system',
            content: 'You are a helpful AI assistant for Brain Graph, an educational learning platform. You help students with their learning journey, answer questions about courses, provide study tips, explain concepts, and offer encouragement. Be friendly, supportive, and concise.'
          }
        ]

        if (history && Array.isArray(history)) {
          history.forEach((msg: Message) => {
            messages.push({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            })
          })
        }

        messages.push({ role: 'user', content: message })

        const openAIRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.7,
            max_tokens: 1024
          })
        })

        if (openAIRes.ok) {
          const openAIData = await openAIRes.json()
          const aiResponse = openAIData.choices?.[0]?.message?.content
          if (aiResponse) {
            return NextResponse.json({ response: aiResponse })
          }
        }
      } catch (openAiErr) {
        console.warn('OpenAI Chat error, falling back to Gemini:', openAiErr)
      }
    }

    // 2. Fallback to Gemini API
    if (GEMINI_API_KEY) {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: contextPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const aiResponse =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "I couldn't generate a response. Please try again."
        return NextResponse.json({ response: aiResponse })
      }
    }

    // 3. Fallback: Offline Educational Intelligent Assistant (Knowledge Engine)
    const lower = message.toLowerCase()
    let offlineReply = ''

    if (lower.includes('binary search') || lower.includes('tree') || lower.includes('bst')) {
      offlineReply = "A **Binary Search Tree (BST)** is a node-based binary tree data structure where each node has at most two children. The left subtree contains only nodes with keys lesser than the node's key, and the right subtree contains only nodes with keys greater than the node's key. Searching, insertion, and deletion operate in $O(\\log n)$ average time complexity."
    } else if (lower.includes('recursion') || lower.includes('recursive')) {
      offlineReply = "**Recursion** is a programming technique where a function calls itself to solve smaller instances of the same problem until reaching a **base case**. Key components: 1) Base Case (stop condition), 2) Recursive Step (moving toward the base case), and 3) Call Stack memory overhead."
    } else if (lower.includes('linked list') || lower.includes('pointer')) {
      offlineReply = "A **Linked List** is a linear data structure where elements are not stored in contiguous memory locations. Instead, each element (node) consists of a data field and a reference (`next` pointer) to the next node in the sequence."
    } else if (lower.includes('course') || lower.includes('learn') || lower.includes('study')) {
      offlineReply = "Brain Graph offers structured courses in **Data Structures & Algorithms**, **Operating Systems & System Design**, and **Full-Stack Web Development**. You can review your customized Daily Study Plan or test your knowledge in the Quiz Runner!"
    } else {
      offlineReply = `Hello! I'm your Brain Graph AI Assistant. I can help guide you through complex computer science concepts, review your weak topics, explain code algorithms, or prepare you for upcoming quizzes. What would you like to explore today?`
    }

    return NextResponse.json({ response: offlineReply })
  } catch (error) {
    console.error('Chat API error:', error)

    return NextResponse.json({
      response: "Hello! I'm your Brain Graph AI Assistant. Ask me any question regarding your curriculum, algorithms, or study plan.",
    })
  }
}
