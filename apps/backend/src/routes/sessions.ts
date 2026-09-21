import { Router } from 'express'
import multer from 'multer'
//import pdfParse from 'pdf-parse'
import { prisma } from '../lib/prisma'
import { requireAuth } from '../middleware/requireAuth'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })
const pdfParseModule = require('pdf-parse')
const pdfParse = pdfParseModule.default || pdfParseModule

// POST /api/sessions/parse-resume — extract text from an uploaded PDF
router.post('/parse-resume', requireAuth, upload.single('resume'), async (req: any, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Please upload a PDF file' })
    }

    const data = await pdfParse(req.file.buffer)
    
    const text = data.text.trim().slice(0, 8000)

    if (!text || text.length < 50) {
      return res.status(400).json({ error: 'Could not read text from this PDF — try a different file' })
    }

    res.json({ resumeText: text })
  } catch (err) {
    console.error('Resume parse error:', err)
    res.status(500).json({ error: 'Could not process this PDF' })
  }
})

// POST /api/sessions — create a new interview session
router.post('/', requireAuth, async (req: any, res) => {
  try {
    const { jobDescription, resumeText, difficulty, roleType } = req.body
    if (!jobDescription || !resumeText) {
      return res.status(400).json({ error: 'Job description and resume text are required' })
    }

    const session = await prisma.interviewSession.create({
      data: {
        userId: req.userId,
        jobDescription,
        resumeText,
        difficulty: difficulty || 'mid',
        roleType: roleType || 'sde',
      },
    })

    res.status(201).json({ sessionId: session.id })
  } catch (err) {
    console.error('Create session error:', err)
    res.status(500).json({ error: 'Could not start session' })
  }
})

// GET /api/sessions — list the logged-in user's past sessions with feedback
router.get('/', requireAuth, async (req: any, res) => {
  try {
    const sessions = await prisma.interviewSession.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      include: { feedback: true },
    })
    res.json(sessions)
  } catch (err) {
    console.error('List sessions error:', err)
    res.status(500).json({ error: 'Could not load session history' })
  }
})

// GET /api/sessions/stats — aggregate stats for the logged-in user
// GET /api/sessions/stats — aggregate stats for the logged-in user
router.get('/stats', requireAuth, async (req: any, res) => {
  try {
    const sessions = await prisma.interviewSession.findMany({
      where: { userId: req.userId, status: 'completed' },
      include: { feedback: true },
      orderBy: { createdAt: 'asc' },
    })

    const scored = sessions.filter((s) => s.feedback)
    const totalInterviews = scored.length
    const avgScore = totalInterviews > 0
      ? Math.round(scored.reduce((sum, s) => sum + (s.feedback?.overallScore || 0), 0) / totalInterviews)
      : 0
    const bestScore = totalInterviews > 0 ? Math.max(...scored.map((s) => s.feedback?.overallScore || 0)) : 0

    const trend = scored.map((s) => ({ date: s.createdAt, score: s.feedback?.overallScore || 0 }))

    const avgBreakdown = totalInterviews > 0 ? {
      clarity: Math.round(scored.reduce((sum, s) => sum + (s.feedback?.clarityScore || 0), 0) / totalInterviews),
      relevance: Math.round(scored.reduce((sum, s) => sum + (s.feedback?.relevanceScore || 0), 0) / totalInterviews),
      depth: Math.round(scored.reduce((sum, s) => sum + (s.feedback?.depthScore || 0), 0) / totalInterviews),
      confidence: Math.round(scored.reduce((sum, s) => sum + (s.feedback?.confidenceScore || 0), 0) / totalInterviews),
    } : { clarity: 0, relevance: 0, depth: 0, confidence: 0 }

    // Practice streak: distinct days with a completed session in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentDays = new Set(
      scored.filter((s) => s.createdAt >= sevenDaysAgo).map((s) => s.createdAt.toISOString().slice(0, 10))
    )

    res.json({ totalInterviews, avgScore, bestScore, trend, avgBreakdown, streakDays: recentDays.size })
  } catch (err) {
    console.error('Stats error:', err)
    res.status(500).json({ error: 'Could not load stats' })
  }
})

export default router