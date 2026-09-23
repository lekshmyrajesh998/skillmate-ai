export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{
        background:
          'linear-gradient(90deg, var(--bg-page-2), color-mix(in srgb, var(--accent-1) 4%, var(--bg-page-2)), var(--bg-page-2))',
      }}
      aria-hidden="true"
    />
  )
}