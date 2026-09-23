import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  ChevronRight,
  Circle,
  History as HistoryIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings as SettingsIcon,
  Sparkles,
  User,
  X,
} from 'lucide-react'

import { useAuthStore } from '../store/authStore'
import ThemeToggle from './ThemeToggle'

export default function Sidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const desktopProfileRef = useRef<HTMLDivElement>(null)
  const mobileProfileRef = useRef<HTMLDivElement>(null)

  const userName = useAuthStore((state) => state.userName)
  const userEmail = useAuthStore((state) => state.userEmail)
  const profileImage = useAuthStore((state) => state.profileImage)
  const logout = useAuthStore((state) => state.logout)

  /*
   * Close profile menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      const clickedDesktop =
        desktopProfileRef.current?.contains(target)

      const clickedMobile =
        mobileProfileRef.current?.contains(target)

      if (!clickedDesktop && !clickedMobile) {
        setProfileMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  /*
   * Close menu whenever route changes
   */
  useEffect(() => {
    setProfileMenuOpen(false)
  }, [pathname])

  /*
   * Public pages do not need the sidebar
   */
  if (['/', '/login', '/signup'].includes(pathname)) {
    return null
  }

  const links = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      path: '/interview',
      icon: MessageSquare,
      label: 'Interview',
    },
    {
      path: '/feedback',
      icon: BarChart3,
      label: 'Feedback',
    },
    {
      path: '/history',
      icon: HistoryIcon,
      label: 'History',
    },
    {
      path: '/profile',
      icon: User,
      label: 'Profile',
    },
    {
      path: '/settings',
      icon: SettingsIcon,
      label: 'Settings',
    },
  ]

  const initials = userName
    ? userName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name[0]?.toUpperCase())
        .join('')
    : 'U'

  /*
   * Centralized logout handler
   *
   * Important:
   * 1. Close popup
   * 2. Clear Zustand auth state
   * 3. Replace current history entry
   * 4. Navigate to Login
   */
  const handleLogout = () => {
    setProfileMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }

    return (
      pathname === path ||
      pathname.startsWith(`${path}/`)
    )
  }

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}
      <aside
        className="fixed left-0 top-0 z-40 hidden h-screen w-56 flex-col border-r md:flex"
        style={{
          background: 'var(--bg-page)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Brand */}
        <div className="px-5 pb-7 pt-6">
          <Link
            to="/dashboard"
            className="group flex items-center gap-2.5"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-2"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
              }}
            >
              <Sparkles size={18} />
            </div>

            <div className="min-w-0">
              <p
                className="font-display text-[15px] font-bold leading-none"
                style={{
                  color: 'var(--text-primary)',
                }}
              >
                SkillMate <span className="text-gradient">AI</span>
              </p>

              <p
                className="mt-1 text-[9px] font-medium tracking-wide"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                AI INTERVIEW PREP
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Label */}
        <div className="px-5 pb-2.5">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{
              color: 'var(--text-tertiary)',
            }}
          >
            Workspace
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {links.map(({ path, icon: Icon, label }) => {
            const active = isActive(path)

            return (
              <Link
                key={path}
                to={path}
                className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:translate-x-0.5"
                style={{
                  color: active
                    ? 'var(--accent-1)'
                    : 'var(--text-secondary)',
                  background: active
                    ? 'color-mix(in srgb, var(--accent-1) 10%, transparent)'
                    : 'transparent',
                  fontWeight: active ? 600 : 400,
                }}
              >
                {active && (
                  <span
                    className="absolute left-0 h-6 w-0.5 rounded-full"
                    style={{
                      background:
                        'linear-gradient(180deg, var(--accent-1), var(--accent-2))',
                    }}
                  />
                )}

                <Icon
                  size={17}
                  strokeWidth={active ? 2.2 : 1.8}
                  className="transition-transform duration-200 group-hover:scale-110"
                />

                <span className="flex-1">{label}</span>

                {active && (
                  <ChevronRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                    style={{
                      color: 'var(--accent-1)',
                    }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* AI Status */}
        <div className="px-3 pb-3">
          <div
            className="rounded-2xl border p-3.5 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor:
                'color-mix(in srgb, var(--accent-1) 15%, var(--border))',
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--accent-1) 7%, transparent), color-mix(in srgb, var(--accent-2) 5%, transparent))',
            }}
          >
            <div className="flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span
                  className="absolute h-2.5 w-2.5 animate-ping rounded-full"
                  style={{
                    background: 'var(--accent-3)',
                    opacity: 0.25,
                  }}
                />

                <Circle
                  size={7}
                  style={{
                    fill: 'var(--accent-3)',
                    color: 'var(--accent-3)',
                  }}
                />
              </div>

              <span
                className="text-xs font-semibold"
                style={{
                  color: 'var(--text-primary)',
                }}
              >
                AI is online
              </span>
            </div>

            <p
              className="mt-1.5 text-[10px] leading-relaxed"
              style={{
                color: 'var(--text-tertiary)',
              }}
            >
              Ready to help you prepare for your next interview.
            </p>
          </div>
        </div>

        {/* Desktop Profile */}
        <div
          ref={desktopProfileRef}
          className="relative border-t px-3 py-3"
          style={{
            borderColor: 'var(--border)',
          }}
        >
          <button
            type="button"
            onClick={() =>
              setProfileMenuOpen((open) => !open)
            }
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
            aria-label="Open profile menu"
            className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
          >
            {/* Avatar */}
            <div
              className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-sm transition-all duration-300 group-hover:scale-105"
              style={{
                background:
                  'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
              }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`${userName || 'User'} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
                  {initials}
                </div>
              )}

              <span
                className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2"
                style={{
                  background: 'var(--accent-3)',
                  borderColor: 'var(--bg-page)',
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="truncate text-xs font-semibold"
                style={{
                  color: 'var(--text-primary)',
                }}
              >
                {userName || 'Candidate'}
              </p>

              <p
                className="truncate text-[10px]"
                style={{
                  color: 'var(--text-tertiary)',
                }}
              >
                {userEmail || 'Account'}
              </p>
            </div>

            <ChevronRight
              size={15}
              className={`transition-transform duration-300 ${
                profileMenuOpen ? 'rotate-90' : ''
              }`}
              style={{
                color: 'var(--text-tertiary)',
              }}
            />
          </button>

          {/* Desktop Profile Dropdown */}
          {profileMenuOpen && (
            <div
              className="absolute bottom-[calc(100%-8px)] left-3 right-3 mb-2 overflow-hidden rounded-2xl border shadow-2xl"
              style={{
                background: 'var(--bg-page)',
                borderColor: 'var(--border)',
                animation: 'fadeIn 0.2s ease-out',
              }}
              role="menu"
            >
              {/* Header */}
              <div
                className="border-b px-3.5 py-3"
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 shrink-0 overflow-hidden rounded-xl"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                    }}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                        {initials}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className="truncate text-xs font-semibold"
                      style={{
                        color: 'var(--text-primary)',
                      }}
                    >
                      {userName || 'Candidate'}
                    </p>

                    <p
                      className="truncate text-[10px]"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {userEmail || 'Account'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div className="p-1.5">
                <Link
                  to="/profile"
                  onClick={() => setProfileMenuOpen(false)}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  role="menuitem"
                >
                  <User
                    size={16}
                    className="transition-transform duration-200 group-hover:scale-110"
                    style={{
                      color: 'var(--accent-1)',
                    }}
                  />

                  <span className="flex-1">View profile</span>

                  <ChevronRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  />
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  role="menuitem"
                >
                  <SettingsIcon
                    size={16}
                    className="transition-transform duration-300 group-hover:rotate-45"
                    style={{
                      color: 'var(--accent-2)',
                    }}
                  />

                  <span className="flex-1">Settings</span>

                  <ChevronRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  />
                </Link>
              </div>

              {/* Logout */}
              <div
                className="border-t p-1.5"
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                <button
                  type="button"
                  onClick={handleLogout}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-500"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  role="menuitem"
                >
                  <LogOut
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />

                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}

          {/* Appearance */}
          <div className="mt-2 flex items-center justify-between rounded-xl px-2.5 py-2">
            <span
              className="text-[10px] font-medium"
              style={{
                color: 'var(--text-tertiary)',
              }}
            >
              Appearance
            </span>

            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* =====================================================
          MOBILE TOP BAR
      ===================================================== */}
      <header
        className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b px-4 md:hidden"
        style={{
          background: 'var(--bg-page)',
          borderColor: 'var(--border)',
        }}
      >
        <Link
          to="/dashboard"
          className="group flex items-center gap-2.5"
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-2"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
            }}
          >
            <Sparkles size={16} />
          </div>

          <span
            className="font-display text-base font-bold"
            style={{
              color: 'var(--text-primary)',
            }}
          >
            SkillMate <span className="text-gradient">AI</span>
          </span>
        </Link>

        <div
          ref={mobileProfileRef}
          className="relative flex items-center gap-2"
        >
          <ThemeToggle />

          {/* Mobile Profile Trigger */}
          <button
            type="button"
            onClick={() =>
              setProfileMenuOpen((open) => !open)
            }
            aria-expanded={profileMenuOpen}
            aria-haspopup="menu"
            aria-label="Open profile menu"
            className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl text-xs font-bold text-white shadow-sm transition-all duration-300 hover:scale-105"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
            }}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt={`${userName || 'User'} profile`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              initials
            )}

            <span
              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2"
              style={{
                background: 'var(--accent-3)',
                borderColor: 'var(--bg-page)',
              }}
            />
          </button>

          {/* Mobile Dropdown */}
          {profileMenuOpen && (
            <div
              className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border shadow-2xl"
              style={{
                background: 'var(--bg-page)',
                borderColor: 'var(--border)',
                animation: 'fadeIn 0.2s ease-out',
              }}
              role="menu"
            >
              {/* Header */}
              <div
                className="border-b px-4 py-3.5"
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 shrink-0 overflow-hidden rounded-xl"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                    }}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                        {initials}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-semibold"
                      style={{
                        color: 'var(--text-primary)',
                      }}
                    >
                      {userName || 'Candidate'}
                    </p>

                    <p
                      className="truncate text-[11px]"
                      style={{
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {userEmail || 'Account'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen(false)}
                    className="ml-auto rounded-lg p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    aria-label="Close menu"
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Menu */}
              <div className="p-1.5">
                <Link
                  to="/profile"
                  onClick={() => setProfileMenuOpen(false)}
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  role="menuitem"
                >
                  <User
                    size={17}
                    style={{
                      color: 'var(--accent-1)',
                    }}
                  />

                  <span className="flex-1">
                    View profile
                  </span>

                  <ChevronRight
                    size={15}
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  />
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  role="menuitem"
                >
                  <SettingsIcon
                    size={17}
                    style={{
                      color: 'var(--accent-2)',
                    }}
                  />

                  <span className="flex-1">
                    Settings
                  </span>

                  <ChevronRight
                    size={15}
                    style={{
                      color: 'var(--text-tertiary)',
                    }}
                  />
                </Link>
              </div>

              {/* Logout */}
              <div
                className="border-t p-1.5"
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-500"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                  role="menuitem"
                >
                  <LogOut size={17} />

                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* =====================================================
          MOBILE BOTTOM NAV
      ===================================================== */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t px-1 py-2 md:hidden"
        style={{
          background: 'var(--bg-page)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="grid grid-cols-6">
          {links.map(({ path, icon: Icon, label }) => {
            const active = isActive(path)

            return (
              <Link
                key={path}
                to={path}
                className="group flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-all duration-200"
                style={{
                  color: active
                    ? 'var(--accent-1)'
                    : 'var(--text-tertiary)',
                }}
              >
                <div
                  className="rounded-lg p-1.5 transition-all duration-200 group-hover:scale-105"
                  style={{
                    background: active
                      ? 'color-mix(in srgb, var(--accent-1) 10%, transparent)'
                      : 'transparent',
                  }}
                >
                  <Icon
                    size={18}
                    strokeWidth={active ? 2.3 : 1.8}
                  />
                </div>

                <span
                  className="text-[9px]"
                  style={{
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}