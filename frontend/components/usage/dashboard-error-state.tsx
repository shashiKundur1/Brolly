import { Button } from "@/components/ui/button";
import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/ssr";

type DashboardErrorStateProps = {
  onRetry: () => void;
};

export function DashboardErrorState({ onRetry }: DashboardErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-24 text-center">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        role="img"
        aria-label="A doodle umbrella caught in the rain"
      >
        <path
          d="M60 18c-22 0-40 17-40 38h80c0-21-18-38-40-38z"
          fill="var(--secondary)"
          stroke="var(--foreground)"
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <line x1="60" y1="56" x2="60" y2="96" stroke="var(--foreground)" strokeWidth={3} strokeLinecap="round" />
        <path
          d="M60 96c0 6-6 8-10 4"
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <line x1="30" y1="70" x2="24" y2="82" stroke="var(--primary)" strokeWidth={3} strokeLinecap="round" />
        <line x1="45" y1="76" x2="40" y2="90" stroke="var(--primary)" strokeWidth={3} strokeLinecap="round" />
        <line x1="80" y1="76" x2="86" y2="90" stroke="var(--primary)" strokeWidth={3} strokeLinecap="round" />
        <line x1="94" y1="70" x2="100" y2="82" stroke="var(--primary)" strokeWidth={3} strokeLinecap="round" />
      </svg>
      <div className="flex flex-col gap-2">
        <p className="font-display text-3xl">The dashboard is out in the rain</p>
        <p className="text-muted-foreground">
          We couldn&apos;t reach the usage API. Check the backend and try again.
        </p>
      </div>
      <Button onClick={onRetry} className="bg-primary text-primary-foreground">
        <ArrowClockwiseIcon size={16} data-icon="inline-start" />
        Retry
      </Button>
    </div>
  );
}
