export function PointYourTools() {
  return (
    <section className="-mx-6 bg-secondary/40 px-6 py-10 md:-mx-10 md:px-10">
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <h2 className="font-display text-3xl">Point your tools here</h2>
        <p className="max-w-prose text-sm text-muted-foreground text-balance">
          Every OpenAI-compatible SDK already speaks Brolly.
        </p>
      </div>
      <div className="mx-auto mt-6 max-w-2xl">
        <pre className="doodle-border doodle-shadow overflow-x-auto rounded-2xl bg-card px-6 py-5 font-mono text-sm leading-relaxed">
          <code>
            <span className="text-muted-foreground">- baseURL: </span>
            <span className="text-foreground">&quot;https://api.openai.com/v1&quot;</span>
            {"\n"}
            <span className="text-primary">+ baseURL: </span>
            <span className="text-foreground">&quot;http://localhost:4000/v1&quot;</span>
          </code>
        </pre>
        <p className="mt-3 text-center font-display text-xl text-balance">
          that&apos;s the whole migration.
        </p>
      </div>
    </section>
  );
}
