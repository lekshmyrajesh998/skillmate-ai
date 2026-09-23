import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
 
  FileText,
  Flame,
  History,
  Lightbulb,
  Loader2,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  X,
  Zap,
} from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useAuthStore } from '../store/authStore'
import { useSessionStore } from '../store/sessionStore'
import {api} from '../lib/api'
import { Skeleton } from '../components/Skeleton'
import PageTransition from '../components/PageTransition'


const DIFFICULTIES = [
  { value: 'junior', label: 'Junior', description: 'Foundational questions' },
  { value: 'mid', label: 'Mid-level', description: 'Practical engineering' },
  { value: 'senior', label: 'Senior', description: 'Advanced problem solving' },
]

const ROLES = [
  { value: 'sde', label: 'Software Engineer' },
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'backend', label: 'Backend Developer' },
  { value: 'fullstack', label: 'Full Stack Developer' },
  { value: 'data', label: 'Data / ML Engineer' },
]

interface Stats {
  totalInterviews: number
  averageScore: number
  bestScore: number
  streak: number
  scoreTrend?: Array<{
    date: string
    score: number
  }>
  skillBreakdown?: Array<{
    skill: string
    score: number
  }>
}

interface SessionSummary {
  id: string
  roleType?: string
  difficulty?: string
  createdAt: string
  status?: string
  score?: number
}

const scoreColor = (score: number) => {
  if (score >= 80) return 'var(--accent-3)'
  if (score >= 60) return 'var(--accent-1)'
  if (score >= 40) return 'var(--accent-2)'
  return '#F43F5E'
}

const weakestSkillTip = (skills: Stats['skillBreakdown']) => {
  if (!skills?.length) {
    return 'Complete your first interview to unlock personalized AI insights.'
  }

  const weakest = [...skills].sort((a, b) => a.score - b.score)[0]

  if (!weakest || weakest.score === 0) {
    return 'Complete more interviews to build a stronger performance profile.'
  }

  return `${weakest.skill} is currently your biggest improvement opportunity. Focus on giving specific examples and structured answers.`
}

const formatRole = (role?: string) => {
  if (!role) return 'Software Engineer'

  const found = ROLES.find((item) => item.value === role)
  return found?.label || role
}

const formatDifficulty = (difficulty?: string) => {
  if (!difficulty) return 'Mid-level'

  const found = DIFFICULTIES.find((item) => item.value === difficulty)
  return found?.label || difficulty
}

