"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4 text-center">
      <svg
        viewBox="0 0 160 160"
        className="h-40 w-40 text-foreground"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M40 78c-6-14 5-27 18-26 2-16 20-26 34-18 14-8 32 1 33 18 13 2 20 17 13 27-8 12-24 12-38 10-16-2-32-1-47 3-8 2-16-6-13-14Z"
          className="text-muted-foreground"
          fill="currentColor"
          opacity="0.35"
        />
        <path
          d="M40 78c-6-14 5-27 18-26 2-16 20-26 34-18 14-8 32 1 33 18 13 2 20 17 13 27-8 12-24 12-38 10-16-2-32-1-47 3-8 2-16-6-13-14Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M72 96 61 116l16-3-9 21"
          className="text-primary"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M100 100l7 6-8 5 9 7"
          className="text-primary"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="font-display text-3xl">something short-circuited.</p>
      {error.digest ? (
        <p className="font-mono text-xs text-muted-foreground">{error.digest}</p>
      ) : null}
      <div className="flex items-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="ghost" render={<Link href="/" />}>
          Go home
        </Button>
      </div>
    </div>
  );
}
