import dotenv from 'dotenv'
dotenv.config()

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ''
)

const primaryModel = genAI.getGenerativeModel({
  model: 'gemini-3.8-flash',
})

const fallbackModel = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash-lite',
})

interface AIResponse {
  text: string
  isComplete: boolean
}

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

async function generateWithRetry(
  model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>,
  prompt: string,
  modelName: string
) {
  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await model.generateContent(prompt)

      console.log(
        `Gemini response generated successfully using ${modelName}`
      )

      return result
    } catch (err: any) {
      const message = err?.message || String(err)

      console.error(
        `Gemini ${modelName} attempt ${attempt} failed:`,
        message
      )

      if (attempt < maxAttempts) {
        const waitTime = 1000 * Math.pow(2, attempt - 1)

        console.log(
          `Retrying ${modelName} in ${waitTime}ms...`
        )

        await delay(waitTime)
      }
    }
  }

  return null
}

export async function generateNextQuestion(
  jobDescription: string,
  resumeText: string,
  conversationHistory: {
    role: 'user' | 'assistant'
    content: string
  }[],
  difficulty: string = 'mid',
  roleType: string = 'sde'
): Promise<AIResponse> {
  const questionCount = conversationHistory.filter(
    (m) => m.role === 'assistant'
  ).length

  const difficultyGuidance: Record<string, string> = {
    junior:
      'Ask foundational questions suitable for someone with 0-2 years experience. Keep questions approachable and encouraging.',

    mid:
      'Ask questions expecting solid hands-on experience (2-5 years). Probe for real trade-offs and decisions they made.',

    senior:
      'Ask challenging questions expecting deep expertise (5+ years) — system design thinking, leadership, and complex trade-offs.',
  }

  const roleGuidance: Record<string, string> = {
    sde:
      'Focus on technical implementation, architecture decisions, and engineering trade-offs.',

    pm:
      'Focus on product strategy, prioritization, stakeholder management, and metrics-driven thinking.',

    data:
      'Focus on data pipelines, analysis rigor, experiment design, and translating data into decisions.',

    sales:
      'Focus on relationship building, negotiation, quota achievement, and objection handling.',

    marketing:
      'Focus on campaign strategy, brand thinking, growth metrics, and creative-to-data balance.',
  }

  const systemPrompt = `You are conducting a live job interview.

Candidate resume:
${resumeText}

Target job:
${jobDescription}

${difficultyGuidance[difficulty] || difficultyGuidance.mid}

${roleGuidance[roleType] || roleGuidance.sde}

Ask one focused interview question at a time, grounded in the candidate's actual experience and target role.

If this is a follow-up, briefly react to the candidate's previous answer and then ask the next question.

Keep the response concise — 1-2 sentences.

This is question number ${questionCount + 1}.

If this is question 5 or later, wrap up the interview warmly and end your response with exactly:

[INTERVIEW_COMPLETE]`

  const historyText = conversationHistory
    .map(
      (m) =>
        `${m.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${m.content}`
    )
    .join('\n')

  const prompt =
    conversationHistory.length > 0
      ? `${systemPrompt}

Conversation so far:
${historyText}

Respond with your next interview message now.`
      : `${systemPrompt}

Begin the interview now with the first question.`

  // -----------------------------------------
  // 1. Try Gemini 3.8 Flash
  // -----------------------------------------

  let result = await generateWithRetry(
    primaryModel,
    prompt,
    'gemini-3.8-flash'
  )

  // -----------------------------------------
  // 2. Try Gemini 3.5 Flash-Lite
  // -----------------------------------------

  if (!result) {
    console.warn(
      'Gemini 3.8 unavailable. Trying Gemini 3.5 Flash-Lite...'
    )

    result = await generateWithRetry(
      fallbackModel,
      prompt,
      'gemini-3.5-flash-lite'
    )
  }

  // -----------------------------------------
  // 3. If Gemini is temporarily unavailable
  // -----------------------------------------

  if (!result) {
    throw new Error(
      'AI service is temporarily unavailable. Please try again in a moment.'
    )
  }

  const rawText = result.response.text()

  const isComplete = rawText.includes(
    '[INTERVIEW_COMPLETE]'
  )

  const cleanText = rawText
    .replace('[INTERVIEW_COMPLETE]', '')
    .trim()

  return {
    text: cleanText,
    isComplete,
  }
}