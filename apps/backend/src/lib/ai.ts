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
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<AIResponse> {
  const questionCount = conversationHistory.filter((m) => m.role === 'assistant').length

  const systemPrompt = `You are conducting a live mock job interview. The candidate's resume: "${resumeText}". The job they're targeting: "${jobDescription}".

Ask one focused interview question at a time, grounded in their actual experience and the target role. If this is a follow-up, react briefly to their last answer, then ask the next question. Keep questions concise — 1-2 sentences.

This will be question number ${questionCount + 1}. If this is question 5 or later, instead of asking a new question, wrap up warmly and end your message with exactly this marker on its own line: [INTERVIEW_COMPLETE]`

  const historyText = conversationHistory
    .map((m) => `${m.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
    .join('\n')

  const prompt = conversationHistory.length > 0
    ? `${systemPrompt}\n\nConversation so far:\n${historyText}\n\nRespond with your next message now.`
    : `${systemPrompt}\n\nBegin the interview now with your first question.`

  const result = await model.generateContent(prompt)
  const rawText = result.response.text()

  const isComplete = rawText.includes('[INTERVIEW_COMPLETE]')
  const cleanText = rawText.replace('[INTERVIEW_COMPLETE]', '').trim()

  return { text: cleanText, isComplete }
}