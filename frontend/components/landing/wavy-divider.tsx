const toneFillVar: Record<string, string> = {
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  accent: "var(--accent)",
  background: "var(--background)",
};

type WavyDividerProps = {
  tone?: "primary" | "secondary" | "accent" | "background";
};

export function WavyDivider({ tone }: WavyDividerProps) {
  if (tone) {
    return (
      <div className="-mx-6 h-10 w-full md:-mx-10 md:h-14" aria-hidden="true">
        <svg
          viewBox="0 0 1200 56"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0 0 L0 26 C 50 12, 100 40, 150 26 C 200 12, 250 40, 300 26 C 350 12, 400 40, 450 26 C 500 12, 550 40, 600 26 C 650 12, 700 40, 750 26 C 800 12, 850 40, 900 26 C 950 12, 1000 40, 1050 26 C 1100 12, 1150 40, 1200 26 L1200 0 Z"
            fill={toneFillVar[tone]}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="-mx-6 h-6 md:-mx-10" aria-hidden="true">
      <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="h-6 w-full">
        <path
          d="M0 12 C 50 2, 100 22, 150 12 C 200 2, 250 22, 300 12 C 350 2, 400 22, 450 12 C 500 2, 550 22, 600 12 C 650 2, 700 22, 750 12 C 800 2, 850 22, 900 12 C 950 2, 1000 22, 1050 12 C 1100 2, 1150 22, 1200 12"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