const formatDate = (date: string) => {
  const value = new Date(date)

  if (Number.isNaN(value.getTime())) return 'Recently'

  return value.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function Dashboard() {
  const navigate = useNavigate()

  const userName = useAuthStore((state) => state.userName)


  const setSessionId = useSessionStore((state) => state.setSessionId)

  const [onboardingOpen, setOnboardingOpen] = useState(false)


  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [isParsingResume, setIsParsingResume] = useState(false)

  const [jobDescription, setJobDescription] = useState('')

  const [difficulty, setDifficulty] = useState(() => {
    return localStorage.getItem('skillmate-difficulty') || 'mid'
  })

  const [roleType, setRoleType] = useState('sde')
  const [isStarting, setIsStarting] = useState(false)

  const [stats, setStats] = useState<Stats>({
    totalInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    streak: 0,
    scoreTrend: [],
    skillBreakdown: [],
  })

  const [recentSessions, setRecentSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)

  

  const firstName = useMemo(() => {
    return userName?.split(' ')[0] || 'there'
  }, [userName])

  const canStartInterview =
    Boolean(resumeText.trim()) &&
    Boolean(jobDescription.trim()) &&
    !isParsingResume &&
    !isStarting

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)

        const [statsResponse, sessionsResponse] = await Promise.all([
          api.get('/sessions/stats'),
          api.get('/sessions'),
        ])

        const statsData = statsResponse?.data
        const sessionsData = Array.isArray(sessionsResponse?.data)
          ? sessionsResponse.data
          : []

        setStats({
          totalInterviews: statsData?.totalInterviews ?? 0,
          averageScore: statsData?.avgScore ?? 0,
          bestScore: statsData?.bestScore ?? 0,
          streak: statsData?.streakDays ?? 0,

          scoreTrend: Array.isArray(statsData?.trend)
            ? statsData.trend.map(
                (item: { date: string; score: number }) => ({
                  date: new Date(item.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                  }),
                  score: item.score ?? 0,
                })
              )
            : [],

          skillBreakdown: statsData?.avgBreakdown
            ? [
                {
                  skill: 'Clarity',
                  score: statsData.avgBreakdown.clarity ?? 0,
                },
                {
                  skill: 'Relevance',
                  score: statsData.avgBreakdown.relevance ?? 0,
                },
                {
                  skill: 'Depth',
                  score: statsData.avgBreakdown.depth ?? 0,
                },
                {
                  skill: 'Confidence',
                  score: statsData.avgBreakdown.confidence ?? 0,
                },
              ]
            : [],
        })

        setRecentSessions(
          sessionsData.slice(0, 5).map((session: any) => ({
            id: session.id,
            roleType: session.roleType,
            difficulty: session.difficulty,
            createdAt: session.createdAt,
            status: session.status,
            score: session.feedback?.overallScore ?? session.score ?? 0,
          }))
        )
      } catch (error) {
        console.error('Dashboard loading error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const handleResumeChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF resume.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Resume must be smaller than 5 MB.')
      event.target.value = ''
      return
    }

    setResumeFile(file)
    setIsParsingResume(true)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await api.post('/sessions/parse-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const extractedText =
        response?.data?.resumeText ||
        response?.data?.text ||
        response?.data?.data?.resumeText ||
        response?.data?.data?.text ||
        ''

      if (!extractedText) {
        throw new Error('No resume text returned')
      }

      setResumeText(extractedText)
    } catch (error: any) {
      console.error('Resume parsing error:', error)

      setResumeFile(null)
      setResumeText('')

      alert(
        error?.response?.data?.error ||
          'Could not process your resume. Please try another PDF.'
      )
    } finally {
      setIsParsingResume(false)
    }
  }

  const handleStartInterview = async () => {
    if (!canStartInterview) return

    try {
      setIsStarting(true)

      localStorage.setItem('skillmate-difficulty', difficulty)

      const response = await api.post('/sessions', {
        jobDescription: jobDescription.trim(),
        resumeText: resumeText.trim(),
        difficulty,
        roleType,
      })

      const sessionId = response?.data?.sessionId

      if (!sessionId) {
        throw new Error('No session ID returned')
      }

      setSessionId(sessionId)
      setOnboardingOpen(false)

      navigate('/interview')
    } catch (error: any) {
      console.error('Start interview error:', error)

      alert(
        error?.response?.data?.error ||
          'Could not start the interview. Please try again.'
      )
    } finally {
      setIsStarting(false)
    }
  }

  const handleOpenInterview = () => {
    setOnboardingOpen(true)
  }

  const focusTip = weakestSkillTip(stats.skillBreakdown)

  return (
    <PageTransition>
      <main
        className="min-h-screen w-full overflow-x-hidden px-4 pb-28 pt-24 sm:px-6 md:pb-10 md:pt-8 lg:px-8"
        style={{
          color: 'var(--text-primary)',
        }}
      >
        <div className="mx-auto w-full max-w-7xl">
          {/* =====================================================
              HEADER
          ===================================================== */}
          <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
                style={{
                  borderColor:
                    'color-mix(in srgb, var(--accent-1) 18%, var(--border))',
                  background:
                    'color-mix(in srgb, var(--accent-1) 7%, transparent)',
                  color: 'var(--accent-1)',
                }}
              >
                <Sparkles size={13} />
                <span className="text-[11px] font-semibold">
                  AI-powered interview preparation
                </span>
              </div>

              <h1
                className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
                style={{
                  color: 'var(--text-primary)',
                }}
              >
                Welcome back,{' '}
                <span className="text-gradient">{firstName}</span>
              </h1>

              <p
                className="mt-2 max-w-2xl text-sm leading-6"
                style={{
                  color: 'var(--text-secondary)',
                }}
              >
                Turn every interview into measurable progress. Practice with
                AI, understand your weak spots, and build confidence for your
                next opportunity.
              </p>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <div
                className="flex items-center gap-2 rounded-xl border px-3 py-2"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-surface)',
                }}
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    background:
                      'color-mix(in srgb, var(--accent-3) 12%, transparent)',
                    color: 'var(--accent-3)',
                  }}
                >
                  <Zap size={14} />
                </div>

                <div>
                  <p
                    className="text-[10px]"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Current streak
                  </p>

                  <p className="text-xs font-semibold">
                    {stats.streak} {stats.streak === 1 ? 'day' : 'days'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenInterview}
                className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                  boxShadow: '0 10px 30px var(--shadow-glow)',
                }}
              >
                <Plus size={16} />
                New interview
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </section>

          {/* Mobile CTA */}
          <div className="mb-6 md:hidden">
            <button
              type="button"
              onClick={handleOpenInterview}
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                boxShadow: '0 10px 30px var(--shadow-glow)',
              }}
            >
              <Plus size={17} />
              Start a new interview
              <ArrowRight size={15} />
            </button>
          </div>

          {/* =====================================================
              STATS
          ===================================================== */}
          <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {loading ? (
              <>
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="surface rounded-2xl p-4"
                  >
                    <Skeleton className="h-8 w-8 rounded-xl" />
                    <Skeleton className="mt-4 h-3 w-24" />
                    <Skeleton className="mt-2 h-7 w-16" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="surface group rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background:
                        'color-mix(in srgb, var(--accent-1) 11%, transparent)',
                      color: 'var(--accent-1)',
                    }}
                  >
                    <MessageSquare size={17} />
                  </div>

                  <p
                    className="mt-4 text-xs"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Interviews completed
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {stats.totalInterviews}
                  </p>
                </div>

                <div className="surface group rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background:
                        'color-mix(in srgb, var(--accent-2) 11%, transparent)',
                      color: 'var(--accent-2)',
                    }}
                  >
                    <Target size={17} />
                  </div>

                  <p
                    className="mt-4 text-xs"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Average score
                  </p>

                  <div className="mt-1 flex items-end gap-1">
                    <p className="text-2xl font-bold">
                      {stats.averageScore}
                    </p>
                    <span
                      className="mb-1 text-xs"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      /100
                    </span>
                  </div>
                </div>

                <div className="surface group rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background:
                        'color-mix(in srgb, var(--accent-3) 11%, transparent)',
                      color: 'var(--accent-3)',
                    }}
                  >
                    <TrendingUp size={17} />
                  </div>

                  <p
                    className="mt-4 text-xs"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Best score
                  </p>

                  <div className="mt-1 flex items-end gap-1">
                    <p
                      className="text-2xl font-bold"
                      style={{
                        color:
                          stats.bestScore > 0
                            ? scoreColor(stats.bestScore)
                            : 'var(--text-primary)',
                      }}
                    >
                      {stats.bestScore}
                    </p>
                    <span
                      className="mb-1 text-xs"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      /100
                    </span>
                  </div>
                </div>

                <div className="surface group rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background:
                        'color-mix(in srgb, #F97316 11%, transparent)',
                      color: '#F97316',
                    }}
                  >
                    <Flame size={17} />
                  </div>

                  <p
                    className="mt-4 text-xs"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Practice streak
                  </p>

                  <div className="mt-1 flex items-end gap-1">
                    <p className="text-2xl font-bold">
                      {stats.streak}
                    </p>
                    <span
                      className="mb-1 text-xs"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      days
                    </span>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* =====================================================
              ANALYTICS
          ===================================================== */}
          <section className="mb-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
            {/* Score Trend */}
            <div className="surface rounded-3xl p-5 sm:p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{
                        background:
                          'color-mix(in srgb, var(--accent-1) 10%, transparent)',
                        color: 'var(--accent-1)',
                      }}
                    >
                      <TrendingUp size={15} />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold">
                        Performance trend
                      </h2>

                      <p
                        className="mt-0.5 text-[11px]"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        Your interview scores over time
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-lg p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  aria-label="More performance options"
                >
                  <MoreHorizontal
                    size={17}
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  />
                </button>
              </div>

              {stats.scoreTrend && stats.scoreTrend.length > 0 ? (
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={stats.scoreTrend}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="var(--border)"
                        strokeDasharray="4 5"
                      />

                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'var(--text-tertiary)',
                          fontSize: 10,
                        }}
                      />

                      <YAxis
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: 'var(--text-tertiary)',
                          fontSize: 10,
                        }}
                      />

                      <Tooltip
                        contentStyle={{
                          background: 'var(--bg-page)',
                          border: '1px solid var(--border)',
                          borderRadius: '12px',
                          color: 'var(--text-primary)',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                        }}
                        labelStyle={{
                          color: 'var(--text-secondary)',
                          fontSize: 11,
                        }}
                        formatter={(value) => [`${value}/100`, 'Score']}
                      />

                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--accent-1)"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: 'var(--bg-page)',
                          stroke: 'var(--accent-1)',
                          strokeWidth: 2,
                        }}
                        activeDot={{
                          r: 6,
                          fill: 'var(--accent-1)',
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-[260px] flex-col items-center justify-center text-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      background:
                        'color-mix(in srgb, var(--accent-1) 8%, transparent)',
                      color: 'var(--accent-1)',
                    }}
                  >
                    <TrendingUp size={23} />
                  </div>

                  <p className="mt-4 text-sm font-semibold">
                    Your progress will appear here
                  </p>

                  <p
                    className="mt-1 max-w-xs text-xs leading-5"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Complete your first interview to start tracking your
                    performance.
                  </p>
                </div>
              )}
            </div>

            {/* Skill Breakdown */}
            <div className="surface rounded-3xl p-5 sm:p-6">
              <div className="mb-6 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{
                    background:
                      'color-mix(in srgb, var(--accent-2) 10%, transparent)',
                    color: 'var(--accent-2)',
                  }}
                >
                  <Brain size={15} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Skill breakdown
                  </h2>

                  <p
                    className="mt-0.5 text-[11px]"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Average performance by skill
                  </p>
                </div>
              </div>

              {stats.skillBreakdown && stats.skillBreakdown.length > 0 ? (
                <div className="space-y-5">
                  {stats.skillBreakdown.map((item) => (
                    <div key={item.skill}>
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className="text-xs font-medium"
                          style={{
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {item.skill}
                        </span>

                        <span
                          className="text-xs font-semibold"
                          style={{
                            color: scoreColor(item.score),
                          }}
                        >
                          {item.score}
                        </span>
                      </div>

                      <div
                        className="h-2 overflow-hidden rounded-full"
                        style={{
                          background:
                            'color-mix(in srgb, var(--text-tertiary) 12%, transparent)',
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min(Math.max(item.score, 0), 100)}%`,
                            background:
                              'linear-gradient(90deg, var(--accent-1), var(--accent-2))',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[260px] flex-col items-center justify-center text-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      background:
                        'color-mix(in srgb, var(--accent-2) 8%, transparent)',
                      color: 'var(--accent-2)',
                    }}
                  >
                    <BarChart3 size={23} />
                  </div>

                  <p className="mt-4 text-sm font-semibold">
                    Skills are waiting for you
                  </p>

                  <p
                    className="mt-1 max-w-xs text-xs leading-5"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Your AI-generated skill analysis will appear after your
                    first completed interview.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* =====================================================
              AI FOCUS
          ===================================================== */}
          <section
            className="mb-6 overflow-hidden rounded-3xl border p-5 sm:p-6"
            style={{
              borderColor:
                'color-mix(in srgb, var(--accent-1) 16%, var(--border))',
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 7%, transparent), color-mix(in srgb, var(--accent-3) 4%, transparent))',
            }}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                  }}
                >
                  <Lightbulb size={20} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold">
                      AI focus
                    </h2>

                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
                      style={{
                        background:
                          'color-mix(in srgb, var(--accent-3) 10%, transparent)',
                        color: 'var(--accent-3)',
                      }}
                    >
                      PERSONALIZED
                    </span>
                  </div>

                  <p
                    className="mt-1.5 max-w-2xl text-xs leading-5"
                    style={{
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {focusTip}
                  </p>
                </div>
              </div>

              <Link
                to="/feedback"
                className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold transition-all hover:gap-2.5"
                style={{
                  color: 'var(--accent-1)',
                }}
              >
                View insights
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>

          {/* =====================================================
              RECENT ACTIVITY
          ===================================================== */}
          <section className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">
                  Recent activity
                </h2>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color: 'var(--text-tertiary)',
                  }}
                >
                  Your latest interview sessions
                </p>
              </div>

              <Link
                to="/history"
                className="flex items-center gap-1.5 text-xs font-semibold transition-all hover:gap-2"
                style={{
                  color: 'var(--accent-1)',
                }}
              >
                View history
                <ArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="surface rounded-2xl p-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="flex-1">
                        <Skeleton className="h-3 w-40" />
                        <Skeleton className="mt-2 h-2.5 w-24" />
                      </div>
                      <Skeleton className="h-7 w-12 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            ) : recentSessions.length > 0 ? (
              <div className="surface overflow-hidden rounded-2xl">
                {recentSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className={`group flex items-center gap-3 px-4 py-4 transition-colors hover:bg-black/[0.025] dark:hover:bg-white/[0.025] ${
                      index !== recentSessions.length - 1
                        ? 'border-b'
                        : ''
                    }`}
                    style={{
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background:
                          'color-mix(in srgb, var(--accent-1) 9%, transparent)',
                        color: 'var(--accent-1)',
                      }}
                    >
                      <MessageSquare size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {formatRole(session.roleType)}
                      </p>

                      <div
                        className="mt-1 flex flex-wrap items-center gap-2 text-[10px]"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        <span>{formatDifficulty(session.difficulty)}</span>

                        <span>•</span>

                        <span>{formatDate(session.createdAt)}</span>

                        {session.status === 'completed' && (
                          <>
                            <span>•</span>

                            <span className="flex items-center gap-1">
                              <CheckCircle2 size={10} />
                              Completed
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {session.score && session.score > 0 ? (
                      <div
                        className="rounded-lg px-2.5 py-1.5 text-xs font-bold"
                        style={{
                          background: `${scoreColor(session.score)}18`,
                          color: scoreColor(session.score),
                        }}
                      >
                        {session.score}
                      </div>
                    ) : (
                      <span
                        className="text-[10px]"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        In progress
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="surface rounded-2xl p-8 text-center">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      'color-mix(in srgb, var(--accent-1) 8%, transparent)',
                    color: 'var(--accent-1)',
                  }}
                >
                  <History size={23} />
                </div>

                <h3 className="mt-4 text-sm font-semibold">
                  No interviews yet
                </h3>

                <p
                  className="mx-auto mt-1 max-w-sm text-xs leading-5"
                  style={{
                    color: 'var(--text-tertiary)',
                  }}
                >
                  Start your first AI interview and your activity will appear
                  here.
                </p>

                <button
                  type="button"
                  onClick={handleOpenInterview}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                  }}
                >
                  <Plus size={14} />
                  Start interview
                </button>
              </div>
            )}
          </section>

          {/* =====================================================
              FINAL CTA
          ===================================================== */}
          <section
            className="relative overflow-hidden rounded-3xl p-6 text-white sm:p-8"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-1), var(--accent-2) 55%, var(--accent-3))',
            }}
          >
            <div
              className="absolute -right-16 -top-20 h-48 w-48 rounded-full blur-3xl"
              style={{
                background: 'rgba(255,255,255,0.18)',
              }}
            />

            <div
              className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full blur-3xl"
              style={{
                background: 'rgba(255,255,255,0.10)',
              }}
            />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles size={16} />

                  <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                    Keep building
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold sm:text-3xl">
                  Ready for your next interview?
                </h2>

                <p className="mt-2 max-w-xl text-xs leading-5 text-white/75">
                  Practice realistic questions tailored to your resume and
                  target role, then get actionable AI feedback.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenInterview}
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90"
                style={{
                  color: 'var(--accent-1)',
                }}
              >
                Start practicing
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </section>
        </div>

        {/* =====================================================
            NEW INTERVIEW MODAL
        ===================================================== */}
        {onboardingOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8 backdrop-blur-sm md:py-10"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setOnboardingOpen(false)
              }
            }}
          >
            <div
              className="w-full max-w-2xl overflow-hidden rounded-3xl border shadow-2xl"
              style={{
                background: 'var(--bg-page)',
                borderColor: 'var(--border)',
                animation: 'fadeIn 0.2s ease-out',
              }}
            >
              {/* Modal Header */}
              <div
                className="flex items-center justify-between border-b px-5 py-4 sm:px-6"
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                    }}
                  >
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold">
                      Start a new interview
                    </h2>

                    <p
                      className="mt-0.5 text-[11px]"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      Personalize your AI interview session
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOnboardingOpen(false)}
                  className="rounded-xl p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  aria-label="Close interview setup"
                >
                  <X
                    size={17}
                    style={{
                      color: 'var(--text-secondary)',
                    }}
                  />
                </button>
              </div>

              {/* Modal Content */}
              <div className="max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                {/* Resume */}
                <div>
                  <div className="mb-2.5 flex items-center justify-between">
                    <label
                      className="text-xs font-semibold"
                      htmlFor="resume-upload"
                    >
                      Resume
                    </label>

                    <span
                      className="text-[10px]"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      PDF · Max 5 MB
                    </span>
                  </div>

                  <label
                    htmlFor="resume-upload"
                    className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed p-4 transition-all duration-200 hover:border-[color:var(--accent-1)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    style={{
                      borderColor: resumeFile
                        ? 'var(--accent-1)'
                        : 'var(--border)',
                    }}
                  >
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background:
                          'color-mix(in srgb, var(--accent-1) 9%, transparent)',
                        color: 'var(--accent-1)',
                      }}
                    >
                      {isParsingResume ? (
                        <Loader2
                          size={19}
                          className="animate-spin"
                        />
                      ) : resumeFile ? (
                        <CheckCircle2 size={19} />
                      ) : (
                        <Upload size={19} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {isParsingResume
                          ? 'Analyzing your resume...'
                          : resumeFile
                            ? resumeFile.name
                            : 'Upload your resume'}
                      </p>

                      <p
                        className="mt-1 text-[10px]"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        {isParsingResume
                          ? 'Extracting relevant skills and experience'
                          : resumeFile
                            ? 'Resume successfully processed'
                            : 'AI uses your resume to tailor interview questions'}
                      </p>
                    </div>

                    {!resumeFile && !isParsingResume && (
                      <FileText
                        size={17}
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      />
                    )}

                    <input
                      id="resume-upload"
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Job Description */}
                <div className="mt-5">
                  <div className="mb-2.5 flex items-center justify-between">
                    <label
                      htmlFor="job-description"
                      className="text-xs font-semibold"
                    >
                      Job description
                    </label>

                    <span
                      className="text-[10px]"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      Required
                    </span>
                  </div>

                  <textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(event) =>
                      setJobDescription(event.target.value)
                    }
                    placeholder="Paste the job description you are preparing for..."
                    rows={6}
                    className="w-full resize-none rounded-2xl border px-4 py-3 text-xs leading-5 outline-none transition-all duration-200 focus:ring-2"
                    style={{
                      background: 'var(--bg-surface)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Role + Difficulty */}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="role-type"
                      className="mb-2.5 block text-xs font-semibold"
                    >
                      Target role
                    </label>

                    <div className="relative">
                      <BriefcaseBusiness
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      />

                      <select
                        id="role-type"
                        value={roleType}
                        onChange={(event) =>
                          setRoleType(event.target.value)
                        }
                        className="w-full appearance-none rounded-xl border py-3 pl-9 pr-9 text-xs outline-none"
                        style={{
                          background: 'var(--bg-surface)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {ROLES.map((role) => (
                          <option
                            key={role.value}
                            value={role.value}
                          >
                            {role.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="difficulty"
                      className="mb-2.5 block text-xs font-semibold"
                    >
                      Difficulty
                    </label>

                    <div className="relative">
                      <Target
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      />

                      <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(event) =>
                          setDifficulty(event.target.value)
                        }
                        className="w-full appearance-none rounded-xl border py-3 pl-9 pr-9 text-xs outline-none"
                        style={{
                          background: 'var(--bg-surface)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {DIFFICULTIES.map((item) => (
                          <option
                            key={item.value}
                            value={item.value}
                          >
                            {item.label} — {item.description}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Skills hint */}
                <div
                  className="mt-5 rounded-2xl border p-4"
                  style={{
                    borderColor:
                      'color-mix(in srgb, var(--accent-3) 14%, var(--border))',
                    background:
                      'color-mix(in srgb, var(--accent-3) 5%, transparent)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background:
                          'color-mix(in srgb, var(--accent-3) 10%, transparent)',
                        color: 'var(--accent-3)',
                      }}
                    >
                      <Sparkles size={13} />
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold">
                        AI-tailored questions
                      </p>

                      <p
                        className="mt-1 text-[10px] leading-5"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        Your resume, role, difficulty, and job description
                        will be used to create a personalized interview.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className="flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6"
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOnboardingOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleStartInterview}
                  disabled={!canStartInterview}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                  }}
                >
                  {isStarting ? (
                    <>
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      Preparing interview...
                    </>
                  ) : (
                    <>
                      <Mic size={14} />
                      Start AI interview
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </PageTransition>
  )
}