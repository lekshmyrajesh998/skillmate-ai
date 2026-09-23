import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { useAuthStore } from '../store/authStore'
import { api } from '../lib/api'
import ThemeToggle from '../components/ThemeToggle'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Enter both email and password to continue')
      return
    }

    try {
      setIsLoading(true)

      const res = await api.post('/auth/login', {
        email,
        password,
      })

      setAuth(
        res.data.token,
        res.data.user.email,
        res.data.user.name
      )

      navigate('/dashboard')
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Invalid email or password'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, var(--bg-page) 0%, var(--bg-page-2) 100%)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full blur-[140px]"
        style={{
          background:
            'color-mix(in srgb, var(--accent-1) 16%, transparent)',
        }}
      />

      <div
        className="pointer-events-none absolute -bottom-52 -right-40 h-[560px] w-[560px] rounded-full blur-[150px]"
        style={{
          background:
            'color-mix(in srgb, var(--accent-2) 13%, transparent)',
        }}
      />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
        style={{
          background:
            'color-mix(in srgb, var(--accent-3) 5%, transparent)',
        }}
      />

      {/* Top bar */}
      <header className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2.5"
          aria-label="SkillMate AI home"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-200 group-hover:scale-105"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
            }}
          >
            <Sparkles size={17} />
          </div>

          <div>
            <p className="font-display text-sm font-bold leading-none">
              SkillMate AI
            </p>

            
          </div>
        </Link>

        <ThemeToggle />
      </header>

      {/* Main */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 sm:px-6">
        <div className="grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1fr_460px]">

          {/* Product message */}
          <section className="hidden lg:block">
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold"
              style={{
                borderColor:
                  'color-mix(in srgb, var(--accent-1) 20%, var(--border))',
                background:
                  'color-mix(in srgb, var(--accent-1) 7%, transparent)',
                color: 'var(--accent-1)',
              }}
            >
              <Sparkles size={13} />
              AI-powered interview preparation
            </div>

            <h1 className="max-w-xl font-display text-4xl font-bold leading-[1.08] xl:text-5xl">
              Practice with confidence.
              <span className="text-gradient mt-1 block">
                Interview with clarity.
              </span>
            </h1>

            <p
              className="mt-6 max-w-lg text-sm leading-7"
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              Build stronger answers, practice realistic
              conversations, and understand your performance
              before the real interview.
            </p>

            {/* Feature highlights */}
            <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
              {[
                {
                  title: 'AI',
                  label: 'Interview',
                  icon: Sparkles,
                },
                {
                  title: 'Voice',
                  label: 'Practice',
                  icon: CheckCircle2,
                },
                {
                  title: 'Smart',
                  label: 'Feedback',
                  icon: ShieldCheck,
                },
              ].map(({ title, label, icon: Icon }) => (
                <div
                  key={title}
                  className="group rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    borderColor: 'var(--border)',
                    background:
                      'color-mix(in srgb, var(--bg-surface) 70%, transparent)',
                    boxShadow:
                      '0 8px 30px color-mix(in srgb, var(--accent-1) 4%, transparent)',
                  }}
                >
                  <Icon
                    size={16}
                    style={{
                      color: 'var(--accent-2)',
                    }}
                  />

                  <p className="mt-3 font-display text-base font-bold">
                    {title}
                  </p>

                  <p
                    className="mt-1 text-[10px]"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Trust line */}
            <div className="mt-8 flex items-center gap-2">
              <ShieldCheck
                size={15}
                style={{
                  color: 'var(--accent-3)',
                }}
              />

              <span
                className="text-xs"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                Secure account access
              </span>
            </div>
          </section>

          {/* Login card */}
          <section className="mx-auto w-full max-w-md">
            <div
              className="relative overflow-hidden rounded-[28px] border p-6 shadow-2xl sm:p-8"
              style={{
                background:
                  'color-mix(in srgb, var(--bg-surface) 88%, transparent)',
                borderColor: 'var(--border)',
                backdropFilter: 'blur(24px)',
                boxShadow:
                  '0 25px 70px color-mix(in srgb, var(--accent-1) 8%, transparent)',
              }}
            >
              {/* Card glow */}
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full blur-3xl"
                style={{
                  background:
                    'color-mix(in srgb, var(--accent-1) 8%, transparent)',
                }}
              />

              <div className="relative">
                {/* Mobile logo */}
                <div
                  className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md lg:hidden"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                  }}
                >
                  <Sparkles size={19} />
                </div>

                {/* Heading */}
                <div className="mb-7">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-2xl font-bold">
                      Welcome back
                    </h2>

                    <span
                      className="hidden rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wider sm:inline-flex"
                      style={{
                        background:
                          'color-mix(in srgb, var(--accent-3) 9%, transparent)',
                        color: 'var(--accent-3)',
                      }}
                    >
                      Secure
                    </span>
                  </div>

                  <p
                    className="mt-1.5 text-sm"
                    style={{
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Continue your interview preparation.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="mb-5 flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-xs leading-5"
                    style={{
                      borderColor:
                        'color-mix(in srgb, #ef4444 25%, var(--border))',
                      background:
                        'color-mix(in srgb, #ef4444 7%, transparent)',
                      color: 'var(--text-secondary)',
                    }}
                    role="alert"
                  >
                    <span
                      className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background: '#ef4444',
                      }}
                    />
                    <span>{error}</span>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-2 block text-xs font-semibold"
                      style={{
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Email address
                    </label>

                    <div className="group relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      />

                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full rounded-xl border py-3 pl-10 pr-3 text-sm outline-none transition-all placeholder:opacity-50 focus:ring-2"
                        style={{
                          background: 'var(--bg-page)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="login-password"
                      className="mb-2 block text-xs font-semibold"
                      style={{
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      />

                      <input
                        id="login-password"
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="w-full rounded-xl border py-3 pl-10 pr-11 text-sm outline-none transition-all placeholder:opacity-50 focus:ring-2"
                        style={{
                          background: 'var(--bg-page)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)',
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((v) => !v)
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 transition-opacity hover:opacity-70"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Log in
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>

                {/* Secure access divider */}
                <div className="my-6 flex items-center gap-3">
                  <div
                    className="h-px flex-1"
                    style={{
                      background: 'var(--border)',
                    }}
                  />

                  <div className="flex items-center gap-1.5">
                    <ShieldCheck
                      size={11}
                      style={{
                        color: 'var(--accent-3)',
                      }}
                    />

                    <span
                      className="text-[9px] font-semibold uppercase tracking-[0.14em]"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      Secure access
                    </span>
                  </div>

                  <div
                    className="h-px flex-1"
                    style={{
                      background: 'var(--border)',
                    }}
                  />
                </div>

                {/* Signup */}
                <p
                  className="text-center text-xs"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-semibold transition-opacity hover:opacity-70"
                    style={{
                      color: 'var(--accent-3)',
                    }}
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>

            {/* Bottom message */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: 'var(--accent-3)',
                  boxShadow:
                    '0 0 10px color-mix(in srgb, var(--accent-3) 45%, transparent)',
                }}
              />

              <p
                className="text-[10px]"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                Your interview workspace is ready when you are.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}