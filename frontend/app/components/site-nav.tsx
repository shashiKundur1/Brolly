import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrollyLogo } from "@/components/brand/logo";

export function SiteNav() {
  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-3 md:h-16 md:flex-nowrap md:px-10 md:py-0">
      <Link href="/" className="group flex items-center gap-2">
        <BrollyLogo className="size-8 text-primary motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-linear motion-safe:group-hover:-rotate-6" />
        <span className="inline-block -rotate-2 font-display text-3xl leading-none text-foreground">
          Brolly
        </span>
      </Link>
      <nav className="order-last flex w-full items-center justify-center gap-5 text-sm md:order-none md:w-auto md:gap-6 md:text-base">
        <Link href="/dashboard" className="hover:text-primary">
          Dashboard
        </Link>
        <Link href="/cascade" className="hover:text-primary">
          Cascade
        </Link>
        <Link href="/failover" className="hover:text-primary">
          Failover
        </Link>
      </nav>
      <Button>Point your tools here</Button>
    </header>
  );
}
