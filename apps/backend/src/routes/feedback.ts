import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { generateFeedback } from '../lib/feedback'

const router = Router()

// GET /api/feedback/:sessionId — generates (if needed) and returns feedback
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params

    const existing = await prisma.feedback.findUnique({ where: { sessionId } })
    if (existing) {
      return res.json(existing)
    }

    const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } })
    if (!session) return res.status(404).json({ error: 'Session not found' })

    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    })

    const result = await generateFeedback(session.jobDescription, session.resumeText, messages)

    const feedback = await prisma.feedback.create({
      data: { sessionId, ...result },
    })

    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: { status: 'completed' },
    })

    res.json(feedback)
  } catch (err) {
    console.error('Feedback error:', err)
    res.status(500).json({ error: 'Could not generate feedback' })
  }
})

export default router