import Link from "next/link";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";

export function LandingFooter() {
  return (
    <footer className="w-full bg-secondary px-6 py-8 md:px-10">
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-secondary-foreground">
          Built on the Mesh API. One key, 1000+ models.
        </p>
        <Link
          href="https://github.com/shashiKundur1/Brolly"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
        >
          <GithubLogoIcon size={20} />
          View on GitHub
        </Link>
      </div>
    </footer>
  );
}
