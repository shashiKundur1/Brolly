import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4 text-center">
      <svg
        viewBox="0 0 160 160"
        className="h-40 w-40 text-foreground"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M80 62c-1 12-2 30-1 48"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M62 118c0 6 8 11 18 11s18-5 18-11"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M30 66c4-9 14-6 18 0 5-11 17-11 21 1 4-13 18-13 22-1 4-8 15-10 19-1 4-7 13-8 18-2"
          className="text-primary"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30 66c9 3 19 4 30 3 13-1 24-4 33-9 8-4 15-3 20 1"
          className="text-primary"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M46 55 40 47M96 40l-3-10M118 58l7-8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <p className="font-display text-7xl">404</p>
      <p className="text-base text-muted-foreground">this page got rained out.</p>
      <Button render={<Link href="/" />}>Go home</Button>
    </div>
  );
}
