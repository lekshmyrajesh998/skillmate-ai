import { useState, useEffect } from 'react'
import {
  Save,
  Lock,
  User as UserIcon,
  Bell,
  Palette,
  ShieldAlert,
  Calendar,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Sparkles,
  LogOut,
  CheckCircle2,
} from 'lucide-react'

import { api } from '../lib/api'
import { useAuthStore } from '../store/authStore'

type Tab = 'profile' | 'security' | 'preferences' | 'danger'

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      aria-label={enabled ? 'Disable setting' : 'Enable setting'}
      className="relative h-6 w-11 shrink-0 rounded-full transition-all duration-300 hover:scale-105"
      style={{
        background: enabled
          ? 'linear-gradient(135deg, var(--accent-1), var(--accent-2))'
          : 'var(--border)',
        boxShadow: enabled
          ? '0 4px 16px color-mix(in srgb, var(--accent-1) 18%, transparent)'
          : 'none',
      }}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const [tab, setTab] = useState<Tab>('profile')

  const userName = useAuthStore((state) => state.userName)
  const userEmail = useAuthStore((state) => state.userEmail)
  const token = useAuthStore((state) => state.token)
  const setAuth = useAuthStore((state) => state.setAuth)
  const logout = useAuthStore((state) => state.logout)

  const [name, setName] = useState(userName || '')
  const [createdAt, setCreatedAt] = useState<string | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false)

  const [showNewPassword, setShowNewPassword] =
    useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [emailReminders, setEmailReminders] = useState(
    () =>
      localStorage.getItem('pref-email-reminders') !== 'false',
  )

  const [voiceAutoplay, setVoiceAutoplay] = useState(
    () =>
      localStorage.getItem('pref-voice-autoplay') !== 'false',
  )

  const [defaultDifficulty, setDefaultDifficulty] = useState(
    () =>
      localStorage.getItem('pref-difficulty') || 'mid',
  )

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => setCreatedAt(res.data.createdAt))
      .catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'pref-email-reminders',
      String(emailReminders),
    )
  }, [emailReminders])

  useEffect(() => {
    localStorage.setItem(
      'pref-voice-autoplay',
      String(voiceAutoplay),
    )
  }, [voiceAutoplay])

  useEffect(() => {
    localStorage.setItem(
      'pref-difficulty',
      defaultDifficulty,
    )
  }, [defaultDifficulty])

  const clearMessages = () => {
    setMessage('')
    setError('')
  }

  const handleSaveName = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault()
    clearMessages()

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }

    setSaving(true)

    try {
      const response = await api.patch('/auth/me', {
        name: name.trim(),
      })

      setAuth(
        token!,
        userEmail!,
        response.data.user.name,
      )

      setMessage(
        'Your profile has been updated successfully.',
      )
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Could not update your name.',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault()
    clearMessages()

    if (!currentPassword || !newPassword) {
      setError('Fill in both password fields.')
      return
    }

    if (newPassword.length < 6) {
      setError(
        'New password must be at least 6 characters.',
      )
      return
    }

    setSaving(true)

    try {
      await api.patch('/auth/me', {
        currentPassword,
        newPassword,
      })

      setMessage(
        'Your password has been changed successfully.',
      )

      setCurrentPassword('')
      setNewPassword('')
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Could not change password.',
      )
    } finally {
      setSaving(false)
    }
  }

  const initials = (userName || userEmail || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

  const tabs: {
    id: Tab
    label: string
    description: string
    icon: any
  }[] = [
    {
      id: 'profile',
      label: 'Profile',
      description: 'Personal information',
      icon: UserIcon,
    },
    {
      id: 'security',
      label: 'Security',
      description: 'Password & access',
      icon: Lock,
    },
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Interview experience',
      icon: SlidersHorizontal,
    },
    {
      id: 'danger',
      label: 'Danger zone',
      description: 'Account actions',
      icon: ShieldAlert,
    },
  ]

  const inputStyle = {
    background: 'var(--bg-page)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
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

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full blur-[130px] animate-[drift_14s_ease-in-out_infinite]"
          style={{
            background: 'var(--accent-1)',
            opacity: 0.07,
          }}
        />

        <div
          className="absolute -bottom-48 left-1/3 h-[450px] w-[450px] rounded-full blur-[130px] animate-[drift_17s_ease-in-out_infinite_reverse]"
          style={{
            background: 'var(--accent-2)',
            opacity: 0.05,
          }}
        />

        <div
          className="absolute left-1/4 top-1/2 h-72 w-72 rounded-full blur-[120px]"
          style={{
            background: 'var(--accent-3)',
            opacity: 0.025,
          }}
        />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-20 animate-[fadeIn_0.45s_ease-out] sm:px-6 md:pb-10 md:pt-8 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:rotate-2"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                boxShadow:
                  '0 10px 30px color-mix(in srgb, var(--accent-1) 18%, transparent)',
              }}
            >
              <SlidersHorizontal size={20} />
            </div>

            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{
                  color: 'var(--accent-1)',
                }}
              >
                Workspace
              </p>

              <h1 className="font-display text-2xl font-bold sm:text-3xl">
                Settings
              </h1>
            </div>
          </div>

          <p
            className="mb-5 max-w-2xl text-sm leading-6"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Manage your account, security, and interview
            experience from one place.
          </p>

          {/* ===================================================
              PROFILE MINI BANNER
          =================================================== */}

          <div
            className="group relative overflow-hidden rounded-3xl border p-5 shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl sm:p-6"
            style={{
              borderColor: 'var(--border)',
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 7%, var(--bg-page)), var(--bg-page))',
            }}
          >
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125"
              style={{
                background: 'var(--accent-2)',
                opacity: 0.08,
              }}
            />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                {/* Avatar */}
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-bold text-white shadow-lg"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                    boxShadow:
                      '0 8px 25px color-mix(in srgb, var(--accent-1) 18%, transparent)',
                  }}
                >
                  {initials}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate font-display text-base font-bold sm:text-lg">
                    {userName || 'Your profile'}
                  </h2>

                  <p
                    className="mt-0.5 truncate text-xs"
                    style={{
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {userEmail || 'Account information'}
                  </p>

                  {createdAt && (
                    <p
                      className="mt-1.5 flex items-center gap-1.5 text-[10px]"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      <Calendar size={11} />

                      Member since{' '}
                      {new Date(createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: 'long',
                          year: 'numeric',
                        },
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div
                className="flex w-fit items-center gap-2 rounded-full border px-3.5 py-2"
                style={{
                  borderColor:
                    'color-mix(in srgb, var(--accent-3) 20%, var(--border))',
                  background:
                    'color-mix(in srgb, var(--accent-3) 6%, transparent)',
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: 'var(--accent-3)',
                    boxShadow:
                      '0 0 0 4px color-mix(in srgb, var(--accent-3) 10%, transparent)',
                  }}
                />

                <span
                  className="text-[11px] font-semibold"
                  style={{
                    color: 'var(--accent-3)',
                  }}
                >
                  Account active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SETTINGS LAYOUT
        ===================================================== */}

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">

          {/* ===================================================
              SETTINGS NAVIGATION
          =================================================== */}

          <aside>
            <div
              className="rounded-3xl border p-2 shadow-sm"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--bg-page)',
              }}
            >
              <p
                className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                Account
              </p>

              <div className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
                {tabs.map(
                  ({
                    id,
                    label,
                    description,
                    icon: Icon,
                  }) => {
                    const active = tab === id

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setTab(id)
                          clearMessages()
                        }}
                        className="group flex min-w-fit items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 md:hover:translate-x-0.5"
                        style={{
                          color: active
                            ? 'var(--accent-1)'
                            : 'var(--text-secondary)',
                          background: active
                            ? 'color-mix(in srgb, var(--accent-1) 9%, transparent)'
                            : 'transparent',
                          boxShadow: active
                            ? 'inset 0 0 0 1px color-mix(in srgb, var(--accent-1) 10%, transparent)'
                            : 'none',
                        }}
                      >
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105"
                          style={{
                            background: active
                              ? 'color-mix(in srgb, var(--accent-1) 12%, transparent)'
                              : 'var(--bg-page-2)',
                          }}
                        >
                          <Icon size={16} />
                        </div>

                        <div className="hidden min-w-0 flex-1 md:block">
                          <p
                            className="text-xs font-semibold"
                            style={{
                              color: active
                                ? 'var(--accent-1)'
                                : 'var(--text-primary)',
                            }}
                          >
                            {label}
                          </p>

                          <p
                            className="mt-0.5 text-[10px]"
                            style={{
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            {description}
                          </p>
                        </div>

                        <ChevronRight
                          size={14}
                          className="hidden md:block"
                          style={{
                            color: active
                              ? 'var(--accent-1)'
                              : 'var(--text-tertiary)',
                          }}
                        />
                      </button>
                    )
                  },
                )}
              </div>
            </div>

            {/* AI helper card */}
            <div
              className="mt-4 hidden overflow-hidden rounded-3xl border p-4 md:block"
              style={{
                borderColor: 'var(--border)',
                background:
                  'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 6%, var(--bg-page)), var(--bg-page))',
              }}
            >
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    background:
                      'color-mix(in srgb, var(--accent-1) 10%, transparent)',
                    color: 'var(--accent-1)',
                  }}
                >
                  <Sparkles size={14} />
                </div>

                <span className="text-xs font-semibold">
                  SkillMate AI
                </span>
              </div>

              <p
                className="text-[10px] leading-relaxed"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                Personalize your interview experience and
                keep your account secure.
              </p>
            </div>
          </aside>

          {/* ===================================================
              CONTENT
          =================================================== */}

          <section className="min-w-0">

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {message && (
              <div
                className="mb-5 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm animate-[fadeIn_0.3s_ease-out]"
                style={{
                  color: 'var(--accent-3)',
                  borderColor:
                    'color-mix(in srgb, var(--accent-3) 25%, var(--border))',
                  background:
                    'color-mix(in srgb, var(--accent-3) 7%, transparent)',
                }}
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background:
                      'color-mix(in srgb, var(--accent-3) 12%, transparent)',
                  }}
                >
                  <CheckCircle2 size={15} />
                </div>

                <span>{message}</span>
              </div>
            )}

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
              <div
                className="mb-5 rounded-2xl border px-4 py-3 text-sm animate-[fadeIn_0.3s_ease-out]"
                style={{
                  color: '#EF4444',
                  borderColor:
                    'color-mix(in srgb, #EF4444 25%, var(--border))',
                  background:
                    'color-mix(in srgb, #EF4444 7%, transparent)',
                }}
              >
                {error}
              </div>
            )}

            {/* =================================================
                PROFILE
            ================================================= */}

            {tab === 'profile' && (
              <form
                onSubmit={handleSaveName}
                className="surface overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-lg"
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className="border-b px-6 py-5 sm:px-7"
                  style={{
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background:
                          'color-mix(in srgb, var(--accent-1) 10%, transparent)',
                        color: 'var(--accent-1)',
                      }}
                    >
                      <UserIcon size={18} />
                    </div>

                    <div>
                      <h2 className="font-display text-base font-bold">
                        Profile information
                      </h2>

                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        Keep your personal information up to
                        date.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-6 sm:p-7">
                  <div>
                    <label
                      className="mb-2 block text-xs font-semibold"
                      style={{
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Full name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      className="w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2"
                      style={{
                        ...inputStyle,
                        outlineColor: 'var(--accent-1)',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-xs font-semibold"
                      style={{
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Email address
                    </label>

                    <input
                      disabled
                      value={userEmail || ''}
                      className="w-full cursor-not-allowed rounded-2xl px-4 py-3 text-sm"
                      style={{
                        ...inputStyle,
                        opacity: 0.5,
                      }}
                    />

                    <p
                      className="mt-2 text-[10px] leading-5"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      Your email address is linked to your
                      account and cannot be changed here.
                    </p>
                  </div>

                  <div
                    className="flex justify-end border-t pt-5"
                    style={{
                      borderColor: 'var(--border)',
                    }}
                  >
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-aurora px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save size={15} />

                      {saving
                        ? 'Saving...'
                        : 'Save changes'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* =================================================
                SECURITY
            ================================================= */}

            {tab === 'security' && (
              <form
                onSubmit={handleChangePassword}
                className="surface overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-lg"
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className="border-b px-6 py-5 sm:px-7"
                  style={{
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background:
                          'color-mix(in srgb, var(--accent-2) 10%, transparent)',
                        color: 'var(--accent-2)',
                      }}
                    >
                      <Lock size={18} />
                    </div>

                    <div>
                      <h2 className="font-display text-base font-bold">
                        Password & security
                      </h2>

                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        Update your password to keep your
                        account protected.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-6 sm:p-7">
                  <div>
                    <label
                      className="mb-2 block text-xs font-semibold"
                      style={{
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Current password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showCurrentPassword
                            ? 'text'
                            : 'password'
                        }
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(
                            event.target.value,
                          )
                        }
                        className="w-full rounded-2xl px-4 py-3 pr-11 text-sm outline-none transition-all focus:ring-2"
                        style={inputStyle}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(
                            !showCurrentPassword,
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                        aria-label={
                          showCurrentPassword
                            ? 'Hide current password'
                            : 'Show current password'
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      className="mb-2 block text-xs font-semibold"
                      style={{
                        color: 'var(--text-secondary)',
                      }}
                    >
                      New password
                    </label>

                    <div className="relative">
                      <input
                        type={
                          showNewPassword
                            ? 'text'
                            : 'password'
                        }
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(
                            event.target.value,
                          )
                        }
                        placeholder="At least 6 characters"
                        className="w-full rounded-2xl px-4 py-3 pr-11 text-sm outline-none transition-all focus:ring-2"
                        style={inputStyle}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(
                            !showNewPassword,
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                        aria-label={
                          showNewPassword
                            ? 'Hide new password'
                            : 'Show new password'
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 rounded-2xl border p-4"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--bg-page-2)',
                    }}
                  >
                    <ShieldAlert
                      size={16}
                      className="mt-0.5 shrink-0"
                      style={{
                        color: 'var(--accent-1)',
                      }}
                    />

                    <p
                      className="text-[11px] leading-relaxed"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      Use a unique password with at least 6
                      characters. Avoid reusing passwords
                      from other accounts.
                    </p>
                  </div>

                  <div
                    className="flex justify-end border-t pt-5"
                    style={{
                      borderColor: 'var(--border)',
                    }}
                  >
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        background:
                          'color-mix(in srgb, var(--accent-1) 10%, transparent)',
                        color: 'var(--accent-1)',
                        border:
                          '1px solid color-mix(in srgb, var(--accent-1) 20%, var(--border))',
                      }}
                    >
                      {saving
                        ? 'Updating...'
                        : 'Update password'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* =================================================
                PREFERENCES
            ================================================= */}

            {tab === 'preferences' && (
              <div className="space-y-5">
                <div
                  className="surface overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-lg"
                  style={{
                    borderColor: 'var(--border)',
                  }}
                >
                  <div
                    className="border-b px-6 py-5 sm:px-7"
                    style={{
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background:
                            'color-mix(in srgb, var(--accent-3) 10%, transparent)',
                          color: 'var(--accent-3)',
                        }}
                      >
                        <Bell size={18} />
                      </div>

                      <div>
                        <h2 className="font-display text-base font-bold">
                          Interview experience
                        </h2>

                        <p
                          className="mt-1 text-xs"
                          style={{
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          Customize how SkillMate AI works
                          for you.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 sm:px-7">
                    {/* Email reminders */}
                    <div
                      className="flex items-center justify-between gap-5 py-5"
                      style={{
                        borderBottom:
                          '1px solid var(--border)',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Bell
                          size={17}
                          className="mt-0.5 shrink-0"
                          style={{
                            color: 'var(--accent-3)',
                          }}
                        />

                        <div>
                          <p className="text-sm font-semibold">
                            Email reminders
                          </p>

                          <p
                            className="mt-1 text-xs leading-relaxed"
                            style={{
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            Get reminders to keep your
                            interview practice consistent.
                          </p>
                        </div>
                      </div>

                      <Toggle
                        enabled={emailReminders}
                        onChange={setEmailReminders}
                      />
                    </div>

                    {/* Voice autoplay */}
                    <div className="flex items-center justify-between gap-5 py-5">
                      <div className="flex items-start gap-3">
                        <Palette
                          size={17}
                          className="mt-0.5 shrink-0"
                          style={{
                            color: 'var(--accent-2)',
                          }}
                        />

                        <div>
                          <p className="text-sm font-semibold">
                            AI voice autoplay
                          </p>

                          <p
                            className="mt-1 text-xs leading-relaxed"
                            style={{
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            Automatically speak each
                            interview question aloud.
                          </p>
                        </div>
                      </div>

                      <Toggle
                        enabled={voiceAutoplay}
                        onChange={setVoiceAutoplay}
                      />
                    </div>
                  </div>
                </div>

                {/* Difficulty */}
                <div
                  className="surface overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-lg"
                  style={{
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="p-6 sm:p-7">
                    <div className="mb-5 flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{
                          background:
                            'color-mix(in srgb, var(--accent-2) 10%, transparent)',
                          color: 'var(--accent-2)',
                        }}
                      >
                        <Sparkles size={18} />
                      </div>

                      <div>
                        <h2 className="font-display text-base font-bold">
                          Default interview difficulty
                        </h2>

                        <p
                          className="mt-1 text-xs"
                          style={{
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          Applied automatically to your next
                          new session.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(
                        ['junior', 'mid', 'senior'] as const
                      ).map((level) => {
                        const active =
                          level === defaultDifficulty

                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() =>
                              setDefaultDifficulty(
                                level,
                              )
                            }
                            className="rounded-2xl border px-3 py-3 text-sm font-semibold capitalize transition-all duration-200 hover:-translate-y-0.5"
                            style={{
                              borderColor: active
                                ? 'color-mix(in srgb, var(--accent-1) 35%, var(--border))'
                                : 'var(--border)',
                              color: active
                                ? 'var(--accent-1)'
                                : 'var(--text-secondary)',
                              background: active
                                ? 'color-mix(in srgb, var(--accent-1) 9%, transparent)'
                                : 'var(--bg-page)',
                              boxShadow: active
                                ? '0 6px 18px color-mix(in srgb, var(--accent-1) 7%, transparent)'
                                : 'none',
                            }}
                          >
                            {level}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                DANGER ZONE
            ================================================= */}

            {tab === 'danger' && (
              <div
                className="overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-lg"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(239,68,68,0.025))',
                  borderColor: 'rgba(239,68,68,0.25)',
                }}
              >
                <div className="p-6 sm:p-7">
                  <div className="mb-5 flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                      <ShieldAlert size={18} />
                    </div>

                    <div>
                      <h2 className="font-display text-base font-bold text-red-500">
                        Account actions
                      </h2>

                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: 'var(--text-secondary)',
                        }}
                      >
                        Actions in this section affect your
                        current session.
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-2xl border p-5"
                    style={{
                      borderColor:
                        'rgba(239,68,68,0.2)',
                      background:
                        'rgba(239,68,68,0.035)',
                    }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          Sign out of this device
                        </p>

                        <p
                          className="mt-1 text-xs leading-relaxed"
                          style={{
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          End your current SkillMate AI
                          session and return to the login
                          screen.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={logout}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500/15 hover:shadow-md"
                      >
                        <LogOut size={15} />
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                FOOTER
            ================================================= */}

            <div
              className="mt-6 flex flex-col gap-1 px-1 text-[10px] sm:flex-row sm:items-center sm:justify-between"
              style={{
                color: 'var(--text-tertiary)',
              }}
            >
              <span>SkillMate AI</span>

              <span>
                Settings are saved automatically where
                applicable.
              </span>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}