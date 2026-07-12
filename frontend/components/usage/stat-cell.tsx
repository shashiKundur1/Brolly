import { InlineBrandSvg } from "@/components/usage/inline-brand-svg";
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
        "doodle-border flex min-h-32 flex-col items-center justify-center gap-1 rounded-2xl px-4 py-5 text-center",
        className
      )}
    >
      {icon && (
        <InlineBrandSvg
          src={icon}
          className={cn(
            "mb-1 size-12 [&_svg]:size-full",
            accent ? "text-primary" : "text-foreground"
          )}
        />
      )}
      <p
        className={cn(
          "font-mono text-3xl font-bold tabular-nums leading-none",
          accent ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
