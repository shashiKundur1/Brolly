import { cn } from "@/lib/utils";

type StatCellProps = {
  value: string;
  label: string;
  icon?: string;
  accent?: boolean;
  className?: string;
};

export function StatCell({ value, label, icon, accent, className }: StatCellProps) {
  return (
    <div
      className={cn(
        "doodle-card flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl px-4 py-6 text-center",
        className
      )}
    >
      {icon && (
        <img src={icon} alt="" className="size-10" width={40} height={40} />
      )}
      <p
        className={cn(
          "font-mono text-3xl font-bold tabular-nums leading-none",
          accent ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </p>
      <p className="font-body text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
