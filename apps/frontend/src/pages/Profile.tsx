import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  Award,
  BarChart3,
  Camera,
  CheckCircle2,
  Mail,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Upload,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import { api } from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { Skeleton } from '../components/Skeleton'

interface Stats {
  totalInterviews: number
  avgScore: number
  bestScore: number
  trend: {
    date: string
    score: number
  }[]
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl border px-3 py-2 text-xs shadow-lg"
        style={{
          background: 'var(--bg-page)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
      >
        Score:{' '}
        <span
          className="font-semibold"
          style={{
            color: 'var(--accent-3)',
          }}
        >
          {payload[0].value}
        </span>
      </div>
    )
  }

  return null
}

export default function Profile() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showImageActions, setShowImageActions] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const userEmail = useAuthStore((s) => s.userEmail)
  const userName = useAuthStore((s) => s.userName)
  const profileImage = useAuthStore((s) => s.profileImage)
  const setProfileImage = useAuthStore((s) => s.setProfileImage)

  useEffect(() => {
    api
      .get('/sessions/stats')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const chartData =
    stats?.trend
      .slice(-10)
      .map((point, i) => ({
        name: `#${i + 1}`,
        score: point.score,
      })) || []

  const initials = userName
    ? userName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name[0]?.toUpperCase())
        .join('')
    : 'U'

  const averageScore = stats?.avgScore ?? 0
  const bestScore = stats?.bestScore ?? 0
  const totalInterviews = stats?.totalInterviews ?? 0

  /* =========================================================
     PROFILE IMAGE
     ========================================================= */

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please choose an image smaller than 5MB.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result

      if (typeof result === 'string') {
        setProfileImage(result)
      }
    }

    reader.readAsDataURL(file)

    event.target.value = ''
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    setShowImageActions(false)
  }

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, var(--bg-page) 0%, var(--bg-page-2) 100%)',
        color: 'var(--text-primary)',
      }}
    >
      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-10 blur-[130px] animate-[drift_12s_ease-in-out_infinite]"
        style={{
          background: 'var(--accent-1)',
        }}
      />

      <div
        className="pointer-events-none absolute -bottom-48 left-1/3 h-[450px] w-[450px] rounded-full opacity-8 blur-[130px] animate-[drift_15s_ease-in-out_infinite_reverse]"
        style={{
          background: 'var(--accent-2)',
        }}
      />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-28 pt-20 sm:px-6 md:px-8 md:pb-10 md:pt-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
          <p
            className="mb-1 text-[10px] font-bold uppercase tracking-widest"
            style={{
              color: 'var(--accent-1)',
            }}
          >
            Your workspace
          </p>

          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Profile & performance
          </h1>

          <p
            className="mt-1.5 text-sm"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Track your interview progress and preparation journey.
          </p>
        </div>

        {/* =====================================================
            PROFILE HERO
        ===================================================== */}

        <section
          className="group relative mb-6 overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl animate-[fadeIn_0.6s_ease-out]"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 8%, var(--bg-page)), var(--bg-page))',
            borderColor: 'var(--border)',
          }}
        >
          {/* Glow */}
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full opacity-10 blur-3xl transition-transform duration-700 group-hover:scale-125"
            style={{
              background: 'var(--accent-2)',
            }}
          />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* =================================================
                USER INFO
            ================================================= */}

            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div
                className="relative shrink-0 rounded-full p-1 transition-transform duration-500 hover:scale-105"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-1), var(--accent-2), var(--accent-3))',
                  boxShadow:
                    '0 0 32px color-mix(in srgb, var(--accent-1) 18%, transparent)',
                }}
                onMouseEnter={() => setShowImageActions(true)}
                onMouseLeave={() => setShowImageActions(false)}
              >
                <div
                  className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-xl font-bold text-white shadow-lg transition-all duration-500 sm:h-24 sm:w-24 sm:text-2xl"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                    border:
                      '3px solid color-mix(in srgb, var(--bg-page) 92%, transparent)',
                  }}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={`${userName || 'User'} profile`}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}

                  {/* Camera overlay */}
                  <button
                    type="button"
                    onClick={openFilePicker}
                    aria-label="Change profile picture"
                    className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white transition-opacity duration-300 ${
                      showImageActions
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                  >
                    <Camera size={22} />
                  </button>
                </div>

                {/* Status */}
                <div
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 shadow-sm"
                  style={{
                    background: 'var(--bg-page)',
                    borderColor: 'var(--bg-page)',
                  }}
                >
                  <CheckCircle2
                    size={16}
                    style={{
                      color: 'var(--accent-3)',
                    }}
                  />
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* User details */}
              <div className="min-w-0">
                <h2 className="font-display text-xl font-bold sm:text-2xl">
                  {userName || 'Candidate'}
                </h2>

                <div
                  className="mt-1 flex items-center gap-1.5 text-xs"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Mail size={13} />

                  <span className="truncate">
                    {userEmail || 'No email available'}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">

                  {/* Active learner */}
                  <div
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                    style={{
                      background:
                        'color-mix(in srgb, var(--accent-3) 10%, transparent)',
                      color: 'var(--accent-3)',
                    }}
                  >
                    <Sparkles
                      size={11}
                      className="animate-pulse"
                    />
                    Active learner
                  </div>

                  {/* Change photo */}
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                    style={{
                      color: 'var(--text-secondary)',
                      borderColor: 'var(--border)',
                      background: 'var(--bg-surface)',
                    }}
                  >
                    <Upload size={11} />
                    {profileImage
                      ? 'Change photo'
                      : 'Add photo'}
                  </button>

                  {/* Remove photo */}
                  {profileImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        color: '#EF4444',
                        borderColor:
                          'color-mix(in srgb, #EF4444 20%, var(--border))',
                        background:
                          'color-mix(in srgb, #EF4444 6%, transparent)',
                      }}
                    >
                      <Trash2 size={11} />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                PRACTICE STATUS
            ================================================= */}

            <div
              className="group relative overflow-hidden rounded-2xl border px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background:
                  'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 7%, var(--bg-surface)), var(--bg-surface))',
                borderColor: 'var(--border)',
                boxShadow:
                  '0 8px 25px color-mix(in srgb, var(--accent-1) 5%, transparent)',
              }}
            >
              {/* Subtle glow */}
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-20 blur-2xl transition-transform duration-500 group-hover:scale-150"
                style={{
                  background: 'var(--accent-1)',
                }}
              />

              <div className="relative flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background:
                      'color-mix(in srgb, var(--accent-1) 12%, transparent)',
                    color: 'var(--accent-1)',
                  }}
                >
                  <Target size={16} />
                </div>

                <div>
                  <p
                    className="text-[10px] font-medium uppercase tracking-wide"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Practice sessions
                  </p>

                  <div className="mt-0.5 flex items-baseline gap-1.5">
                    <p className="font-display text-xl font-bold">
                      {loading ? '—' : totalInterviews}
                    </p>

                    {!loading && (
                      <span
                        className="text-[10px] font-medium"
                        style={{
                          color: 'var(--accent-3)',
                        }}
                      >
                        completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        {loading ? (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5"
                style={{
                  background: 'var(--bg-page)',
                  borderColor: 'var(--border)',
                }}
              >
                <Skeleton className="mb-4 h-9 w-9 rounded-xl" />
                <Skeleton className="mb-2 h-7 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* Total interviews */}
            <div
              className="group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-[fadeIn_0.7s_ease-out]"
              style={{
                background: 'var(--bg-page)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background:
                      'color-mix(in srgb, var(--accent-3) 10%, transparent)',
                    color: 'var(--accent-3)',
                  }}
                >
                  <Target size={18} />
                </div>

                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: 'var(--text-tertiary)',
                  }}
                >
                  Total
                </span>
              </div>

              <p className="mt-5 font-display text-2xl font-bold">
                {totalInterviews}
              </p>

              <p
                className="mt-1 text-xs"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                Interviews completed
              </p>
            </div>

            {/* Average */}
            <div
              className="group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-[fadeIn_0.8s_ease-out]"
              style={{
                background: 'var(--bg-page)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background:
                      'color-mix(in srgb, var(--accent-2) 10%, transparent)',
                    color: 'var(--accent-2)',
                  }}
                >
                  <TrendingUp size={18} />
                </div>

                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: 'var(--text-tertiary)',
                  }}
                >
                  Average
                </span>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <p className="font-display text-2xl font-bold">
                  {averageScore}
                </p>

                <span
                  className="mb-1 text-xs"
                  style={{
                    color: 'var(--text-tertiary)',
                  }}
                >
                  / 100
                </span>
              </div>

              <p
                className="mt-1 text-xs"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                Overall performance
              </p>
            </div>

            {/* Best score */}
            <div
              className="group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-[fadeIn_0.9s_ease-out]"
              style={{
                background: 'var(--bg-page)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background:
                      'color-mix(in srgb, #f5b942 10%, transparent)',
                    color: '#f5b942',
                  }}
                >
                  <Award size={18} />
                </div>

                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: 'var(--text-tertiary)',
                  }}
                >
                  Personal best
                </span>
              </div>

              <div className="mt-5 flex items-end gap-2">
                <p className="font-display text-2xl font-bold">
                  {bestScore}
                </p>

                <span
                  className="mb-1 text-xs"
                  style={{
                    color: 'var(--text-tertiary)',
                  }}
                >
                  / 100
                </span>
              </div>

              <p
                className="mt-1 text-xs"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                Highest interview score
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            SCORE TREND
        ===================================================== */}

        <section
          className="rounded-3xl border p-5 shadow-sm transition-all duration-500 hover:shadow-xl animate-[fadeIn_1s_ease-out] sm:p-6"
          style={{
            background: 'var(--bg-page)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 hover:scale-110"
                  style={{
                    background:
                      'color-mix(in srgb, var(--accent-1) 10%, transparent)',
                    color: 'var(--accent-1)',
                  }}
                >
                  <BarChart3 size={17} />
                </div>

                <div>
                  <h2 className="font-display text-base font-bold">
                    Score trend
                  </h2>

                  <p
                    className="text-[10px]"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    Your recent interview performance
                  </p>
                </div>
              </div>
            </div>

            {chartData.length > 0 && (
              <div
                className="hidden rounded-full px-3 py-1.5 text-[10px] font-semibold sm:block"
                style={{
                  background:
                    'color-mix(in srgb, var(--accent-3) 10%, transparent)',
                  color: 'var(--accent-3)',
                }}
              >
                Last {chartData.length} sessions
              </div>
            )}
          </div>

          {loading ? (
            <Skeleton className="h-56 w-full rounded-xl" />
          ) : chartData.length === 0 ? (
            <div className="flex min-h-[230px] flex-col items-center justify-center text-center">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl animate-pulse"
                style={{
                  background:
                    'color-mix(in srgb, var(--accent-1) 8%, transparent)',
                }}
              >
                <TrendingUp
                  size={21}
                  style={{
                    color: 'var(--accent-1)',
                  }}
                />
              </div>

              <h3 className="font-display text-sm font-semibold">
                Your progress starts here
              </h3>

              <p
                className="mt-1 max-w-sm text-xs leading-5"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                Complete your first interview to start building
                your performance trend.
              </p>
            </div>
          ) : (
            <div className="animate-[fadeIn_1.2s_ease-out]">
              <ResponsiveContainer
                width="100%"
                height={250}
              >
                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="profileLineGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--accent-1)"
                      />

                      <stop
                        offset="50%"
                        stopColor="var(--accent-2)"
                      />

                      <stop
                        offset="100%"
                        stopColor="var(--accent-3)"
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    stroke="var(--text-tertiary)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    stroke="var(--text-tertiary)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: 'var(--border)',
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="url(#profileLineGradient)"
                    strokeWidth={3}
                    dot={{
                      fill: 'var(--accent-2)',
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                    isAnimationActive
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* =====================================================
            FOOTER MESSAGE
        ===================================================== */}

        <div className="mt-5 flex items-center justify-center gap-2 animate-[fadeIn_1.2s_ease-out]">
          <Sparkles
            size={13}
            className="animate-pulse"
            style={{
              color: 'var(--accent-1)',
            }}
          />

          <span
            className="text-[10px]"
            style={{
              color: 'var(--text-tertiary)',
            }}
          >
            Keep practicing — every interview is progress.
          </span>
        </div>
      </main>
    </div>
  )
}