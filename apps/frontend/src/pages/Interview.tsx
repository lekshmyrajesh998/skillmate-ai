import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  Wifi,
  Send,
} from 'lucide-react'
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

  const questionCount = messages.filter((m) => m.role === 'ai').length
  const currentQuestion = Math.min(questionCount, EXPECTED_QUESTIONS)

  const progress =
    Math.min((currentQuestion / EXPECTED_QUESTIONS) * 100, 100)

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

    socket.on('connect', () => {
      console.log(
        'Connected to SkillMate backend:',
        socket.id
      )

      setErrorMessage('')
      setIsThinking(true)

      socket.emit('interview:start', {
        sessionId,
      })
    })

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

    socket.on('interview:error', (msg: string) => {
      console.error(
        'Interview backend error:',
        msg
      )

      setIsThinking(false)

      setErrorMessage(
        msg || 'An unexpected interview error occurred.'
      )
    })

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
      className="relative min-h-screen overflow-hidden "
      style={{
    background:
      'linear-gradient(180deg, var(--bg-page) 0%, var(--bg-page-2) 100%)',
    color: 'var(--text-primary)',
  }}
    >
      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 animate-[drift_10s_ease-in-out_infinite] rounded-full blur-3xl"
        style={{
          background:
            'color-mix(in srgb, var(--accent-1) 10%, transparent)',
        }}
      />

      <div
        className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 animate-[drift_14s_ease-in-out_infinite_reverse] rounded-full blur-3xl"
        style={{
          background:
            'color-mix(in srgb, var(--accent-2) 7%, transparent)',
        }}
      />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-28 pt-20 sm:px-6 md:px-8 md:pb-8 md:pt-8">

        {/* =================================================
            TOP BAR
        ================================================= */}
        <header
          className="mb-5 animate-[fadeIn_0.45s_ease-out] rounded-2xl border px-4 py-3 shadow-sm sm:px-5"
          style={{
            background:
              'color-mix(in srgb, var(--bg-page) 88%, transparent)',
            borderColor: 'var(--border)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">
              <div
                className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-all duration-300 hover:scale-105 hover:rotate-2"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                }}
              >
                <Sparkles
                  size={18}
                  className="transition-transform duration-500 group-hover:rotate-12"
                />

                <span
                  className="absolute inset-0 rounded-xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40"
                  style={{
                    background: 'var(--accent-1)',
                  }}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate font-display text-sm font-bold sm:text-base">
                    Live interview
                  </h1>

                  <span
                    className="hidden items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:flex"
                    style={{
                      color: 'var(--accent-3)',
                      background:
                        'color-mix(in srgb, var(--accent-3) 10%, transparent)',
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 animate-pulse rounded-full"
                      style={{
                        background: 'var(--accent-3)',
                      }}
                    />
                    LIVE
                  </span>
                </div>

                <p
                  className="text-[11px]"
                  style={{
                    color: 'var(--text-tertiary)',
                  }}
                >
                  AI-powered interview practice
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">

              {/* Connection */}
              <div
                className="hidden items-center gap-1.5 text-xs sm:flex"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40"
                    style={{
                      background: 'var(--accent-3)',
                    }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{
                      background: 'var(--accent-3)',
                    }}
                  />
                </span>

                <Wifi size={14} />
                Connected
              </div>

              {/* Voice output */}
              <button
                type="button"
                onClick={() =>
                  setVoiceOutputEnabled(
                    (v) => !v
                  )
                }
                className="group flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 hover:shadow-sm active:scale-95"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-page)',
                }}
                title={
                  voiceOutputEnabled
                    ? 'Mute AI voice'
                    : 'Enable AI voice'
                }
              >
                {voiceOutputEnabled ? (
                  <Volume2
                    size={17}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <VolumeX size={17} />
                )}
              </button>

              {/* Timer */}
              <div
                className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold tabular-nums"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-page)',
                }}
              >
                <Clock size={14} />
                {formatTime(elapsed)}
              </div>

            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span
                className="text-[11px] font-medium"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                Interview progress
              </span>

              <span
                className="text-[11px] font-semibold"
                style={{
                  color: 'var(--text-secondary)',
                }}
              >
                {currentQuestion}/{EXPECTED_QUESTIONS}
              </span>
            </div>

            <div
              className="h-1.5 overflow-hidden rounded-full"
              style={{
                background: 'var(--border)',
              }}
            >
              <div
                className="relative h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progress}%`,
                  background:
                    'linear-gradient(90deg, var(--accent-1), var(--accent-2), var(--accent-3))',
                }}
              >
                <span
                  className="absolute right-0 top-0 h-full w-12 animate-pulse rounded-full opacity-60"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.8))',
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* =================================================
            INTERVIEW AREA
        ================================================= */}
        <section
          className="flex min-h-0 flex-1 animate-[fadeIn_0.6s_ease-out] flex-col overflow-hidden rounded-3xl border shadow-sm transition-all duration-300"
          style={{
            background:
              'color-mix(in srgb, var(--bg-page) 92%, transparent)',
            borderColor: 'var(--border)',
          }}
        >

          {/* Section heading */}
          <div
            className="flex items-center justify-between border-b px-5 py-4 sm:px-6"
            style={{
              borderColor: 'var(--border)',
            }}
          >
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{
                  color: 'var(--accent-1)',
                }}
              >
                Question {Math.max(currentQuestion, 1)}
              </p>

              <p
                className="mt-0.5 text-xs"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                Take your time and answer naturally
              </p>
            </div>

            <div
              className="hidden items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors sm:flex"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-tertiary)',
              }}
            >
              <Mic size={12} />
              Voice enabled
            </div>
          </div>

          {/* =================================================
              CONVERSATION
          ================================================= */}
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">

            {/* Initial loading */}
            {messages.length === 0 && isThinking && (
              <div className="flex min-h-[280px] items-center justify-center animate-[fadeIn_0.5s_ease-out]">
                <div className="text-center">

                  <div
                    className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      background:
                        'color-mix(in srgb, var(--accent-1) 10%, transparent)',
                    }}
                  >
                    <span
                      className="absolute inset-0 animate-ping rounded-2xl opacity-20"
                      style={{
                        background: 'var(--accent-1)',
                      }}
                    />

                    <Sparkles
                      size={24}
                      className="relative animate-pulse"
                      style={{
                        color: 'var(--accent-1)',
                      }}
                    />
                  </div>

                  <h2 className="font-display text-lg font-semibold">
                    Preparing your interview
                  </h2>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Your AI interviewer is getting the first question ready.
                  </p>

                  <div className="mt-5 flex justify-center gap-1">
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full"
                      style={{
                        background: 'var(--accent-1)',
                        animationDelay: '-0.3s',
                      }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full"
                      style={{
                        background: 'var(--accent-2)',
                        animationDelay: '-0.15s',
                      }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full"
                      style={{
                        background: 'var(--accent-3)',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex animate-[fadeIn_0.4s_ease-out] ${
                  m.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
                style={{
                  animationDelay: `${Math.min(i * 40, 200)}ms`,
                }}
              >
                {m.role === 'ai' && (
                  <div className="mr-3 flex shrink-0 flex-col items-center">
                    <div
                      className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm transition-all duration-300 hover:scale-105"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                      }}
                    >
                      <Sparkles
                        size={16}
                        className="transition-transform duration-500 group-hover:rotate-12"
                      />

                      <span
                        className="absolute inset-0 -z-10 rounded-xl opacity-0 blur-md transition-opacity group-hover:opacity-50"
                        style={{
                          background: 'var(--accent-1)',
                        }}
                      />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[72%] ${
                    m.role === 'user'
                      ? 'items-end'
                      : 'items-start'
                  }`}
                >
                  <p
                    className="mb-1.5 px-1 text-[10px] font-semibold"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {m.role === 'user'
                      ? 'You'
                      : 'SkillMate AI'}
                  </p>

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 transition-all duration-200 ${
                      m.role === 'user'
                        ? 'rounded-br-md text-white shadow-sm hover:shadow-md'
                        : 'rounded-bl-md border hover:shadow-sm'
                    }`}
                    style={
                      m.role === 'user'
                        ? {
                            background:
                              'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                          }
                        : {
                            background:
                              'color-mix(in srgb, var(--border) 55%, transparent)',
                            borderColor: 'var(--border)',
                          }
                    }
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            ))}

            {/* Error */}
            {errorMessage && (
              <div
                className="mx-auto max-w-xl animate-[fadeIn_0.3s_ease-out] rounded-2xl border px-4 py-3 text-center text-xs"
                style={{
                  borderColor:
                    'color-mix(in srgb, #ef4444 25%, var(--border))',
                  background:
                    'color-mix(in srgb, #ef4444 7%, transparent)',
                  color: 'var(--text-secondary)',
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* Thinking */}
            {isThinking && messages.length > 0 && (
              <div className="flex animate-[fadeIn_0.3s_ease-out] items-start gap-3">
                <div
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                  }}
                >
                  <span
                    className="absolute inset-0 animate-ping rounded-xl opacity-20"
                    style={{
                      background: 'var(--accent-1)',
                    }}
                  />

                  <Sparkles
                    size={16}
                    className="relative animate-pulse"
                  />
                </div>

                <div
                  className="rounded-2xl rounded-bl-md border px-4 py-3"
                  style={{
                    background:
                      'color-mix(in srgb, var(--border) 55%, transparent)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full"
                      style={{
                        background: 'var(--accent-1)',
                        animationDelay: '-0.3s',
                      }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full"
                      style={{
                        background: 'var(--accent-2)',
                        animationDelay: '-0.15s',
                      }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-bounce rounded-full"
                      style={{
                        background: 'var(--accent-3)',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* =================================================
              ANSWER COMPOSER
          ================================================= */}
          <div
            className="border-t px-4 py-4 sm:px-6"
            style={{
              borderColor: 'var(--border)',
              background:
                'color-mix(in srgb, var(--bg-page-2) 45%, transparent)',
            }}
          >

            {/* Voice visualizer */}
            {isListening && (
              <div className="mb-3 flex h-7 items-center justify-center gap-1 animate-[fadeIn_0.25s_ease-out]">
                {[...Array(24)].map((_, i) => (
                  <span
                    key={i}
                    className="w-1 animate-pulse rounded-full"
                    style={{
                      height: `${8 + ((i * 7) % 16)}px`,
                      background:
                        'linear-gradient(180deg, var(--accent-1), var(--accent-3))',
                      animationDelay: `${i * 50}ms`,
                      animationDuration: '600ms',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Composer */}
            <div
              className="rounded-2xl border p-2 transition-all duration-300"
              style={{
                borderColor: isListening
                  ? 'var(--accent-1)'
                  : 'var(--border)',
                background: 'var(--bg-page)',
                boxShadow: isListening
                  ? '0 0 0 3px color-mix(in srgb, var(--accent-1) 8%, transparent), 0 12px 35px color-mix(in srgb, var(--accent-1) 8%, transparent)'
                  : 'none',
              }}
            >
              <div className="flex items-end gap-2">

                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isListening
                      ? 'Listening to your answer…'
                      : 'Type your answer here…'
                  }
                  disabled={isThinking}
                  className="min-h-[56px] flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    color: 'var(--text-primary)',
                  }}
                />

                <div className="flex items-center gap-1.5 pb-1">

                  {/* Mic */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={!voiceSupported || isThinking}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${
                      isListening
                        ? 'animate-pulse'
                        : ''
                    }`}
                    style={
                      isListening
                        ? {
                            background:
                              'linear-gradient(135deg, #f5605c, #f5b942)',
                            color: 'white',
                            boxShadow:
                              '0 0 0 4px color-mix(in srgb, #f5605c 12%, transparent)',
                          }
                        : {
                            color: 'var(--text-secondary)',
                            background:
                              'color-mix(in srgb, var(--border) 55%, transparent)',
                          }
                    }
                    title={
                      isListening
                        ? 'Stop recording'
                        : 'Use voice input'
                    }
                  >
                    {isListening ? (
                      <MicOff size={17} />
                    ) : (
                      <Mic size={17} />
                    )}
                  </button>

                  {/* Send */}
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={
                      isThinking ||
                      !input.trim()
                    }
                    className="group flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                    }}
                  >
                    <span className="hidden sm:inline">
                      Send answer
                    </span>

                    <Send
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>

                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between px-1">
              <p
                className="text-[10px]"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                {isListening
                  ? 'Speak naturally — your answer will appear above.'
                  : 'Press Enter to send · Shift + Enter for a new line'}
              </p>

              {voiceSupported && (
                <div
                  className="hidden items-center gap-1.5 text-[10px] sm:flex"
                  style={{
                    color: 'var(--text-tertiary)',
                  }}
                >
                  <Mic size={11} />
                  Voice ready
                </div>
              )}
            </div>

            {!voiceSupported && (
              <p
                className="mt-2 text-center text-[10px]"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                Voice input isn't supported in this browser. Try Chrome or Edge.
              </p>
            )}
          </div>
        </section>

        {/* =================================================
            BOTTOM STATUS
        ================================================= */}
        <div className="mt-3 hidden animate-[fadeIn_0.8s_ease-out] items-center justify-center gap-2 md:flex">
          <CheckCircle2
            size={13}
            style={{
              color: 'var(--accent-3)',
            }}
          />

          <span
            className="text-[10px]"
            style={{
              color: 'var(--text-tertiary)',
            }}
          >
            Your responses are being evaluated by SkillMate AI
          </span>

          <ArrowRight
            size={12}
            className="transition-transform duration-300 hover:translate-x-1"
            style={{
              color: 'var(--text-tertiary)',
            }}
          />
        </div>

      </main>
    </div>
  )
}