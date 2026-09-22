import dotenv from 'dotenv'
dotenv.config()

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })

interface AIResponse {
  text: string
  isComplete: boolean
}

export async function generateNextQuestion(
  jobDescription: string,
  resumeText: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[],
  difficulty: string = 'mid',
  roleType: string = 'sde'
): Promise<AIResponse> {
  const questionCount = conversationHistory.filter((m) => m.role === 'assistant').length

  const difficultyGuidance: Record<string, string> = {
    junior: 'Ask foundational questions suitable for someone with 0-2 years experience. Keep questions approachable and encouraging.',
    mid: 'Ask questions expecting solid hands-on experience (2-5 years). Probe for real trade-offs and decisions they made.',
    senior: 'Ask challenging questions expecting deep expertise (5+ years) — system design thinking, leadership, and complex trade-offs.',
  }

  const roleGuidance: Record<string, string> = {
    sde: 'Focus on technical implementation, architecture decisions, and engineering trade-offs.',
    pm: 'Focus on product strategy, prioritization, stakeholder management, and metrics-driven thinking.',
    data: 'Focus on data pipelines, analysis rigor, experiment design, and translating data into decisions.',
    sales: 'Focus on relationship building, negotiation, quota achievement, and objection handling.',
    marketing: 'Focus on campaign strategy, brand thinking, growth metrics, and creative-to-data balance.',
  }

  const systemPrompt = `You are conducting a live mock job interview. The candidate's resume: "${resumeText}". The job they're targeting: "${jobDescription}".

${difficultyGuidance[difficulty] || difficultyGuidance.mid}
${roleGuidance[roleType] || roleGuidance.sde}

Ask one focused interview question at a time, grounded in their actual experience and the target role. If this is a follow-up, react briefly to their last answer, then ask the next question. Keep questions concise — 1-2 sentences.

This will be question number ${questionCount + 1}. If this is question 5 or later, instead of asking a new question, wrap up warmly and end your message with exactly this marker on its own line: [INTERVIEW_COMPLETE]`

  const historyText = conversationHistory
    .map((m) => `${m.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
    .join('\n')

  const prompt = conversationHistory.length > 0
    ? `${systemPrompt}\n\nConversation so far:\n${historyText}\n\nRespond with your next message now.`
    : `${systemPrompt}\n\nBegin the interview now with your first question.`

   let result
  try {
    result = await model.generateContent(prompt)
  } catch (err: any) {
    console.error('Gemini API error:', err.message || err)
    // Retry once after a short delay — handles transient rate limits
    await new Promise((r) => setTimeout(r, 2000))
    try {
      result = await model.generateContent(prompt)
    } catch (retryErr: any) {
      console.error('Gemini API retry also failed:', retryErr.message || retryErr)
throw new Error('High demand right now — please wait a moment and try again')
    }
  }

  const rawText = result.response.text()

  const isComplete = rawText.includes('[INTERVIEW_COMPLETE]')
  const cleanText = rawText.replace('[INTERVIEW_COMPLETE]', '').trim()

  return { text: cleanText, isComplete }
}
