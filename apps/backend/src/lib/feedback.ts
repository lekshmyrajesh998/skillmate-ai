import dotenv from 'dotenv'
dotenv.config()

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ''
)

const primaryModel = genAI.getGenerativeModel({
  model: 'gemini-3.6-flash',
})

const fallbackModel = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash-lite',
})

interface FeedbackResult {
  overallScore: number
  clarityScore: number
  relevanceScore: number
  depthScore: number
  confidenceScore: number
  summary: string
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
        `Gemini feedback generated successfully using ${modelName}`
      )

      return result
    } catch (err: any) {
      const message = err?.message || String(err)

      console.error(
        `Gemini feedback ${modelName} attempt ${attempt} failed:`,
        message
      )

      if (attempt < maxAttempts) {
        const waitTime = 1000 * Math.pow(2, attempt - 1)

        console.log(
          `Retrying feedback ${modelName} in ${waitTime}ms...`
        )

        await delay(waitTime)
      }
    }
  }

  return null
}

export async function generateFeedback(
  jobDescription: string,
  resumeText: string,
  transcript: { role: string; content: string }[]
): Promise<FeedbackResult> {
  const conversationText = transcript
    .map(
      (m) =>
        `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.content}`
    )
    .join('\n')

  const prompt = `You are evaluating a mock interview.

Job description:
"${jobDescription}"

Candidate resume:
"${resumeText}"

Transcript:
${conversationText}

Score the candidate's answers from 0-100 on:
- clarity
- relevance to the role
- depth of detail
- confidence signals based on response length and specificity

Also provide an overall score and a 2-sentence summary.

Respond ONLY with valid JSON in this exact format, nothing else:
{"overallScore": number, "clarityScore": number, "relevanceScore": number, "depthScore": number, "confidenceScore": number, "summary": "string"}`

  let result = await generateWithRetry(
    primaryModel,
    prompt,
    'gemini-3.6-flash'
  )

  if (!result) {
    console.warn(
      'Gemini 3.6 unavailable for feedback. Trying Gemini 3.5 Flash-Lite...'
    )

    result = await generateWithRetry(
      fallbackModel,
      prompt,
      'gemini-3.5-flash-lite'
    )
  }

  if (!result) {
    throw new Error(
      'AI feedback service is temporarily unavailable. Please try again in a moment.'
    )
  }

  const raw = result.response.text()

  const cleaned = raw
    .replace(/```json|```/g, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    return {
      overallScore: 70,
      clarityScore: 70,
      relevanceScore: 70,
      depthScore: 70,
      confidenceScore: 70,
      summary:
        'Feedback generation had an issue — please try another session.',
    }
  }
}