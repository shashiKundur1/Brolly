import Link from "next/link";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { UmbrellaDoodle } from "@/components/brand/icons";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cascade", label: "Cascade" },
  { href: "/failover", label: "Failover" },
];

export function LandingFooter() {
  return (
    <footer className="-mx-6 cell-mint px-6 py-10 md:-mx-10 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <p className="flex items-center gap-2.5 font-display text-2xl font-semibold text-foreground">
            <UmbrellaDoodle className="size-6 text-primary" />
            Brolly
          </p>
          <p className="text-sm font-medium text-foreground/70">
            model insurance for your LLM apps
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-foreground">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
          <Link
            href="https://github.com/shashiKundur1/Brolly"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-primary"
          >
            <GithubLogoIcon size={18} />
            GitHub
          </Link>
        </nav>
        <p className="text-sm font-medium text-foreground/70">
          Built on the Mesh API — one key, 1000+ models.
        </p>
      </div>
    </footer>
  );
}
