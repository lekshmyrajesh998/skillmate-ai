
import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { Mic, MicOff, Clock, Volume2, VolumeX } from 'lucide-react'
import { useSessionStore } from '../store/sessionStore'

interface Message {
  role: 'ai' | 'user'
  text: string
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((event: any) => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

const EXPECTED_QUESTIONS = 5

export default function Interview() {
  const location = useLocation()
  const storeSessionId = useSessionStore((s) => s.sessionId)

  const sessionId =
    (location.state as { sessionId?: string })?.sessionId || storeSessionId

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true)

  const bottomRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  const navigate = useNavigate()

  const questionIndex =
    messages.filter((m) => m.role === 'ai').length - 1

  const speak = useCallback(
    (text: string) => {
      if (!voiceOutputEnabled || !('speechSynthesis' in window)) {
        return
      }

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      utterance.rate = 1
      utterance.pitch = 1

      window.speechSynthesis.speak(utterance)
    },
    [voiceOutputEnabled]
  )

  // --------------------------------------------------
  // SOCKET CONNECTION
  // --------------------------------------------------
  useEffect(() => {
    if (!sessionId) {
      navigate('/dashboard')
      return
    }

    console.log('Starting interview with session:', sessionId)

    const socket = io(
      'https://skillmate-backend-63zd.onrender.com',
      {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 3,
        timeout: 15000,
      }
    )

    socketRef.current = socket

    // Connected
    socket.on('connect', () => {
      console.log(
        'Connected to SkillMate backend:',
        socket.id
      )

      setErrorMessage('')
      setIsThinking(true)

      console.log(
        'Sending interview:start:',
        sessionId
      )

      socket.emit('interview:start', {
        sessionId,
      })
    })

    // Initial / next question
    socket.on(
      'interview:question',
      ({
        text,
        isComplete,
      }: {
        text: string
        isComplete: boolean
      }) => {
        console.log(
          'Interview question received:',
          text
        )

        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text,
          },
        ])

        setIsThinking(false)
        setErrorMessage('')

        speak(text)

        if (isComplete) {
          setTimeout(() => {
            navigate('/feedback', {
              state: {
                sessionId,
              },
            })
          }, 3000)
        }
      }
    )

    // Backend error
    socket.on('interview:error', (msg: string) => {
      console.error(
        'Interview backend error:',
        msg
      )

      setIsThinking(false)

      // Show the exact backend message.
      setErrorMessage(
        msg || 'An unexpected interview error occurred.'
      )
    })

    // Socket connection error
    socket.on('connect_error', (error) => {
      console.error(
        'Socket.io connection error:',
        error.message
      )

      setIsThinking(false)

      setErrorMessage(
        `Unable to connect to the interview server: ${error.message}`
      )
    })

    // Socket reconnecting
    socket.io.on('reconnect_attempt', (attempt) => {
      console.log(
        'Socket reconnect attempt:',
        attempt
      )

      setIsThinking(true)
    })

    socket.io.on('reconnect_failed', () => {
      console.error(
        'Socket reconnection failed'
      )

      setIsThinking(false)

      setErrorMessage(
        'Unable to reconnect to the interview server.'
      )
    })

