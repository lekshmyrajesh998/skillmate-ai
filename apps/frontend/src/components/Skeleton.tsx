export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white/8 rounded-lg animate-pulse ${className}`} />
  )
}