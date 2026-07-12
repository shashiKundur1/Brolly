import { Button } from "@/components/ui/button";
import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/ssr";

type CascadeErrorStateProps = {
  onRetry: () => void;
};

export function CascadeErrorState({ onRetry }: CascadeErrorStateProps) {
  return (
    <div className="flex min-h-96 flex-1 flex-col items-center justify-center gap-6 text-center">
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        role="img"
        aria-label="A doodle storm cloud with heavy rain"
      >
        <path
          d="M30 62 a24 24 0 1 1 0.1 0 M56 48 a30 30 0 1 1 0.1 0 M88 50 a27 27 0 1 1 0.1 0 M112 64 a20 20 0 1 1 0.1 0 M20 70 h100"
          fill="var(--card)"
          stroke="var(--foreground)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="38" y1="86" x2="30" y2="106" stroke="var(--primary)" strokeWidth={3} strokeLinecap="round" />
        <line x1="58" y1="86" x2="50" y2="106" stroke="var(--primary)" strokeWidth={3} strokeLinecap="round" />
        <line x1="78" y1="86" x2="70" y2="106" stroke="var(--primary)" strokeWidth={3} strokeLinecap="round" />
        <line x1="98" y1="86" x2="90" y2="106" stroke="var(--primary)" strokeWidth={3} strokeLinecap="round" />
      </svg>
      <div className="flex flex-col gap-2">
        <p className="font-display text-3xl">can&apos;t reach Brolly&apos;s brain</p>
        <p className="text-muted-foreground">
          The cascade API didn&apos;t answer after a few tries. Check the backend and try again.
        </p>
      </div>
      <Button onClick={onRetry} className="bg-primary text-primary-foreground">
        <ArrowClockwiseIcon size={16} data-icon="inline-start" />
        Retry
      </Button>
    </div>
  );
}
