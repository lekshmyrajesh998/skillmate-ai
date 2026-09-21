import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import authRoutes from './routes/auth'
import sessionRoutes from './routes/sessions'
import feedbackRoutes from './routes/feedback'
import { generateNextQuestion } from './lib/ai'
import { prisma } from './lib/prisma'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/sessions', sessionRoutes)
app.use('/api/feedback', feedbackRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillMate AI backend is running' })
})

app.use('/api/auth', authRoutes)

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' },
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('interview:start', async ({ sessionId }: { sessionId: string }) => {
    try {
      const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } })
      if (!session) return socket.emit('interview:error', 'Session not found')

      const result = await generateNextQuestion(
        session.jobDescription,
        session.resumeText,
        [],
        session.difficulty,
        session.roleType
      )
      await prisma.message.create({ data: { sessionId, role: 'ai', content: result.text } })

      socket.emit('interview:question', { text: result.text, isComplete: result.isComplete })
    } catch (err) {
      console.error('interview:start error:', err)
      socket.emit('interview:error', 'Could not start interview')
    }
  })

  socket.on('interview:answer', async ({ sessionId, answer }: { sessionId: string; answer: string }) => {
    try {
      await prisma.message.create({ data: { sessionId, role: 'user', content: answer } })

      const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } })
      const history = await prisma.message.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
      })

      const conversationHistory = history.map((m) => ({
        role: m.role === 'ai' ? ('assistant' as const) : ('user' as const),
        content: m.content,
      }))

      const result = await generateNextQuestion(
        session!.jobDescription,
        session!.resumeText,
        conversationHistory,
        session!.difficulty,
        session!.roleType
      )
      await prisma.message.create({ data: { sessionId, role: 'ai', content: result.text } })

      socket.emit('interview:question', { text: result.text, isComplete: result.isComplete })
    } catch (err) {
      console.error('interview:answer error:', err)
      socket.emit('interview:error', 'Could not process your answer')
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`SkillMate backend running on http://localhost:${PORT}`)
})