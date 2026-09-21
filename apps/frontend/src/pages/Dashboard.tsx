import { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { FileText, Sparkles, ArrowRight, CheckCircle2, Target, TrendingUp, Award, Clock, ChevronRight, Plus, X, Flame, Lightbulb } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { api } from '../lib/api'
import { useSessionStore } from '../store/sessionStore'
import OnboardingModal from '../components/OnboardingModal'
import { Skeleton } from '../components/Skeleton'

const KNOWN_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL', 'REST', 'CI/CD', 'Java', 'Angular', 'PostgreSQL', 'LangChain', 'RAG', 'Microservices']
const DIFFICULTIES = [{ id: 'junior', label: 'Junior' }, { id: 'mid', label: 'Mid-level' }, { id: 'senior', label: 'Senior' }]
const ROLES = [{ id: 'sde', label: 'Software Engineer' }, { id: 'pm', label: 'Product Manager' }, { id: 'data', label: 'Data / Analytics' }, { id: 'sales', label: 'Sales' }, { id: 'marketing', label: 'Marketing' }]

interface Stats {
  totalInterviews: number
  avgScore: number
  bestScore: number
  trend: { date: string; score: number }[]
  avgBreakdown: { clarity: number; relevance: number; depth: number; confidence: number }
  streakDays: number
}
interface SessionSummary { id: string; jobDescription: string; status: string; createdAt: string; feedback: { overallScore: number } | null }

function scoreColor(score: number) {
  if (score >= 80) return '#06B6D4'
  if (score >= 60) return '#F5B942'
  return '#F5605C'
}

function weakestSkillTip(b: Stats['avgBreakdown']) {
  const entries = Object.entries(b) as [keyof typeof b, number][]
  if (entries.every(([, v]) => v === 0)) return null
  const [weakest] = entries.sort((a, b) => a[1] - b[1])
  const tips: Record<string, string> = {
    clarity: 'Try structuring answers with a clear beginning, middle, and end — state the outcome first, then explain how you got there.',
    relevance: 'Tie your examples more directly back to the specific job description you\'re targeting.',
    depth: 'Add concrete specifics — metrics, scale, or technical detail — instead of high-level summaries.',
    confidence: 'Slow down slightly and give fuller answers; brief responses can read as less confident.',
  }
  return { skill: weakest[0], tip: tips[weakest[0]] }
}

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem('pref-difficulty') || 'mid')
  const [roleType, setRoleType] = useState('sde')
  const [isUploading, setIsUploading] = useState(false)

  const [stats, setStats] = useState<Stats | null>(null)
  const [recentSessions, setRecentSessions] = useState<SessionSummary[]>([])
  const [statsLoading, setStatsLoading] = useState(true)

  const navigate = useNavigate()
  const userName = useAuthStore((s) => s.userName)
  const setSessionId = useSessionStore((s) => s.setSessionId)

  useEffect(() => {
    Promise.all([api.get('/sessions/stats'), api.get('/sessions')])
      .then(([statsRes, sessionsRes]) => {
        setStats(statsRes.data)
        setRecentSessions(sessionsRes.data.slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false))
  }, [])

  const step1Done = !!resumeText
  const step2Done = jobDescription.trim().length > 0

  const detectedSkills = useMemo(() => {
    if (!jobDescription) return []
    return KNOWN_SKILLS.filter((skill) => jobDescription.toLowerCase().includes(skill.toLowerCase()))
  }, [jobDescription])

  const chartData = stats?.trend.slice(-8).map((p, i) => ({ i, score: p.score })) || []
  const breakdownData = stats ? [
    { name: 'Clarity', value: stats.avgBreakdown.clarity },
    { name: 'Relevance', value: stats.avgBreakdown.relevance },
    { name: 'Depth', value: stats.avgBreakdown.depth },
    { name: 'Confidence', value: stats.avgBreakdown.confidence },
  ] : []
  const tip = stats ? weakestSkillTip(stats.avgBreakdown) : null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setResumeFile(file)
    setResumeText('')
    if (!file) return
    setIsParsing(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const res = await api.post('/sessions/parse-resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setResumeText(res.data.resumeText)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Could not read this PDF')
      setResumeFile(null)
    } finally {
      setIsParsing(false)
    }
  }

  const handleStartInterview = async () => {
    if (!resumeText || !jobDescription.trim()) { alert('Complete both steps before starting'); return }
    setIsUploading(true)
    try {
      const res = await api.post('/sessions', { jobDescription, resumeText, difficulty, roleType })
      setSessionId(res.data.sessionId)
      navigate('/interview', { state: { sessionId: res.data.sessionId } })
    } catch (err) {
      alert('Could not start interview. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const inputStyle = { background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text-primary)' }

  return (
    <div className="min-h-screen relative overflow-hidden md:pl-56 pt-16 pb-20 md:pt-0 md:pb-0" style={{ background: 'linear-gradient(180deg, var(--bg-page) 0%, var(--bg-page-2) 100%)', color: 'var(--text-primary)' }}>
      <OnboardingModal />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold mb-1 text-gradient inline-block">{userName ? `Welcome back, ${userName}` : 'Dashboard'}</p>
            <h1 className="font-display text-3xl">Your interview dashboard</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-aurora text-white px-5 py-2.5 rounded-full font-semibold text-sm inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
          >
            <Plus size={16} /> New interview
          </button>
        </div>

        {/* Stats row */}
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="surface rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}><Target size={14} style={{ color: 'var(--accent-3)' }} /> Interviews</div>
              <p className="font-display text-3xl">{stats?.totalInterviews ?? 0}</p>
            </div>
            <div className="surface rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}><TrendingUp size={14} style={{ color: 'var(--accent-2)' }} /> Avg score</div>
              <p className="font-display text-3xl">{stats?.avgScore ?? 0}</p>
            </div>
            <div className="surface rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}><Award size={14} className="text-[#F5B942]" /> Best score</div>
              <p className="font-display text-3xl">{stats?.bestScore ?? 0}</p>
            </div>
            <div className="surface rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}><Flame size={14} className="text-orange-400" /> This week</div>
              <p className="font-display text-3xl">{stats?.streakDays ?? 0}<span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>/7 days</span></p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: trend + breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="surface rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Score trend</h2>
              {statsLoading ? (
                <Skeleton className="h-48" />
              ) : chartData.length === 0 ? (
                <div className="h-40 flex items-center justify-center">
                  <p className="text-sm text-center" style={{ color: 'var(--text-tertiary)' }}>Complete an interview to see your trend here.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="50%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="i" hide />
                    <YAxis domain={[0, 100]} stroke="var(--text-tertiary)" fontSize={11} />
                    <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="score" stroke="url(#trendGradient)" strokeWidth={3} dot={{ fill: '#A855F7', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="surface rounded-2xl p-6">
  <h2 className="font-semibold mb-5">Skill breakdown</h2>
  {statsLoading ? (
    <Skeleton className="h-40" />
  ) : !stats || stats.totalInterviews === 0 ? (
    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Complete an interview to see your skill averages.</p>
  ) : (
    <div className="space-y-4">
      {breakdownData.map((item) => (
        <div key={item.name}>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-sm font-medium">{item.name}</span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.value}/100</span>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: 'var(--border)' }}>
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{ width: `${item.value}%`, backgroundColor: scoreColor(item.value) }}
            />
          </div>
        </div>
      ))}
    </div>
  )}
</div>

            {tip && (
              <div className="surface rounded-2xl p-6 flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-gradient-aurora flex items-center justify-center shrink-0 text-white">
                  <Lightbulb size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Focus area: <span className="capitalize">{tip.skill}</span></p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{tip.tip}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: recent activity */}
          <div className="space-y-4">
            <div className="surface rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Recent activity</h3>
                <Link to="/history" className="text-xs flex items-center gap-0.5" style={{ color: 'var(--accent-1)' }}>
                  View all <ChevronRight size={12} />
                </Link>
              </div>
              {statsLoading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
              ) : recentSessions.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No sessions yet — start your first one.</p>
              ) : (
                <div className="space-y-3">
                  {recentSessions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <Clock size={12} style={{ color: 'var(--text-tertiary)' }} className="shrink-0" />
                        <span className="truncate" style={{ color: 'var(--text-secondary)' }}>{s.jobDescription.slice(0, 28)}…</span>
                      </div>
                      {s.feedback ? (
                        <span className="font-semibold shrink-0 ml-2" style={{ color: scoreColor(s.feedback.overallScore) }}>{s.feedback.overallScore}</span>
                      ) : (
                        <span className="text-[10px] shrink-0 ml-2" style={{ color: 'var(--text-tertiary)' }}>—</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full surface rounded-2xl p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-aurora flex items-center justify-center mb-3 text-white">
                <Plus size={16} />
              </div>
              <p className="text-sm font-semibold mb-1">Ready for another round?</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Start a new mock interview tailored to any role.</p>
            </button>
          </div>
        </div>
      </div>

      {/* New interview modal */}
      {showModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-8 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg surface rounded-2xl p-6 shadow-2xl my-auto" style={{ background: 'var(--bg-surface)' }}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4" style={{ color: 'var(--text-tertiary)' }}>
              <X size={18} />
            </button>
            <h2 className="font-display text-xl mb-5">New mock interview</h2>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={step1Done ? 'bg-gradient-aurora w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-semibold' : 'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold'} style={!step1Done ? { background: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
                  {step1Done ? <CheckCircle2 size={11} /> : '1'}
                </span>
                <p className="text-sm font-medium">Resume</p>
              </div>
              <input type="file" accept=".pdf" onChange={handleFileChange}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-[#6366F1] file:via-[#A855F7] file:to-[#06B6D4] file:text-white file:font-semibold file:text-sm"
                style={{ color: 'var(--text-secondary)' }} />
              {isParsing && <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>Reading your resume…</p>}
              {resumeFile && !isParsing && resumeText && (
                <div className="flex items-center gap-2 text-xs mt-2 w-fit px-2.5 py-1 rounded-lg" style={{ background: 'var(--border)', color: 'var(--accent-3)' }}>
                  <FileText size={12} /> {resumeFile.name} · {resumeText.length} chars
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={step2Done ? 'bg-gradient-aurora w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-semibold' : 'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold'} style={!step2Done ? { background: 'var(--border)', color: 'var(--text-secondary)' } : {}}>
                  {step2Done ? <CheckCircle2 size={11} /> : '2'}
                </span>
                <p className="text-sm font-medium">Job description</p>
              </div>
              <textarea rows={4} placeholder="Paste the full job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
                className="w-full rounded-lg p-3 text-sm focus:outline-none focus:ring-2" style={inputStyle} />
              {detectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {detectedSkills.map((skill) => (
                    <span key={skill} className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--border)', color: 'var(--accent-1)' }}>{skill}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-gradient-aurora w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-semibold">3</span>
                <p className="text-sm font-medium">Role & difficulty</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {ROLES.map((r) => (
                  <button key={r.id} onClick={() => setRoleType(r.id)}
                    className={roleType === r.id ? 'bg-gradient-aurora text-white px-3 py-1 rounded-full text-xs font-medium' : 'px-3 py-1 rounded-full text-xs font-medium transition-colors'}
                    style={roleType !== r.id ? { background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text-secondary)' } : {}}>
                    {r.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5">
                {DIFFICULTIES.map((d) => (
                  <button key={d.id} onClick={() => setDifficulty(d.id)}
                    className={difficulty === d.id ? 'bg-gradient-aurora text-white px-3 py-1 rounded-full text-xs font-medium' : 'px-3 py-1 rounded-full text-xs font-medium transition-colors'}
                    style={difficulty !== d.id ? { background: 'var(--bg-page)', border: '1px solid var(--border)', color: 'var(--text-secondary)' } : {}}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleStartInterview} disabled={isUploading || isParsing}
              className="w-full bg-gradient-aurora text-white rounded-lg py-3 font-semibold shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
              {isUploading ? 'Preparing your interview…' : (<>Start mock interview <ArrowRight size={16} /></>)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}