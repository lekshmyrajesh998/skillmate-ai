import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { Mic, Clock, CheckCircle2, Circle } from 'lucide-react'

interface Message {
  role: 'ai' | 'user'
  text: string
}

const TOPICS = ['Introduction', 'Technical depth', 'Collaboration', 'Growth areas', 'Wrap-up']
const EXPECTED_QUESTIONS = 5

export default function Interview() {
  const location = useLocation()
  const sessionId = (location.state as { sessionId?: string })?.sessionId

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const navigate = useNavigate()

  const questionIndex = messages.filter((m) => m.role === 'ai').length - 1

  useEffect(() => {
    if (!sessionId) {
      navigate('/dashboard')
      return
    }

    const socket = io('http://localhost:4000')
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('interview:start', { sessionId })
    })

    socket.on('interview:question', ({ text, isComplete }: { text: string; isComplete: boolean }) => {
      setMessages((prev) => [...prev, { role: 'ai', text }])
      setIsThinking(false)
      if (isComplete) {
        setTimeout(() => navigate('/feedback', { state: { sessionId } }), 2000)
      }
    })

    socket.on('interview:error', (msg: string) => {
      alert(msg)
      setIsThinking(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [sessionId, navigate])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  useEffect(() => {
    const timer = setInterval(() => setElapsed((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const handleSend = () => {
    if (!input.trim() || !socketRef.current) return
    setMessages((prev) => [...prev, { role: 'user', text: input }])
    socketRef.current.emit('interview:answer', { sessionId, answer: input })
    setInput('')
    setIsThinking(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#22D3EE] opacity-10 blur-[130px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-4 gap-6 h-[88vh]">
        <div className="hidden md:block bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 h-fit">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
            <Clock size={14} /> {formatTime(elapsed)} elapsed
          </div>
          <p className="text-xs uppercase tracking-wide text-white/40 mb-3 font-medium">Topics</p>
          <div className="space-y-3">
            {TOPICS.map((topic, i) => (
              <div key={topic} className={`flex items-center gap-2 text-sm ${i < questionIndex ? 'text-[#22D3EE]' : i === questionIndex ? 'text-white font-medium' : 'text-white/40'}`}>
                {i < questionIndex ? <CheckCircle2 size={15} className="text-[#22D3EE]" /> : <Circle size={15} className="opacity-40" />}
                {topic}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col h-full">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-display text-2xl">Live mock interview</h1>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" /> Recording
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(((questionIndex + 1) / EXPECTED_QUESTIONS) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-xs flex items-center justify-center mr-2 shrink-0 font-display">
                    S
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] rounded-br-md' : 'bg-white/10 rounded-bl-md'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] text-xs flex items-center justify-center font-display">S</div>
                <div className="bg-white/10 px-4 py-2.5 rounded-2xl rounded-bl-md flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 mt-4">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer… (Enter to send)"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF]/50 placeholder:text-white/30"
            />
            <button title="Voice input — coming soon" className="border border-white/10 rounded-lg px-4 text-white/50 hover:bg-white/10 transition-colors">
              <Mic size={18} />
            </button>
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] px-6 rounded-lg font-medium shadow-[0_0_20px_rgba(124,92,255,0.3)] hover:shadow-[0_0_30px_rgba(124,92,255,0.45)] transition-shadow"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}