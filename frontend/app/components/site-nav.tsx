"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BrollyWordmark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cascade", label: "Cascade" },
  { href: "/failover", label: "Failover" },
];

function NavUnderline({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute -bottom-1.5 left-0 h-2.5 w-full overflow-visible text-primary motion-safe:transition-opacity motion-safe:duration-150 motion-safe:ease-linear",
        active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}
    >
      <path
        d="M2 6.5C15 2 25 9 38 5.5C51 2 60 9.5 73 5.5C82 2.8 90 6 98 4"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 3 : 2.5}
        strokeLinecap="round"
        style={{ filter: "url(#doodle-rough-filter)" }}
      />
    </svg>
  );
}

function NavDot({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -top-2.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-linear",
        active
          ? "scale-100"
          : "scale-0 group-hover:scale-100"
      )}
    />
  );
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="relative w-full bg-card">
      <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 px-6 py-3 md:h-20 md:flex-nowrap md:px-10 md:py-0">
        <Link href="/" className="group flex items-center">
          <BrollyWordmark />
        </Link>
        <nav className="order-last flex w-full items-center justify-center gap-6 text-sm md:order-none md:w-auto md:gap-9 md:text-base">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative inline-block py-1 font-semibold motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-linear motion-safe:hover:-translate-y-0.5",
                  active ? "text-primary" : "text-foreground hover:text-primary"
                )}
              >
                <NavDot active={active} />
                {link.label}
                <NavUnderline active={active} />
              </Link>
            );
          })}
        </nav>
        <Button size="lg" className="rounded-2xl font-bold">
          Point your tools here
        </Button>
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 3"
        preserveAspectRatio="none"
        className="block h-2.5 w-full text-foreground"
      >
        <path
          d="M0 1.5C4 0.3 7 2.7 11 1.5C15 0.3 18 2.7 22 1.5C26 0.3 29 2.7 33 1.5C37 0.3 40 2.7 44 1.5C48 0.3 51 2.7 55 1.5C59 0.3 62 2.7 66 1.5C70 0.3 73 2.7 77 1.5C81 0.3 84 2.7 88 1.5C92 0.3 95 2.7 100 1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          style={{ filter: "url(#doodle-rough-filter)" }}
        />
      </svg>
    </header>
  );
}
