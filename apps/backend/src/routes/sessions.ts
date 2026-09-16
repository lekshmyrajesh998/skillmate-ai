import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-this'

// Simple auth middleware — checks the JWT and attaches userId to the request
function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    req.userId = decoded.userId
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// POST /api/sessions — create a new interview session
router.post('/', requireAuth, async (req: any, res) => {
  try {
    const { jobDescription, resumeText } = req.body
    if (!jobDescription || !resumeText) {
      return res.status(400).json({ error: 'Job description and resume text are required' })
    }

    const session = await prisma.interviewSession.create({
      data: {
        userId: req.userId,
        jobDescription,
        resumeText,
      },
    })

    res.status(201).json({ sessionId: session.id })
  } catch (err) {
    console.error('Create session error:', err)
    res.status(500).json({ error: 'Could not start session' })
  }
})

export default router