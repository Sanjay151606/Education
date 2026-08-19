import { get_topic_mastery, search_learning_content } from './tools'
import { db } from '../db/database'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export interface TutorMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface TutorResponse {
  response: string
  masteryLevel: string
  topicTitle: string
  ragContextUsed: boolean
}

export async function runTutorAgent(
  userMessage: string,
  topicId: string | undefined,
  history: TutorMessage[]
): Promise<TutorResponse> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return {
      response: 'AI Tutor is temporarily unavailable (API key not configured). Please check your learning materials.',
      masteryLevel: 'Unknown',
      topicTitle: 'Unknown',
      ragContextUsed: false
    }
  }

  // Get student context
  const masteries = db.getAllTopicMasteries('student_1')
  const topics = db.getTopics()
  const topicMap = new Map(topics.map(t => [t.id, t]))

  let currentMastery = null
  let currentTopic = null
  let masteryLevel = 'Intermediate'
  let topicTitle = 'General Learning'

  if (topicId) {
    const { mastery, topic } = get_topic_mastery(topicId)
    currentMastery = mastery
    currentTopic = topic
    topicTitle = topic?.title ?? topicId

    if (mastery) {
      if (mastery.masteryScore >= 80) masteryLevel = 'Advanced'
      else if (mastery.masteryScore >= 50) masteryLevel = 'Intermediate'
      else masteryLevel = 'Beginner'
    }
  }

  // RAG: search relevant content
  const ragChunks = search_learning_content(userMessage)
  const ragContext = ragChunks.length > 0
    ? '\n\nRelevant educational content:\n' + ragChunks.map(c => c.content).join('\n---\n')
    : ''

  // Build weak topics context
  const weakTopics = masteries
    .filter(m => m.masteryScore < 60)
    .sort((a, b) => a.masteryScore - b.masteryScore)
    .slice(0, 3)
    .map(m => `${topicMap.get(m.topicId)?.title ?? m.topicId} (${m.masteryScore}%)`)
    .join(', ')

  const strongTopics = masteries
    .filter(m => m.masteryScore >= 80)
    .slice(0, 3)
    .map(m => `${topicMap.get(m.topicId)?.title ?? m.topicId} (${m.masteryScore}%)`)
    .join(', ')

  // Adapt system prompt to mastery level
  const adaptationGuide = masteryLevel === 'Beginner'
    ? 'Use simple language, real-world analogies, and step-by-step explanations. Avoid jargon. Encourage with positive reinforcement.'
    : masteryLevel === 'Advanced'
    ? 'Discuss internals, time/space complexity, edge cases, and optimization patterns. The student is ready for depth.'
    : 'Balance conceptual explanation with practical examples. Show code snippets when helpful.'

  const systemPrompt = `You are Brain Graph AI Tutor — a personalized, intelligent educational assistant.

STUDENT PROFILE:
- Current topic: ${topicTitle}
- Mastery level: ${masteryLevel}${currentMastery ? ` (${currentMastery.masteryScore}%)` : ''}
- Weak areas: ${weakTopics || 'None identified yet'}
- Strong areas: ${strongTopics || 'None identified yet'}
${currentMastery ? `- Attempts on this topic: ${currentMastery.attemptCount}, Correct: ${currentMastery.correctCount}, Wrong: ${currentMastery.incorrectCount}` : ''}

TEACHING APPROACH for ${masteryLevel} student:
${adaptationGuide}

RESPONSE GUIDELINES:
- Be concise but thorough
- Use markdown formatting (bold, code blocks, bullet points)
- If student seems confused, simplify
- After explaining, offer: "Would you like an example? Or shall I test you on this?"
- Reference student's specific weak topics when relevant
- Never give direct quiz answers — guide the thinking${ragContext}

Current conversation:`

  // Build conversation history
  let conversationText = systemPrompt + '\n'
  history.slice(-8).forEach(msg => {
    conversationText += `\n${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`
  })
  conversationText += `\nStudent: ${userMessage}\nTutor:`

  try {
    let aiResponse = ''

    // 1. If OpenAI API Key is present, try OpenAI GPT-4o-mini
    const openAIKey = process.env.OPENAI_API_KEY
    if (openAIKey) {
      try {
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
          { role: 'system', content: systemPrompt }
        ]
        history.slice(-8).forEach(msg => {
          messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          })
        })
        messages.push({ role: 'user', content: userMessage })

        const openAIRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.7,
            max_tokens: 1500
          })
        })

        if (openAIRes.ok) {
          const openAIData = await openAIRes.json()
          aiResponse = openAIData.choices?.[0]?.message?.content || ''
        }
      } catch (oaiErr) {
        console.warn('[TutorAgent] OpenAI error, falling back to Gemini:', oaiErr)
      }
    }

    // 2. Fallback to Gemini
    if (!aiResponse && apiKey) {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: conversationText }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1500,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ]
        })
      })

      if (response.ok) {
        const data = await response.json()
        aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      }
    }

    if (!aiResponse) {
      aiResponse = "I'm having trouble generating a response. Please try again."
    }

    // Log the interaction
    db.recordLearningEvent({
      studentId: 'student_1',
      eventType: 'CHAT_INTERACTION',
      topicId: topicId ?? 'general',
      metadata: { messageLength: userMessage.length, ragUsed: ragChunks.length > 0 }
    })

    return {
      response: aiResponse,
      masteryLevel,
      topicTitle,
      ragContextUsed: ragChunks.length > 0
    }
  } catch (error) {
    console.error('[TutorAgent] Error:', error)
    return {
      response: 'I\'m experiencing a temporary issue. You can continue with your study plan or review previous lessons while I get back online.',
      masteryLevel,
      topicTitle,
      ragContextUsed: false
    }
  }
}
