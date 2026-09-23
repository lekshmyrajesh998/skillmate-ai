import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  Inbox,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import { api } from '../lib/api'
import { useSessionStore } from '../store/sessionStore'
import { Skeleton } from '../components/Skeleton'

interface SessionSummary {
  id: string
  jobDescription: string
  status: string
  createdAt: string
  feedback: { overallScore: number } | null
}

function scoreColor(score: number) {
  if (score >= 80) return '#06B6D4'
  if (score >= 60) return '#F5B942'
  return '#F5605C'
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Strong'
  if (score >= 60) return 'Developing'
  return 'Needs practice'
}

function getRoleTitle(jobDescription: string) {
  const text = jobDescription.trim()

  if (!text) return 'Interview session'

  const firstLine = text
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean)

  return firstLine?.slice(0, 70) || 'Interview session'
}

export default function History() {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const setSessionId = useSessionStore((s) => s.setSessionId)

  useEffect(() => {
    api
      .get('/sessions')
      .then((res) => setSessions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const openFeedback = (id: string) => {
    setSessionId(id)
    navigate('/feedback', {
      state: { sessionId: id },
    })
  }

  const completedSessions = useMemo(
    () => sessions.filter((session) => session.feedback),
    [sessions]
  )

  const averageScore = useMemo(() => {
    if (!completedSessions.length) return 0

    const total = completedSessions.reduce(
      (sum, session) => sum + (session.feedback?.overallScore || 0),
      0
    )

    return Math.round(total / completedSessions.length)
  }, [completedSessions])

  return (
    <div
      className="min-h-screen w-full overflow-hidden pt-16 pb-20 md:pt-0 md:pb-0"
      style={{
        background:
          'linear-gradient(180deg, var(--bg-page) 0%, var(--bg-page-2) 100%)',
        color: 'var(--text-primary)',
      }}
    >
      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
              style={{
                color: 'var(--accent-2)',
                background:
                  'color-mix(in srgb, var(--accent-2) 10%, transparent)',
              }}
            >
              Your progress
            </span>

            <Sparkles
              size={14}
              style={{ color: 'var(--accent-2)' }}
            />
          </div>

          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Interview history
          </h1>

          <p
            className="mt-2 max-w-xl text-sm leading-6"
            style={{ color: 'var(--text-secondary)' }}
          >
            Review your previous sessions and track how your interview
            performance evolves over time.
          </p>
        </div>

        {/* Stats */}
        {!loading && sessions.length > 0 && (
          <div className="mb-8 grid gap-3 sm:grid-cols-3">

            <div className="surface rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background:
                      'color-mix(in srgb, var(--accent-1) 10%, transparent)',
                    color: 'var(--accent-1)',
                  }}
                >
                  <MessageSquare size={18} />
                </div>

                <div>
                  <p
                    className="text-[11px]"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Total sessions
                  </p>

                  <p className="font-display text-xl font-bold">
                    {sessions.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="surface rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background:
                      'color-mix(in srgb, var(--accent-3) 10%, transparent)',
                    color: 'var(--accent-3)',
                  }}
                >
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <p
                    className="text-[11px]"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Completed
                  </p>

                  <p className="font-display text-xl font-bold">
                    {completedSessions.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="surface rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background:
                      'color-mix(in srgb, var(--accent-2) 10%, transparent)',
                    color: 'var(--accent-2)',
                  }}
                >
                  <TrendingUp size={18} />
                </div>

                <div>
                  <p
                    className="text-[11px]"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Average score
                  </p>

                  <p className="font-display text-xl font-bold">
                    {averageScore || '—'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="surface rounded-2xl p-5"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>

                  <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
                </div>
              </div>
            ))}
          </div>

        ) : sessions.length === 0 ? (

          /* Empty state */
          <div className="surface rounded-3xl p-10 text-center sm:p-14">
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background:
                  'color-mix(in srgb, var(--accent-1) 10%, transparent)',
                color: 'var(--accent-1)',
              }}
            >
              <Inbox size={25} />
            </div>

            <h2 className="font-display text-xl font-bold">
              No interviews yet
            </h2>

            <p
              className="mx-auto mt-2 max-w-sm text-sm leading-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              Start your first AI interview from the Dashboard and your
              sessions will appear here.
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-aurora px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5"
            >
              Start an interview
              <ArrowRight size={15} />
            </button>
          </div>

        ) : (

          /* Sessions */
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold">
                  Recent sessions
                </h2>

                <p
                  className="mt-1 text-xs"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  Your latest interview activity
                </p>
              </div>

              <span
                className="text-xs"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {sessions.length} session{sessions.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3">
              {sessions.map((session) => {
                const score = session.feedback?.overallScore
                const hasFeedback = Boolean(session.feedback)

                return (
                  <button
                    key={session.id}
                    onClick={() =>
                      hasFeedback && openFeedback(session.id)
                    }
                    disabled={!hasFeedback}
                    className="surface group w-full rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg disabled:cursor-default disabled:hover:translate-y-0 sm:p-5"
                    style={{
                      opacity: hasFeedback ? 1 : 0.75,
                    }}
                  >
                    <div className="flex items-center gap-4">

                      {/* Session icon */}
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: hasFeedback
                            ? 'color-mix(in srgb, var(--accent-1) 9%, transparent)'
                            : 'color-mix(in srgb, var(--text-tertiary) 8%, transparent)',
                          color: hasFeedback
                            ? 'var(--accent-1)'
                            : 'var(--text-tertiary)',
                        }}
                      >
                        {hasFeedback ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Clock3 size={18} />
                        )}
                      </div>

                      {/* Main content */}
                      <div className="min-w-0 flex-1">

                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold">
                            {getRoleTitle(session.jobDescription)}
                          </p>

                          {session.status === 'in_progress' && (
                            <span
                              className="hidden shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase sm:inline-block"
                              style={{
                                color: '#F5B942',
                                background:
                                  'rgba(245,185,66,0.10)',
                              }}
                            >
                              In progress
                            </span>
                          )}
                        </div>

                        <div
                          className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />

                            {new Date(
                              session.createdAt
                            ).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>

                          <span className="hidden h-1 w-1 rounded-full bg-current opacity-40 sm:block" />

                          <span>
                            {hasFeedback
                              ? 'Report available'
                              : 'Report unavailable'}
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      {hasFeedback && score !== undefined ? (
                        <div className="flex shrink-0 items-center gap-3">

                          <div className="hidden text-right sm:block">
                            <p
                              className="text-[10px]"
                              style={{
                                color: 'var(--text-tertiary)',
                              }}
                            >
                              Score
                            </p>

                            <p
                              className="text-[10px] font-semibold"
                              style={{
                                color: scoreColor(score),
                              }}
                            >
                              {getScoreLabel(score)}
                            </p>
                          </div>

                          <div
  className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold"
  style={{
    color: scoreColor(score),
    background: `color-mix(in srgb, ${scoreColor(score)} 8%, transparent)`,
    boxShadow: `inset 0 0 0 2px color-mix(in srgb, ${scoreColor(
      score
    )} 35%, transparent), 0 0 18px color-mix(in srgb, ${scoreColor(
      score
    )} 8%, transparent)`,
  }}
>
  {score}
</div>

                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                            style={{
                              color: 'var(--text-tertiary)',
                            }}
                          />
                        </div>
                      ) : (
                        <span
                          className="shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold"
                          style={{
                            color: 'var(--text-tertiary)',
                            background:
                              'color-mix(in srgb, var(--text-tertiary) 8%, transparent)',
                          }}
                        >
                          No report
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && sessions.length > 0 && (
          <section className="surface relative mt-8 overflow-hidden rounded-2xl p-6">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
              style={{
                background:
                  'color-mix(in srgb, var(--accent-2) 10%, transparent)',
              }}
            />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={16}
                    style={{ color: 'var(--accent-2)' }}
                  />

                  <h2 className="font-display text-base font-bold">
                    Keep building your interview confidence
                  </h2>
                </div>

                <p
                  className="mt-1.5 text-xs"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Start another session and continue tracking your progress.
                </p>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-aurora px-5 py-3 text-xs font-semibold text-white shadow-md transition-all hover:-translate-y-0.5"
              >
                New interview
                <ArrowRight size={14} />
              </button>
            </div>
          </section>
        )}

      </main>
    </div>
  )
}