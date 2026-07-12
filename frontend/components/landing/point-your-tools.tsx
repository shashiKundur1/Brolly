import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function PointYourTools() {
  return (
    <section className="-mx-6 bg-secondary/40 px-6 py-16 md:-mx-10 md:px-10 md:py-24">
      <ScrollReveal className="flex w-full flex-col items-center gap-3 text-center">
        <h2 className="font-display text-5xl md:text-6xl">point your tools here</h2>
        <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
          Every OpenAI-compatible SDK already speaks Brolly. There is no new
          client library to install and no request shape to relearn. Change
          one string and every call you already wrote starts flowing through
          the cascade and the failover, automatically.
        </p>
        <div className="mx-auto mt-4 w-full max-w-2xl">
          <pre className="doodle-border doodle-shadow overflow-x-auto rounded-2xl bg-card px-6 py-5 font-mono text-sm leading-relaxed">
            <code>
              <span className="text-muted-foreground">- baseURL: </span>
              <span className="text-foreground">&quot;https://api.openai.com/v1&quot;</span>
              {"\n"}
              <span className="text-primary">+ baseURL: </span>
              <span className="text-foreground">&quot;http://localhost:4000/v1&quot;</span>
            </code>
          </pre>
          <p className="mt-4 text-center font-display text-2xl text-balance">
            that&apos;s the whole migration.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
