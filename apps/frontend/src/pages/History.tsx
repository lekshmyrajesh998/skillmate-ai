import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ArrowRight, Inbox } from 'lucide-react'
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

export default function History() {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const setSessionId = useSessionStore((s) => s.setSessionId)

  useEffect(() => {
    api.get('/sessions').then((res) => setSessions(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const openFeedback = (id: string) => {
    setSessionId(id)
    navigate('/feedback', { state: { sessionId: id } })
  }

  return (
    <div className="min-h-screen relative overflow-hidden md:pl-56 pt-16 pb-20 md:pt-0 md:pb-0" style={{ background: 'linear-gradient(180deg, var(--bg-page) 0%, var(--bg-page-2) 100%)', color: 'var(--text-primary)' }}>
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold mb-1 text-gradient inline-block">Your progress</p>
          <h1 className="font-display text-3xl">Interview history</h1>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Every session you've completed, with your score over time.</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="surface rounded-2xl p-5 flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="w-11 h-11 rounded-full" />
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="surface rounded-2xl p-10 text-center">
            <Inbox className="mx-auto mb-3" size={32} style={{ color: 'var(--text-tertiary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No interviews yet — start one from the Dashboard.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => s.feedback && openFeedback(s.id)}
                disabled={!s.feedback}
                className="w-full text-left surface rounded-2xl p-5 flex items-center justify-between transition-colors disabled:opacity-60 disabled:cursor-default"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate max-w-md">
                    {s.jobDescription.slice(0, 80)}{s.jobDescription.length > 80 ? '…' : ''}
                  </p>
                  <div className="flex items-center gap-2 text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                    <Calendar size={12} />
                    {new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    {s.status === 'in_progress' && <span className="text-[#F5B942] ml-2">In progress</span>}
                  </div>
                </div>
                {s.feedback ? (
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-display font-semibold border-2"
                      style={{ borderColor: scoreColor(s.feedback.overallScore), color: scoreColor(s.feedback.overallScore) }}
                    >
                      {s.feedback.overallScore}
                    </div>
                    <ArrowRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                ) : (
                  <span className="text-xs shrink-0 ml-4" style={{ color: 'var(--text-tertiary)' }}>No report</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}