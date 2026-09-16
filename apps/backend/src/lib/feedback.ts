import dotenv from 'dotenv'
dotenv.config()

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })

interface FeedbackResult {
  overallScore: number
  clarityScore: number
  relevanceScore: number
  depthScore: number
  confidenceScore: number
  summary: string
}

export async function generateFeedback(
  jobDescription: string,
  resumeText: string,
  transcript: { role: string; content: string }[]
): Promise<FeedbackResult> {
  const conversationText = transcript
    .map((m) => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
    .join('\n')

  const prompt = `You are evaluating a mock interview. Job description: "${jobDescription}". Candidate resume: "${resumeText}".

Transcript:
${conversationText}

Score the candidate's answers from 0-100 on: clarity, relevance to the role, depth of detail, and confidence signals (based on response length/specificity). Also give an overall score and a 2-sentence summary.

Respond ONLY with valid JSON in this exact format, nothing else, no markdown code fences:
{"overallScore": number, "clarityScore": number, "relevanceScore": number, "depthScore": number, "confidenceScore": number, "summary": "string"}`

  const result = await model.generateContent(prompt)
  const raw = result.response.text()
  const cleaned = raw.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    return {
      overallScore: 70,
      clarityScore: 70,
      relevanceScore: 70,
      depthScore: 70,
      confidenceScore: 70,
      summary: 'Feedback generation had an issue — please try another session.',
    }
  }
}