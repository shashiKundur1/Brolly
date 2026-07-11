import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrollyLogo } from "@/components/brand/logo";

export function SiteNav() {
  return (
    <header className="w-full px-6 md:px-10 py-4 flex items-center justify-between">
      <Link href="/" className="font-display text-2xl flex items-center gap-2">
        <BrollyLogo className="size-6" />
        Brolly
      </Link>
      <nav className="flex items-center gap-6">
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
      <Button className="bg-primary text-primary-foreground">
        Point your tools here
      </Button>
    </header>
  );
}
