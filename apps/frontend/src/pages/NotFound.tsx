import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Compass,
  Home,
  Sparkles,
} from 'lucide-react'

export default function NotFound() {
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
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full opacity-15 blur-[130px]"
        style={{
          background: 'var(--accent-1)',
        }}
      />

      <div
        className="pointer-events-none absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full opacity-10 blur-[130px]"
        style={{
          background: 'var(--accent-2)',
        }}
      />

      {/* Brand */}
      <header className="absolute left-0 right-0 top-0 px-6 py-6 sm:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
            }}
          >
            <Sparkles size={17} />
          </div>

          <div>
            <p className="font-display text-sm font-bold leading-none">
              SkillMate
            </p>
            <p className="text-gradient font-display text-sm font-bold leading-none">
              AI
            </p>
          </div>
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">

        <div className="w-full max-w-lg">

          {/* 404 icon */}
          <div
            className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border shadow-lg"
            style={{
              borderColor: 'var(--border)',
              background:
                'color-mix(in srgb, var(--accent-1) 8%, var(--bg-page))',
            }}
          >
            <Compass
              size={36}
              style={{
                color: 'var(--accent-1)',
              }}
            />
          </div>

          <div
            className="mb-3 text-7xl font-black tracking-tight sm:text-8xl"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            404
          </div>

          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Looks like you took a wrong turn.
          </h1>

          <p
            className="mx-auto mt-3 max-w-md text-sm leading-6"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            This page doesn't exist. Let's get you back to
            your SkillMate AI workspace.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <Link
              to="/dashboard"
              className="group flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
              }}
            >
              <Home size={16} />
              Back to Dashboard
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              to="/"
              className="flex w-full items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-all hover:bg-black/5 sm:w-auto"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
                background: 'var(--bg-page)',
              }}
            >
              Go to Home
            </Link>

          </div>

          <div className="mt-10 flex items-center justify-center gap-2">
            <Sparkles
              size={12}
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
              Your AI interview workspace is waiting
            </span>
          </div>

        </div>
      </main>
    </div>
  )
}