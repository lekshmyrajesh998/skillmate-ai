import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Circle,
  MessageSquare,
  Mic,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Zap,
} from 'lucide-react'

import ThemeToggle from '../components/ThemeToggle'

export default function Home() {
  const steps = [
    {
      icon: Upload,
      number: '01',
      title: 'Upload & target',
      desc: 'Add your resume and paste the job description you are preparing for.',
    },
    {
      icon: Mic,
      number: '02',
      title: 'Speak your answers',
      desc: 'Answer out loud while SkillMate asks adaptive questions through a live voice experience.',
    },
    {
      icon: BarChart3,
      number: '03',
      title: 'Get scored feedback',
      desc: 'Review clarity, relevance, depth, and confidence with a detailed performance report.',
    },
  ]

  const features = [
    {
      icon: Target,
      title: 'Grounded in your resume',
      desc: 'Questions are tailored around your actual experience instead of generic interview prompts.',
    },
    {
      icon: MessageSquare,
      title: 'Real conversation',
      desc: 'Practice with an AI interviewer that can continue the conversation based on your answers.',
    },
    {
      icon: TrendingUp,
      title: 'Actionable feedback',
      desc: 'See where you performed well and which areas deserve more practice.',
    },
  ]

  const testimonials = [
    {
      quote:
        'I walked into my actual interview already knowing what to expect.',
      name: 'Priya S.',
      role: 'Software Engineer',
    },
    {
      quote: 'The voice mode genuinely changed how I practice.',
      name: 'Arjun M.',
      role: 'Product Analyst',
    },
    {
      quote:
        'Got specific, honest feedback instead of generic interview tips.',
      name: 'Divya R.',
      role: 'Frontend Developer',
    },
  ]

  const faqs = [
    {
      q: 'Is SkillMate AI really free?',
      a: 'Yes — unlimited mock interviews, voice mode, and feedback reports are currently available at no cost.',
    },
    {
      q: 'What browser do I need for voice input?',
      a: 'Voice input and AI voice output work best in modern browsers such as Chrome and Edge.',
    },
    {
      q: 'Is my resume data stored securely?',
      a: 'Your resume and job description are stored to power your interview sessions and generate relevant feedback.',
    },
    {
      q: 'Can I practice for any job role?',
      a: 'Yes. Paste the job description for the role you are targeting and SkillMate will use it to tailor the interview.',
    },
  ]

  return (
    <div
      className="relative min-h-screen overflow-hidden"
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
        className="pointer-events-none absolute -left-64 -top-56 h-[650px] w-[650px] rounded-full opacity-20 blur-[150px] animate-[drift_14s_ease-in-out_infinite]"
        style={{ background: 'var(--accent-1)' }}
      />

      <div
        className="pointer-events-none absolute right-[-260px] top-[430px] h-[650px] w-[650px] rounded-full opacity-15 blur-[150px] animate-[drift_17s_ease-in-out_infinite_reverse]"
        style={{ background: 'var(--accent-3)' }}
      />

      <div
        className="pointer-events-none absolute left-[35%] top-[1200px] h-[500px] w-[500px] rounded-full opacity-10 blur-[150px]"
        style={{ background: 'var(--accent-2)' }}
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'linear-gradient(to bottom, black, transparent 70%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black, transparent 70%)',
        }}
      />

      <div className="relative z-10">
        {/* =====================================================
            NAVBAR
        ===================================================== */}
        <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-2"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
              }}
            >
              <Sparkles size={18} />
            </div>

            <div>
              <span className="font-display text-lg font-bold leading-none">
                SkillMate <span className="text-gradient">AI</span>
              </span>

              <span
                className="hidden text-[8px] font-semibold tracking-[0.16em] sm:block"
                style={{ color: 'var(--text-tertiary)' }}
              >
                INTERVIEW INTELLIGENCE
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#how-it-works"
              className="text-xs font-medium transition-colors hover:text-[var(--accent-1)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              How it works
            </a>

            <a
              href="#features"
              className="text-xs font-medium transition-colors hover:text-[var(--accent-1)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              Features
            </a>

            <a
              href="#faq"
              className="text-xs font-medium transition-colors hover:text-[var(--accent-1)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-black/5 dark:hover:bg-white/5 sm:block"
              style={{ color: 'var(--text-secondary)' }}
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="hidden rounded-xl bg-gradient-aurora px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg sm:block"
            >
              Get started
            </Link>

            <ThemeToggle />
          </div>
        </header>

        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="mx-auto max-w-5xl text-center">
            {/* Eyebrow */}
            <div
              className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur-md"
              style={{
                borderColor:
                  'color-mix(in srgb, var(--accent-1) 20%, var(--border))',
                background:
                  'color-mix(in srgb, var(--bg-surface) 75%, transparent)',
                color: 'var(--accent-2)',
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ background: 'var(--accent-3)' }}
                />

                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--accent-3)' }}
                />
              </span>

              AI-powered voice interview practice

              <Sparkles size={12} />
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-[76px]">
              Practice the interview
              <br />
              <span className="text-gradient">
                before it actually happens.
              </span>
            </h1>

            <p
              className="mx-auto mt-7 max-w-2xl text-base leading-7 sm:text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              SkillMate reads your resume and target role, then runs a live
              AI interview grounded in your real experience — followed by
              focused feedback you can actually use.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-aurora px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-auto"
              >
                Start practicing free

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#product-preview"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/5 dark:hover:bg-white/5 sm:w-auto"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                <Play
                  size={14}
                  className="fill-current"
                />
                See how it works
              </a>
            </div>

            {/* Trust points */}
            <div
              className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <span className="flex items-center gap-1.5">
                <Check
                  size={13}
                  style={{ color: 'var(--accent-3)' }}
                />
                Free to use
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-current opacity-40 sm:block" />

              <span className="flex items-center gap-1.5">
                <Check
                  size={13}
                  style={{ color: 'var(--accent-3)' }}
                />
                Voice enabled
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-current opacity-40 sm:block" />

              <span className="flex items-center gap-1.5">
                <Check
                  size={13}
                  style={{ color: 'var(--accent-3)' }}
                />
                Instant feedback
              </span>
            </div>
          </div>

          {/* =================================================
              PRODUCT PREVIEW
          ================================================= */}
          <div
            id="product-preview"
            className="mx-auto mt-16 max-w-5xl scroll-mt-8"
          >
            <div className="relative">
              {/* Glow */}
              <div
                className="pointer-events-none absolute -inset-6 rounded-[40px] opacity-20 blur-3xl"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-1), var(--accent-3))',
                }}
              />

              {/* Browser shell */}
              <div
                className="relative rounded-[28px] border p-2 shadow-2xl backdrop-blur-xl"
                style={{
                  borderColor: 'var(--border)',
                  background:
                    'color-mix(in srgb, var(--bg-surface) 90%, transparent)',
                }}
              >
                <div
                  className="overflow-hidden rounded-[22px] border"
                  style={{
                    borderColor: 'var(--border)',
                    background:
                      'color-mix(in srgb, var(--bg-page) 55%, transparent)',
                  }}
                >
                  {/* Window bar */}
                  <div
                    className="flex items-center justify-between border-b px-4 py-3.5 sm:px-6"
                    style={{
                      borderColor: 'var(--border)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-400/70" />
                    </div>

                    <div
                      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-semibold"
                      style={{
                        background:
                          'color-mix(in srgb, var(--accent-3) 9%, transparent)',
                        color: 'var(--accent-3)',
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 animate-pulse rounded-full"
                        style={{
                          background: 'var(--accent-3)',
                        }}
                      />

                      Live voice session
                    </div>
                  </div>

                  <div className="grid gap-0 md:grid-cols-[1fr_250px]">
                    {/* Conversation */}
                    <div className="p-5 sm:p-7">
                      <div className="mb-7 flex items-center justify-between">
                        <div>
                          <p
                            className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                            style={{
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            Technical interview
                          </p>

                          <h3 className="mt-1 font-display text-lg font-bold">
                            Frontend Engineer
                          </h3>
                        </div>

                        <div
                          className="hidden rounded-lg px-2.5 py-1.5 text-[9px] font-semibold sm:block"
                          style={{
                            background:
                              'color-mix(in srgb, var(--accent-1) 9%, transparent)',
                            color: 'var(--accent-1)',
                          }}
                        >
                          Question 3 / 5
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* AI question */}
                        <div className="flex justify-start">
                          <div className="flex max-w-[90%] gap-3">
                            <div
                              className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                              style={{
                                background:
                                  'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                              }}
                            >
                              <Sparkles size={13} />
                            </div>

                            <div>
                              <span
                                className="mb-1.5 block text-[9px] font-semibold"
                                style={{
                                  color: 'var(--text-tertiary)',
                                }}
                              >
                                SkillMate AI
                              </span>

                              <div
                                className="rounded-2xl rounded-tl-md px-4 py-3 text-left text-sm leading-6"
                                style={{
                                  background: 'var(--border)',
                                }}
                              >
                                Walk me through a project you are proud of
                                and explain its impact.
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* User answer */}
                        <div className="flex justify-end">
                          <div className="max-w-[85%]">
                            <span
                              className="mb-1.5 block text-right text-[9px] font-semibold"
                              style={{
                                color: 'var(--text-tertiary)',
                              }}
                            >
                              You
                            </span>

                            <div className="rounded-2xl rounded-br-md bg-gradient-aurora px-4 py-3 text-left text-sm leading-6 text-white shadow-md">
                              I led a migration that cut load times by 40%
                              and improved the checkout experience...
                            </div>
                          </div>
                        </div>

                        {/* Follow-up */}
                        <div className="flex justify-start">
                          <div className="flex max-w-[90%] gap-3">
                            <div
                              className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                              style={{
                                background:
                                  'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                              }}
                            >
                              <Sparkles size={13} />
                            </div>

                            <div>
                              <span
                                className="mb-1.5 block text-[9px] font-semibold"
                                style={{
                                  color: 'var(--text-tertiary)',
                                }}
                              >
                                Follow-up question
                              </span>

                              <div
                                className="rounded-2xl rounded-tl-md px-4 py-3 text-left text-sm leading-6"
                                style={{
                                  background: 'var(--border)',
                                }}
                              >
                                What was the biggest technical challenge
                                during that migration?
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Listening */}
                        <div className="flex items-center gap-3 pt-3">
                          <div
                            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm"
                            style={{
                              background:
                                'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                            }}
                          >
                            <span
                              className="absolute inset-0 animate-ping rounded-xl opacity-20"
                              style={{
                                background: 'var(--accent-2)',
                              }}
                            />

                            <Mic
                              size={15}
                              className="relative"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            {[0, 1, 2, 3, 4].map((item) => (
                              <span
                                key={item}
                                className="h-2 rounded-full bg-cyan-400 animate-pulse"
                                style={{
                                  width: `${6 + (item % 3) * 2}px`,
                                  animationDelay: `${item * 100}ms`,
                                }}
                              />
                            ))}
                          </div>

                          <span
                            className="text-[10px]"
                            style={{
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            Listening...
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assessment */}
                    <div
                      className="border-t p-5 sm:p-7 md:border-l md:border-t-0"
                      style={{
                        borderColor: 'var(--border)',
                        background:
                          'color-mix(in srgb, var(--bg-surface) 55%, transparent)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <p
                          className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                          style={{
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          Live assessment
                        </p>

                        <Zap
                          size={14}
                          style={{
                            color: 'var(--accent-3)',
                          }}
                        />
                      </div>

                      <div className="mt-6 flex items-center justify-center">
                        <div
                          className="relative flex h-28 w-28 items-center justify-center rounded-full"
                          style={{
                            background:
                              'conic-gradient(var(--accent-1) 0deg, var(--accent-2) 310deg, var(--border) 310deg)',
                          }}
                        >
                          <div
                            className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full"
                            style={{
                              background: 'var(--bg-page)',
                            }}
                          >
                            <span className="font-display text-2xl font-bold">
                              87
                            </span>

                            <span
                              className="text-[8px]"
                              style={{
                                color: 'var(--text-tertiary)',
                              }}
                            >
                              overall
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        {[
                          ['Clarity', 86],
                          ['Relevance', 92],
                          ['Depth', 78],
                          ['Confidence', 84],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <div className="mb-1.5 flex justify-between text-[10px]">
                              <span>{label}</span>

                              <span
                                style={{
                                  color: 'var(--text-tertiary)',
                                }}
                              >
                                {value}
                              </span>
                            </div>

                            <div
                              className="h-1.5 overflow-hidden rounded-full"
                              style={{
                                background: 'var(--border)',
                              }}
                            >
                              <div
                                className="h-full rounded-full bg-gradient-aurora"
                                style={{
                                  width: `${value}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p
              className="mt-4 text-center text-[10px]"
              style={{
                color: 'var(--text-tertiary)',
              }}
            >
              A glimpse of the SkillMate AI interview experience
            </p>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}
        <section
          id="how-it-works"
          className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-24 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gradient">
              Simple by design
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold sm:text-4xl">
              From resume to interview-ready
            </h2>

            <p
              className="mt-3 text-sm leading-6"
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              Everything you need to practice with a realistic AI
              interviewer.
            </p>
          </div>

          <div className="relative mt-12 grid gap-5 md:grid-cols-3">
            {/* Connecting line */}
            <div
              className="absolute left-[16%] right-[16%] top-[58px] hidden h-px md:block"
              style={{
                background:
                  'linear-gradient(90deg, transparent, var(--border), var(--border), transparent)',
              }}
            />

            {steps.map(
              ({ icon: Icon, number, title, desc }) => (
                <div
                  key={title}
                  className="surface group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative z-10 mb-6 flex items-center justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-105"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                      }}
                    >
                      <Icon size={19} />
                    </div>

                    <span
                      className="font-display text-xs font-bold"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {number}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold">
                    {title}
                  </h3>

                  <p
                    className="mt-2 text-sm leading-6"
                    style={{
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {desc}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ===================================================== */}
        <section
          id="features"
          className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-24 sm:px-6 lg:px-8"
        >
          <div
            className="relative overflow-hidden rounded-[30px] border p-6 sm:p-10 lg:p-12"
            style={{
              borderColor: 'var(--border)',
              background:
                'color-mix(in srgb, var(--bg-surface) 60%, transparent)',
            }}
          >
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-10 blur-3xl"
              style={{
                background: 'var(--accent-1)',
              }}
            />

            <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gradient">
                  Built for real preparation
                </p>

                <h2 className="font-display mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                  Practice smarter.
                  <br />
                  Walk in prepared.
                </h2>

                <p
                  className="mt-4 max-w-md text-sm leading-6"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  SkillMate combines your resume, target role, live
                  conversation, and performance analysis into one
                  focused preparation experience.
                </p>

                <Link
                  to="/signup"
                  className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold"
                  style={{
                    color: 'var(--accent-1)',
                  }}
                >
                  Start practicing

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <div className="grid gap-3">
                {features.map(
                  ({ icon: Icon, title, desc }) => (
                    <div
                      key={title}
                      className="group flex gap-4 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        borderColor: 'var(--border)',
                        background: 'var(--bg-surface)',
                      }}
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                        style={{
                          background:
                            'color-mix(in srgb, var(--accent-3) 10%, transparent)',
                          color: 'var(--accent-3)',
                        }}
                      >
                        <Icon size={18} />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold">
                          {title}
                        </h3>

                        <p
                          className="mt-1 text-xs leading-5"
                          style={{
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {desc}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TESTIMONIALS
        ===================================================== */}
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gradient">
              Practice with confidence
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold sm:text-4xl">
              What job seekers say
            </h2>

            <p
              className="mt-3 text-sm"
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              A realistic practice environment designed around
              the way interviews actually happen.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="surface group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Sparkles
                      key={index}
                      size={12}
                      style={{
                        color: 'var(--accent-2)',
                      }}
                    />
                  ))}
                </div>

                <p
                  className="text-sm leading-6"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  “{item.quote}”
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                    }}
                  >
                    {item.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-xs font-bold">
                      {item.name}
                    </p>

                    <p
                      className="mt-0.5 text-[10px]"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            PRICING
        ===================================================== */}
        <section className="mx-auto max-w-5xl px-5 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gradient">
              Simple pricing
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold sm:text-4xl">
              Start practicing today
            </h2>

            <p
              className="mt-3 text-sm"
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              Start with the features available today. No
              complicated plans.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-5 md:grid-cols-2">
            {/* Free */}
            <div className="surface relative overflow-hidden rounded-3xl p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div
                className="absolute right-0 top-0 h-24 w-24 rounded-full opacity-10 blur-2xl"
                style={{
                  background: 'var(--accent-1)',
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Free
                    </p>

                    <p className="font-display mt-2 text-4xl font-bold">
                      ₹0
                      <span
                        className="ml-1 text-xs font-normal"
                        style={{
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        / forever
                      </span>
                    </p>
                  </div>

                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background:
                        'color-mix(in srgb, var(--accent-1) 10%, transparent)',
                      color: 'var(--accent-1)',
                    }}
                  >
                    <Sparkles size={16} />
                  </div>
                </div>

                <div
                  className="my-6 h-px"
                  style={{
                    background: 'var(--border)',
                  }}
                />

                <ul className="space-y-3 text-sm">
                  {[
                    'Unlimited mock interviews',
                    'Voice input & AI voice questions',
                    'Full feedback reports',
                    'Interview history & progress tracking',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5"
                    >
                      <Check
                        size={15}
                        style={{
                          color: 'var(--accent-3)',
                        }}
                      />

                      <span
                        style={{
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className="group mt-7 flex items-center justify-center gap-2 rounded-xl bg-gradient-aurora py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Get started

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* Pro */}
            <div
              className="relative overflow-hidden rounded-3xl border p-7 opacity-70"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--bg-surface)',
              }}
            >
              <div
                className="absolute right-5 top-5 rounded-full px-2.5 py-1 text-[9px] font-semibold"
                style={{
                  background:
                    'color-mix(in srgb, var(--accent-2) 10%, transparent)',
                  color: 'var(--accent-2)',
                }}
              >
                COMING SOON
              </div>

              <p
                className="text-sm font-semibold"
                style={{
                  color: 'var(--text-secondary)',
                }}
              >
                Pro
              </p>

              <p className="font-display mt-2 text-4xl font-bold">
                TBD
              </p>

              <p
                className="mt-1 text-xs"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                Future premium features
              </p>

              <div
                className="my-6 h-px"
                style={{
                  background: 'var(--border)',
                }}
              />

              <ul className="space-y-3 text-sm">
                {[
                  'Industry-specific question banks',
                  'Detailed PDF reports',
                  'Priority AI response speed',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5"
                  >
                    <Check
                      size={15}
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    />

                    <span
                      style={{
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled
                className="mt-7 w-full cursor-not-allowed rounded-xl py-3 text-sm font-semibold"
                style={{
                  background: 'var(--border)',
                  color: 'var(--text-tertiary)',
                }}
              >
                Coming soon
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            FAQ
        ===================================================== */}
        <section
          id="faq"
          className="mx-auto max-w-3xl scroll-mt-8 px-5 pb-24 sm:px-6"
        >
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gradient">
              FAQ
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold sm:text-4xl">
              Frequently asked
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="surface group rounded-2xl p-5 transition-all duration-300 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                  <span>{item.q}</span>

                  <ChevronDown
                    size={17}
                    className="shrink-0 transition-transform duration-200 group-open:rotate-180"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  />
                </summary>

                <p
                  className="mt-3 max-w-2xl text-sm leading-6"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}
        <section className="mx-auto max-w-5xl px-5 pb-24 sm:px-6">
          <div
            className="relative overflow-hidden rounded-[30px] border p-8 text-center shadow-lg sm:p-12"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 15%, var(--bg-surface)), color-mix(in srgb, var(--accent-2) 12%, var(--bg-surface)))',
              borderColor: 'var(--border)',
            }}
          >
            {/* Decorative glow */}
            <div
              className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full blur-3xl"
              style={{
                background:
                  'color-mix(in srgb, var(--accent-1) 20%, transparent)',
              }}
            />

            <div
              className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full blur-3xl"
              style={{
                background:
                  'color-mix(in srgb, var(--accent-3) 18%, transparent)',
              }}
            />

            <div className="relative">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                }}
              >
                <Sparkles size={21} />
              </div>

              <h2 className="font-display mt-5 text-3xl font-bold sm:text-4xl">
                Ready to practice?
              </h2>

              <p
                className="mx-auto mt-3 max-w-md text-sm leading-6"
                style={{
                  color: 'var(--text-secondary)',
                }}
              >
                Build confidence before the real interview
                starts.
              </p>

              <Link
                to="/signup"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Get started free

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}
        <footer
          className="border-t px-5 py-8"
          style={{
            borderColor: 'var(--border)',
          }}
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
            <Link
              to="/"
              className="font-display text-sm font-bold transition-opacity hover:opacity-80"
            >
              SkillMate <span className="text-gradient">AI</span>
            </Link>

            <div className="flex items-center gap-4">
              <span
                className="flex items-center gap-1.5 text-[10px]"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                <Circle
                  size={6}
                  style={{
                    fill: 'var(--accent-3)',
                    color: 'var(--accent-3)',
                  }}
                />
                AI systems online
              </span>

              <span
                className="text-[10px]"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                AI-powered interview preparation
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}