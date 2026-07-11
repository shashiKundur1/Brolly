export function BrollyLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-label="Brolly">
      <path
        d="M24 6C13 6 6 15 5 22c3-2 6-2 9 0 3-3 7-3 10 0 3-3 7-3 10 0 3-2 6-2 9 0C42 15 35 6 24 6Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M24 22v16a4 4 0 0 1-8 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
