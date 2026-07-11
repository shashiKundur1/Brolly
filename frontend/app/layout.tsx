import type { Metadata } from "next";
import { Gochi_Hand, Nunito } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteNav } from "@/app/components/site-nav";
import "./globals.css";

const gochiHand = Gochi_Hand({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brolly — Model Insurance for your LLM apps",
  description: "LLM usage dashboard, cost cascade, and failover demo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${gochiHand.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <TooltipProvider>
          <SiteNav />
          <main className="w-full flex-1 px-6 md:px-10">{children}</main>
        </TooltipProvider>
      </body>
    </html>
  );
}
