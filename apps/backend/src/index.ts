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

// API routes
app.use('/api/sessions', sessionRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/auth', authRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SkillMate AI backend is running',
  })
})

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://skillmate-ai-zeta.vercel.app',
      'https://skillmate-dcnuk2rbr-lekshmyrajesh998.vercel.app',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // --------------------------------------------------
  // START INTERVIEW
  // --------------------------------------------------
  socket.on(
    'interview:start',
    async ({ sessionId }: { sessionId: string }) => {
      try {
        console.log(
          'Starting interview for session:',
          sessionId
        )

        if (!sessionId) {
          console.error(
            'Interview start failed: sessionId is missing'
          )

          return socket.emit(
            'interview:error',
            'Session ID is missing. Please start a new interview.'
          )
        }

        const session =
          await prisma.interviewSession.findUnique({
            where: {
              id: sessionId,
            },
          })

        if (!session) {
          console.error(
            'Interview session not found:',
            sessionId
          )

          return socket.emit(
            'interview:error',
            'Session not found. Please start a new interview.'
          )
        }

        console.log(
          'Interview session found:',
          session.id
        )

        console.log(
          'Generating initial interview question...'
        )

        const result = await generateNextQuestion(
          session.jobDescription,
          session.resumeText,
          [],
          session.difficulty,
          session.roleType
        )

        console.log(
          'Initial interview question generated successfully'
        )

        await prisma.message.create({
          data: {
            sessionId,
            role: 'ai',
            content: result.text,
          },
        })

        console.log(
          'Initial interview question saved to database'
        )

        socket.emit('interview:question', {
          text: result.text,
          isComplete: result.isComplete,
        })
      } catch (err: any) {
        console.error(
          'interview:start error:',
          err?.message || err
        )

        console.error(
          'Full interview:start error:',
          err
        )

        socket.emit(
          'interview:error',
          'Unable to start the interview. Please try again.'
        )
      }
    }
  )

  // --------------------------------------------------
  // SUBMIT INTERVIEW ANSWER
  // --------------------------------------------------
  socket.on(
    'interview:answer',
    async ({
      sessionId,
      answer,
    }: {
      sessionId: string
      answer: string
    }) => {
      try {
        console.log(
          'Processing interview answer for session:',
          sessionId
        )

        if (!sessionId) {
          console.error(
            'Answer processing failed: sessionId is missing'
          )

          return socket.emit(
            'interview:error',
            'Session ID is missing. Please restart the interview.'
          )
        }

        if (!answer?.trim()) {
          console.error(
            'Answer processing failed: answer is empty'
          )

          return socket.emit(
            'interview:error',
            'Please provide an answer before continuing.'
          )
        }

        // Save candidate answer
        await prisma.message.create({
          data: {
            sessionId,
            role: 'user',
            content: answer.trim(),
          },
        })

        console.log(
          'Candidate answer saved successfully'
        )

        // Get interview session
        const session =
          await prisma.interviewSession.findUnique({
            where: {
              id: sessionId,
            },
          })

        if (!session) {
          console.error(
            'Interview session not found while processing answer:',
            sessionId
          )

          return socket.emit(
            'interview:error',
            'Session not found. Please start a new interview.'
          )
        }

        // Get complete conversation history
        const history =
          await prisma.message.findMany({
            where: {
              sessionId,
            },
            orderBy: {
              createdAt: 'asc',
            },
          })

        console.log(
          'Conversation history loaded:',
          history.length,
          'messages'
        )

        const conversationHistory =
          history.map((m) => ({
            role:
              m.role === 'ai'
                ? ('assistant' as const)
                : ('user' as const),
            content: m.content,
          }))

        console.log(
          'Generating next interview question...'
        )

        const result = await generateNextQuestion(
          session.jobDescription,
          session.resumeText,
          conversationHistory,
          session.difficulty,
          session.roleType
        )

        console.log(
          'Next interview question generated successfully'
        )

        // Save AI response
        await prisma.message.create({
          data: {
            sessionId,
            role: 'ai',
            content: result.text,
          },
        })

        console.log(
          'Next interview question saved successfully'
        )

        socket.emit('interview:question', {
          text: result.text,
          isComplete: result.isComplete,
        })
      } catch (err: any) {
        console.error(
          'interview:answer error:',
          err?.message || err
        )

        console.error(
          'Full interview:answer error:',
          err
        )

        socket.emit(
          'interview:error',
          'AI is temporarily unavailable. Please try again.'
        )
      }
    }
  )

  // --------------------------------------------------
  // DISCONNECT
  // --------------------------------------------------
  socket.on('disconnect', (reason) => {
    console.log(
      'Client disconnected:',
      socket.id,
      'Reason:',
      reason
    )
  })
})

const PORT = process.env.PORT || 4000

httpServer.listen(PORT, () => {
  console.log(
    `SkillMate backend running on port ${PORT}`
  )
})