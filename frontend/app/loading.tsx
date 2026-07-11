export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-3 text-center">
      <svg
        viewBox="0 0 120 120"
        className="h-24 w-24 animate-pulse text-primary"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 66c6-24 20-40 40-40s34 16 40 40c-11-5-22-2-30 2-6-3-14-3-20 0-8-4-19-7-30-2Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M60 66v26c0 5-4 9-9 9"
          className="text-foreground"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <p className="font-display text-2xl">opening the brolly...</p>
    </div>
  );
}