    return () => {
      console.log(
        'Cleaning up interview socket'
      )

      socket.disconnect()

      window.speechSynthesis?.cancel()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, navigate])

  // --------------------------------------------------
  // SPEECH RECOGNITION
  // --------------------------------------------------
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      setVoiceSupported(false)
      return
    }

    const recognition = new SpeechRecognitionAPI()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (
      event: SpeechRecognitionEvent
    ) => {
      let transcript = ''

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript
      }

      setInput(transcript)
    }

    recognition.onerror = (event) => {
      console.error(
        'Speech recognition error:',
        event
      )

      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
      recognitionRef.current = null
    }
  }, [])

  // --------------------------------------------------
  // AUTO SCROLL
  // --------------------------------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, isThinking])

  // --------------------------------------------------
  // TIMER
  // --------------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((t) => t + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60)
      .toString()
      .padStart(2, '0')}`

  // --------------------------------------------------
  // VOICE INPUT
  // --------------------------------------------------
  const toggleListening = () => {
    if (!recognitionRef.current) {
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    window.speechSynthesis?.cancel()

    setInput('')
    setErrorMessage('')

    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (error) {
      console.error(
        'Unable to start speech recognition:',
        error
      )

      setIsListening(false)
    }
  }

  // --------------------------------------------------
  // SEND ANSWER
  // --------------------------------------------------
  const handleSend = () => {
    const answer = input.trim()

    if (!answer) {
      return
    }

    if (!socketRef.current) {
      setErrorMessage(
        'Interview connection is not available.'
      )
      return
    }

    if (isThinking) {
      return
    }

    if (!socketRef.current.connected) {
      setErrorMessage(
        'Interview connection is unavailable. Please try again.'
      )
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    }

    console.log(
      'Sending interview answer:',
      answer
    )

    setErrorMessage('')

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: answer,
      },
    ])

    setInput('')
    setIsThinking(true)

    socketRef.current.emit(
      'interview:answer',
      {
        sessionId,
        answer,
      }
    )
  }

  // --------------------------------------------------
  // ENTER KEY
  // --------------------------------------------------
  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden md:pl-56 pt-16 pb-20 md:pt-0 md:pb-0"
      style={{
        background:
          'linear-gradient(180deg, var(--bg-page) 0%, var(--bg-page-2) 100%)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-8 flex flex-col h-[calc(100vh-9rem)] md:h-[88vh]">

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">

            <h1 className="font-display text-2xl">
              Live mock interview
            </h1>

            <div className="flex items-center gap-4">

              <button
                onClick={() =>
                  setVoiceOutputEnabled(
                    (v) => !v
                  )
                }
                style={{
                  color:
                    'var(--text-secondary)',
                }}
              >
                {voiceOutputEnabled ? (
                  <Volume2 size={18} />
                ) : (
                  <VolumeX size={18} />
                )}
              </button>

              <div
                className="flex items-center gap-2 text-sm"
                style={{
                  color:
                    'var(--text-secondary)',
                }}
              >
                <Clock size={14} />
                {formatTime(elapsed)}
              </div>

            </div>
          </div>

          <div
            className="w-full rounded-full h-1.5"
            style={{
              background: 'var(--border)',
            }}
          >
            <div
              className="bg-gradient-aurora h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  ((questionIndex + 1) /
                    EXPECTED_QUESTIONS) *
                    100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto space-y-4 surface rounded-2xl p-5">

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >

              {m.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-gradient-aurora text-xs flex items-center justify-center mr-2 shrink-0 font-display text-white">
                  S
                </div>
              )}

              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gradient-aurora text-white rounded-br-md'
                    : 'rounded-bl-md'
                }`}
                style={
                  m.role !== 'user'
                    ? {
                        background:
                          'var(--border)',
                      }
                    : {}
                }
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* Error */}
          {errorMessage && (
            <div
              className="text-center text-sm py-2"
              style={{
                color:
                  'var(--text-secondary)',
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex items-center gap-2">

              <div
                className="px-4 py-2.5 rounded-2xl rounded-bl-md flex gap-1"
                style={{
                  background:
                    'var(--border)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]"
                  style={{
                    background:
                      'var(--text-tertiary)',
                  }}
                />

                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]"
                  style={{
                    background:
                      'var(--text-tertiary)',
                  }}
                />

                <span
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{
                    background:
                      'var(--text-tertiary)',
                  }}
                />
              </div>

            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Voice animation */}
        {isListening && (
          <div className="flex items-center justify-center gap-1 mt-3 h-6">

            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className="w-1 rounded-full animate-pulse"
                style={{
                  height: `${8 + Math.random() * 16}px`,
                  background:
                    'linear-gradient(180deg, var(--accent-1), var(--accent-3))',
                  animationDelay: `${i * 60}ms`,
                  animationDuration: '600ms',
                }}
              />
            ))}

          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 mt-4">

          <textarea
            rows={2}
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'Listening…'
                : 'Type your answer… (Enter to send)'
            }
            className="flex-1 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2"
            style={{
              background:
                'var(--bg-page)',
              border:
                '1px solid var(--border)',
              color:
                'var(--text-primary)',
            }}
          />

          <button
            onClick={toggleListening}
            disabled={!voiceSupported}
            className={
              isListening
                ? 'rounded-lg px-4 bg-gradient-to-r from-[#F5605C] to-[#F5B942] text-white'
                : 'rounded-lg px-4 transition-colors disabled:opacity-30'
            }
            style={
              !isListening
                ? {
                    border:
                      '1px solid var(--border)',
                    color:
                      'var(--text-secondary)',
                  }
                : {}
            }
          >
            {isListening ? (
              <MicOff size={18} />
            ) : (
              <Mic size={18} />
            )}
          </button>

          <button
            onClick={handleSend}
            disabled={
              isThinking ||
              !input.trim()
            }
            className="bg-gradient-aurora text-white px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isThinking ? '...' : 'Send'}
          </button>

        </div>

        {!voiceSupported && (
          <p
            className="text-xs mt-2 text-center"
            style={{
              color:
                'var(--text-tertiary)',
            }}
          >
            Voice input isn't supported in this
            browser. Try Chrome or Edge.
          </p>
        )}

      </div>
    </div>
  )
}

