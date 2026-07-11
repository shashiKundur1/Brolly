# What Developers Actually Hate About Scheduled / Workflow AI Agents

*Compiled 12 July 2026 · sourced live from the Hacker News Algolia API (`hn.algolia.com/api/v1`) and Lobsters (`lobste.rs`) · every quote below was fetched from a live page during this research session, not recalled from training data.*

**Why this doc exists:** we're pivoting a hackathon project to a scheduled multi-step, multi-model workflow agent. Before building, this is the prior-art pain: what developers say is actually broken about n8n AI nodes, LangChain/LangGraph/CrewAI agents, cron-triggered LLM jobs, and autonomous/unattended agent runs.

**Method:** two independent research passes against HN Algolia (`hn.algolia.com/api/v1/search`, tags `story`/`comment`, various `created_at_i` floors) and Lobsters (`lobste.rs/search?q=<term>&what=stories&order=newest`, plus direct story-page fetches for comments), covering terms like `n8n`, `LangChain`, `CrewAI`, `Zapier AI`, `Make.com`, `agent silent failure`, `agent framework overkill`, `agent loop cost tokens`, `autonomous agent reliability`, `AI cron job`, and `agent did the wrong thing`. Promising story/comment threads were drilled into via `hn.algolia.com/api/v1/items/<id>` and individual Lobsters story pages. In total, ~35 HN search queries and ~25 item fetches, plus ~9 Lobsters searches and several story-page fetches, across both passes.

---

## Top recurring complaints (ranked)

Ranked by how often the underlying pain recurred across independent threads/authors, not by raw quote count.

1. **Cost/token blowup from agent loops and retries — the single most viscerally reported complaint.** Multiple independent "I woke up to a $2,000/$500/$47/$40-60 API bill" stories, all describing the same failure shape: an agent gets stuck retrying (often on malformed JSON/tool output) with no circuit breaker, and burns money unattended overnight. Strong enough that at least three different Show HN products (AgentGuard, budget dashboards, Agent Firewall) exist purely to solve this.

2. **Silent failure / no visibility into whether the automation actually ran or worked correctly.** Repeated near-identically across cron jobs, single agents, and multi-agent pipelines: "you only find out after something's gone wrong," "there's no way to know what the agent did, when, or why." People built monitoring products specifically because this resonates.

3. **"It ran, logged success, and did the wrong thing" — worse than an outright crash.** Distinct from silent failure: the system reports success while producing an incorrect result (a support agent misrouting refund requests, a document agent hallucinating missing sections, a dealership chatbot "selling" a car for $1). Named directly as "no stack trace or 500 error — you only find out when a customer is angry."

4. **Over-engineered agent frameworks (LangChain/LangGraph especially) — "abstraction soup" that makes debugging worse, not better.** Recurs across 2+ years of threads independent of any single incident: people report ripping LangChain/LangGraph out of production, writing their own 100-line replacements, or picking a framework with zero dependencies specifically to avoid this.

5. **Trust/oversight erosion on unattended runs — "automation complacency."** Not just "agents make mistakes" but a named cognitive-bias failure mode: humans start rubber-stamping agent approvals once the agent has been right a few times, so oversight quietly stops working right when it's needed most.

6. **Debugging non-determinism is uniquely painful because the framework adds its own indirection on top of it.** "10 more places to look that MIGHT be the source of the bug" — the complaint isn't that LLMs are non-deterministic (expected), it's that heavyweight frameworks compound that with their own opacity.

7. **n8n specifically: flaky under complexity, expensive at scale, and pushes people back to plain code.** A recurring pattern of engineers trying n8n, then migrating real workloads to shell scripts / cron / CI jobs once things got non-trivial, citing flaky parallel execution, poor observability, and cost.

---

## Notable quotes (quote · url · date)

### Cost / token blowup on loops

> "Your AI agent hits an infinite loop and racks up $2000 in API charges overnight. This happens weekly to AI developers. ... I got tired of seeing 'I accidentally spent $500 on OpenAI' posts."
— dipampaul17, Show HN "AgentGuard" · https://news.ycombinator.com/item?id=44742710 · 2025-07-31

> "I run 6 AI agents as my entire team. Yesterday two agents got stuck in an infinite loop arguing over JSON formatting. Burned $47 in API calls while I slept. ... agents go rogue, tokens burn, no circuit breaker."
— wuweiaxin, HN comment · https://news.ycombinator.com/item?id=47308378 · 2026-03-09

> "I've been running agentic workflows (OpenClaw/similar) and kept waking up to $40-60 API bills because agents get stuck in infinite retry loops while I sleep. The problem: agent tries action → fails → retries the same action → fails again → repeats 500+ times because there's no state memory. ... staring at JSON logs at 3am is miserable."
— justinlord, HN comment · https://news.ycombinator.com/item?id=46911968 · 2026-02-06

> "Token velocity is great, but the industry is hyper-fixated on speed while completely ignoring the blast radius. If we push to 17k tokens/sec for autonomous agents, we are just accelerating how fast an agent can hit an infinite loop and drain an API budget. ... Speed without governance is just a faster way to burn capital."
— HenryOsborn, HN comment · https://news.ycombinator.com/item?id=47096517 · 2026-02-21

> "the cost isn't just 'how many tokens did this call use,' it's 'how many tokens did this entire user action consume across all the agent loops, retries, tool calls, and embeddings.' ... it's usually a few specific flows that blow up (retries on bad structured output ..., or RAG queries that hit the wrong chunk size)"
— dkowalski, HN comment · https://news.ycombinator.com/item?id=47332177 (comment 47346646) · 2026-03-12

> "I've tested this with n8n workflows and seen $200→$25/day cost reductions on production workloads."
— jmrobles, Show HN "Autocache – Cut Claude API costs 90% (for n8n, Flowise, etc.)" · https://news.ycombinator.com/item?id=45518035 · 2025-10-08

### Silent failure / observability ("did my automation even fire?")

> "If you've ever had a critical cron job silently fail without realizing it until it was too late, you're not alone." / "If your job is silent, we'll be loud."
— janschwoebel, Show HN post + comment · https://news.ycombinator.com/item?id=43329966 · 2025-03-11

> "Most agent failures are silent...we treat agents as black boxes"
— Mesterniz, HN comment · https://news.ycombinator.com/item?id=46245185 · 2025-12-12

> "Most teams are deploying agents with no behavioral monitoring, credentials leaking into logs, and zero audit trails." / "When something goes wrong (and it does), there's no way to know what the agent did, when, or why."
— nodeloom, Show HN comment (agent-ops monitoring product — the pitch itself is evidence of the pain) · https://news.ycombinator.com/item?id=47257285 · 2026-03-05

> "You install it and it might be doing nothing, You only find out after something's gone wrong."
— almost, HN comment on AgentGuard Show HN · https://news.ycombinator.com/item?id=44742710 (comment 44743048) · 2025-07-31

> "Observability is poor out of the box." / "Poor out of box defaults for security, mainly authentication." / "Conflict resolution sucks."
— bearjaws, HN comment thread "N8n vs. node-red" · https://news.ycombinator.com/item?id=44592006 · 2025-07-17

> "The issues I come across is visualizing what is going on inside of a system once it is created" / "n8n is sorely missing [a live dashboard] and it is needed to monitor live systems"
— daniel-payne, same thread · https://news.ycombinator.com/item?id=44592006 · 2025-07-17

### "It ran but did the wrong thing"

> "When agents fail, choose wrong tools, or blow cost budgets, there's no way to know why — usually just logs and guesswork. ... A support agent that began misclassifying refund requests as product questions, which meant customers never reached the refund flow. A document drafting agent that would occasionally hallucinate missing sections when parsing long specs, producing confident but incorrect outputs. There's no stack trace or 500 error and you only figure this out when a customer is angry."
— anayrshukla, Show HN "Sentrial" · https://news.ycombinator.com/item?id=47337659 · 2026-03-11

> "In 2024, a Chevy dealership deployed an AI chatbot that confidently agreed to sell a customer a 2024 Chevy Tahoe for $1. It executed a catastrophic business failure simply because it didn't know the logic was wrong. ... You can contain a system failure, but you cannot contain a logic failure if the system doesn't know the logic is wrong."
— distalx, HN comment · https://news.ycombinator.com/item?id=48003858 · 2026-05-04

> "One step returns slightly malformed or incomplete state / Downstream steps continue executing anyway / The issue only surfaces several steps later. Nothing actually 'fails' — the system just produces the wrong result. ... Logs/traces help explain what happened after the fact / But they don't prevent bad execution from propagating"
— skhatter, HN comment · https://news.ycombinator.com/item?id=47802170 · 2026-04-17

> "LLM non-determinism is a silent killer for production data. A prompt tweak or model update can shift an extraction from: `amount: 72` to: `amount: "72.00"`. Nothing crashes. Your pipeline just sends incorrect numbers downstream."
— Mofa1245, HN comment · https://news.ycombinator.com/item?id=47368649 · 2026-03-13

> "Silent failures in customer facing deployments are particularly dangerous. They can compound with the agent logging success while the actual outcome is wrong."
— hmacavelia, HN comment on "Five AI Agent Failures in 36 Days. Zero Times the Agent Caught It" (grith.ai) · https://news.ycombinator.com/item?id=47948959 · 2026-04-29

### Over-engineering of agent frameworks

> "We've removed LangChain and LangGraph from our project at work because they are literally worthless, just adding complexity and making you write MORE code than if you didn't use them because you have to deal with their whole boilerplate."
— iLoveOncall, HN comment on "Building Effective AI Agents" · https://news.ycombinator.com/item?id=44303865 · 2025-06-17

> "LangChain was great for getting something running in 5 minutes, but the 'abstraction soup' makes debugging a nightmare in production. I'm seeing more people just using the OpenAI/Anthropic SDKs directly or very thin wrappers. It's better to own your prompts than to hide them behind five layers of library code."
— CodeBit26, HN comment · https://news.ycombinator.com/item?id=47132187 · 2026-02-24

> "I've been wrestling with LangGraph for similar reasons — once the happy path breaks, the graph essentially halts or loops indefinitely because the error handling is too rigid."
— omhome16, HN comment · https://news.ycombinator.com/item?id=46979781 (comment 46984074) · 2026-02-12

> "Existing agent frameworks (LangChain, AutoGPT) failed in production — brittle, looping, and unable to handle messy data. ... Traditional DAGs are deterministic; if a step fails, the program crashes."
— vincentjiang, HN comment · https://news.ycombinator.com/item?id=46979781 · 2026-02-11

> "I got frustrated with LangChain being impossible to audit (500+ transitive dependencies, 100K+ LOC), so I built picoagent — an AI agent framework with only numpy and websockets as external dependencies."
— borhensaidi, HN comment · https://news.ycombinator.com/item?id=47212067 · 2026-03-01

> "using LangChain is a pretty horrible experience because, at least for my uses and as a noob, it's much too buried in abstractions" / "it just feels like someone got high and decided to add 3 more layers of abstraction"
— phren0logy, HN comment on "LangChain Is a Black Box" · https://news.ycombinator.com/item?id=41192352 · 2024-08-08

> "Every time I click into a piece of code there are 10 more places that I have to look that MIGHT be the source of the bug."
— original post, "LangChain Is a Black Box" (42 points, 28 comments) · https://news.ycombinator.com/item?id=41192069 · 2024-08-08

> "Each agent is a .sh file containing a prompt and a launchd plist for scheduling. ... This setup eliminates the need for frameworks or orchestration layers, relying solely on shell scripts, launchd, and the claude CLI. I wanted a flexible tool that I could modify without being constrained by someone else's abstractions."
— raulriera, Show HN comment · https://news.ycombinator.com/item?id=47118300 · 2026-02-23

### n8n specifically

> "When I think of n8n I think of the n8n subreddit of people posting about how their workflow is broken and they lost all their customers and don't know how to make it work and the obvious solution is that if they had written actual software with tests, fallbacks, etc. this wouldn't have happened."
— mnky9800n, HN comment on "N8n raises $180M" · https://news.ycombinator.com/item?id=45525336 (comment 45526001) · 2025-10-09

> "Implementing parallel execution for async parts of the workflow is complicated and flaky. Pricing is expensive for the hosted version. Version control is bad. If you have engineering capacity, it's faster and simpler to write some more backend code if you already have a backend."
— photon_garden, HN comment · https://news.ycombinator.com/item?id=43879282 (comment 43881164) · 2025-05-03

> "As a former user of N8N the tool looked interesting to me but I ended up converting most of my use cases into shell scripts, python scripts executed by cron jobs, and into ci/cd jobs. It gave me more flexibility about the tech stack I need, and a greater ease of debugging and developing robust designed tools. I guess N8N was not intuitive for simple things and seemed too complicated for me."
— SansGuidon, HN comment · https://news.ycombinator.com/item?id=43879282 (comment 43885233) · 2025-05-04

> "If you're feeding untrusted inputs into an LLM (today), you have to treat the entire prompt as radioactive."
— freeqaz, HN comment responding to a report that "nearly all workflows built using N8n" the commenter had seen had some form of prompt injection vulnerability (system prompt built by directly inserting external data) · https://news.ycombinator.com/item?id=43879282 (comment 43883317) · 2025-05-03

### Trust in unattended / autonomous runs

> "I was wondering: have you thought about automation bias or automation complacency? ... if you have an agent that works quite well, the human in the loop will nearly always approve the task. The human will then learn over time that the agent 'can be trusted', and will stop reviewing the pings carefully. ... the risky tasks won't be caught by the human anymore."
— w-m, HN comment on HumanLayer launch · https://news.ycombinator.com/item?id=42247368 (comment 42248313) · 2024-11-26

> "I feel like HumanLayer is a great idea, but decision fatigue and bystander effects could pose challenges. If people are overloaded with approvals or don't feel ownership over what they're verifying, the quality of oversight might drop."
— fsndz, HN comment, same thread · https://news.ycombinator.com/item?id=42247368 (comment 42251329) · 2024-11-26

> "the results seem to be kind of erratic"
— Adam Williamson, quoted in LWN's coverage of an unsupervised AI agent that reassigned bugs, posted unhelpful comments, and got questionable code merged into Fedora's Anaconda installer (submitted to Lobsters as "AI agent runs amok in Fedora and elsewhere") · https://lobste.rs/s/wh4ug9/ai_agent_runs_amok_fedora_elsewhere (source: https://lwn.net/SubscriberLink/1077035/c7e7c14fbd60fae9/) · incident May 2026, submitted to Lobsters ~1 month before this research (fetched 2026-07-12)

> "The pull request to Anaconda is a great example of how people are easily misled when a person or AI bot sounds confident"
— lollipopman, Lobsters submitter comment · https://lobste.rs/s/wh4ug9/ai_agent_runs_amok_fedora_elsewhere · ~1 month before 2026-07-12

> "I think we all saw this one coming" ... "The LLM here didn't do anything that a tired/inexperienced dev wouldn't. ... The lack of protections from both the provider and the company is a bigger deal."
— posix_cowboy and viraptor, Lobsters comments on "An AI agent just deleted a company's entire database during routine task" (source: independent.co.uk) · https://lobste.rs/s/ontr2p/ai_agent_just_deleted_company_s_entire · ~2 months before 2026-07-12

> "You've identified a problem: the humans aren't thinking about what our process says they should think about. And your solution is to make sure they can't. A better use of automation, here, IMO, would be to use it to gather the metrics that were on the checklist, and present the gathered metrics next to the checklist items."
— hoistbypetard, Lobsters comment on "Automating the Rubber Stamp: What If an Agent Ran Your Deployment Gate?" · https://lobste.rs/s/fcg4xw/automating_rubber_stamp_what_if_agent_ran · ~8 days before 2026-07-12

---

## What people WISH existed

Inferred both from direct statements and from what pain-point-driven "Show HN" products are pitching themselves as fixing (a strong signal — people only build monitoring/guardrail tools for pain that's real and unmet):

- **A circuit breaker for agent loops/retries with a hard cost ceiling**, not a monitoring dashboard after the fact. The recurring "$2000/$500/$47/$40-60 overnight" stories are all the same shape: no state memory across retries, no cap, no alert until the bill arrives. This is the single strongest, most concretely quantified wish in the data.
- **A "did this actually run correctly" signal that doesn't require trusting the agent's own report.** Directly named: "there's no way to know what the agent did, when, or why" and "logging success while the actual outcome is wrong" — people want an external, agent-independent verification layer, not self-reported status.
- **Cron/scheduled-job monitoring that alerts on silence, not just on nonzero exit codes.** The entire premise of "Stop Guessing If Your Cron Jobs Ran" (43329966): 1990s crond behavior (email root on error) doesn't cover "job just never ran / hung / silently no-opped," which is the more common LLM-agent failure mode.
- **Agent traceability** as a first-class artifact — "prompt/context references, tool call timeline/results, key decision points, mapping edits to session events" — built in from the start, not bolted on after an incident.
- **Guardrails against automation complacency** — some mechanism that keeps human review meaningful even after an agent has built up a track record, rather than review quietly degrading into rubber-stamping (directly named in the HumanLayer thread and echoed in the Lobsters "deployment gate" story).
- **Minimal, auditable orchestration over heavyweight frameworks.** The repeated pattern — ripping LangChain/LangGraph out of production, writing 100-line replacements, choosing near-zero-dependency frameworks, building agents as plain shell scripts + cron/launchd instead of an orchestration layer — signals real appetite for "call the API directly through a thin, inspectable layer." Directly relevant to how a Mesh-based scheduled workflow agent should be built: visible routing, no framework black box, own the prompts.

---

## Sources list

**Hacker News (via Algolia API, `hn.algolia.com/api/v1`) — quoted directly above:**
1. https://news.ycombinator.com/item?id=44742710 — Show HN "AgentGuard", 2025-07-31
2. https://news.ycombinator.com/item?id=47308378 — infinite loop / $47 overnight comment, 2026-03-09
3. https://news.ycombinator.com/item?id=46911968 — budget dashboard Show HN comment, 2026-02-06
4. https://news.ycombinator.com/item?id=47096517 — "blast radius" / token velocity comment, 2026-02-21
5. https://news.ycombinator.com/item?id=47332177 — Ask HN cost forecasting thread (comment 47346646), 2026-03-12
6. https://news.ycombinator.com/item?id=45518035 — Show HN "Autocache" (n8n/Claude cost), 2025-10-08
7. https://news.ycombinator.com/item?id=43329966 — Show HN "Stop Guessing If Your Cron Jobs Ran", 2025-03-11
8. https://news.ycombinator.com/item?id=46245185 — component-level agent instrumentation comment, 2025-12-12
9. https://news.ycombinator.com/item?id=47257285 — Show HN "NodeLoom" (agent ops/monitoring), 2026-03-05
10. https://news.ycombinator.com/item?id=44592006 — "N8n vs. node-red", 2025-07-17
11. https://news.ycombinator.com/item?id=47337659 — Show HN "Sentrial", 2026-03-11
12. https://news.ycombinator.com/item?id=48003858 — Chevy Tahoe $1 comment, 2026-05-04
13. https://news.ycombinator.com/item?id=47802170 — silent state-corruption comment, 2026-04-17
14. https://news.ycombinator.com/item?id=47368649 — LLM non-determinism "silent killer" comment, 2026-03-13
15. https://news.ycombinator.com/item?id=47948959 — comment on "Five AI Agent Failures in 36 Days" (grith.ai), 2026-04-29
16. https://news.ycombinator.com/item?id=44303865 — comment on "Building Effective AI Agents" (Anthropic), 2025-06-17
17. https://news.ycombinator.com/item?id=47132187 — "Does anyone use CrewAI or LangChain anymore?" thread, 2026-02-24
18. https://news.ycombinator.com/item?id=46979781 — self-evolving agent topology thread, 2026-02-11/12
19. https://news.ycombinator.com/item?id=47212067 — picoagent / LangChain audit complaint, 2026-03-01
20. https://news.ycombinator.com/item?id=41192069 / 41192352 — "LangChain Is a Black Box", 2024-08-08
21. https://news.ycombinator.com/item?id=47118300 — launchd/cron scheduled Claude agents Show HN, 2026-02-23
22. https://news.ycombinator.com/item?id=45525336 — "N8n raises $180M" thread, 2025-10-09
23. https://news.ycombinator.com/item?id=43879282 — "N8n – Flexible AI workflow automation" launch thread, 2025-05-03/04
24. https://news.ycombinator.com/item?id=42247368 — HumanLayer launch thread ("automation complacency"), 2024-11-26/27

**Also checked, no direct criticism found (negative result, included for completeness):**
- https://news.ycombinator.com/item?id=45534012 — "N8n vs. Windmill vs. Temporal" — discussion stayed at the tool-comparison level, no substantive reliability/cost complaints surfaced in the fetched comment tree.

**Lobsters — quoted directly above:**
25. https://lobste.rs/s/wh4ug9/ai_agent_runs_amok_fedora_elsewhere — "AI agent runs amok in Fedora and elsewhere" (source: lwn.net), submitted by lollipopman, ~1 month before 2026-07-12
26. https://lobste.rs/s/ontr2p/ai_agent_just_deleted_company_s_entire — "An AI agent just deleted a company's entire database during routine task" (source: independent.co.uk), submitted by posix_cowboy, ~2 months before 2026-07-12
27. https://lobste.rs/s/fcg4xw/automating_rubber_stamp_what_if_agent_ran — "Automating the Rubber Stamp: What If an Agent Ran Your Deployment Gate?" (source: mattvanbird.co.uk), submitted by vakradrz, ~8 days before 2026-07-12
28. https://lobste.rs/s/8y6qtq/re_implementing_langchain_100_lines_code — "Re-implementing LangChain in 100 lines of code (2023)" — checked for comments criticizing LangChain complexity; thread was mild/technical rather than complaint-driven, not quoted above to avoid overstating it

**Lobsters search pages used for discovery (not quoted directly):**
`lobste.rs/search?q=AI+agent&what=stories&order=newest`, `q=n8n`, `q=autonomous+agent`, `q=LangChain`, `q=Make.com`, `q=workflow+automation`, `q=cron+LLM`, `q=CrewAI`, `q=agent+failure` — all `what=stories&order=newest`, fetched 2026-07-12.

**Searches that returned zero or near-zero on-topic results (reported honestly, not padded):**
- HN Algolia direct-phrase searches `"Zapier AI"`, `"Make.com automation"`, `"cron LLM job"`, `"LangChain overkill"`, `"agent framework overkill"`, `"autonomous agent trust unattended"`, `"n8n AI"` (as an exact multi-word phrase) returned 0 hits — Algolia's phrase matching is strict, and broader single-term or reworded queries (`n8n`, `CrewAI`, `AI agent hallucinate`, `agent infinite loop`) were needed to surface the material above.
- Lobsters: dedicated searches for n8n-specific reliability discussion, Zapier AI, Make.com AI, and CrewAI production complaints returned essentially nothing on-topic — Lobsters skews toward general systems/security/PL content and has very little coverage of no-code workflow-automation tooling specifically. The Lobsters quotes used above are about autonomous coding-agent trust failures (adjacent, not a perfect match to "scheduled workflow automation," but genuinely on-theme for "trust in unattended runs").

**Known limitations:**
- No outright HTTP failures, rate limits, or 403s were encountered on either HN Algolia or Lobsters across either research pass; ScraplingServer's `stealthy_fetch` fallback was never needed.
- CrewAI-, Zapier-, and Make.com-*branded* complaints specifically (as opposed to the general workflow/agent-framework pain that clearly also applies to them) are thin to absent in both sources. If the pivot's messaging wants to name those tools directly, this doc cannot back that with primary-source quotes naming them — would need Reddit (r/n8n, r/automation) or X/Twitter, which were out of scope here.
- Two commenter attributions in the n8n thread (43879282) are approximate: the original prompt-injection observation is paraphrased from thread context rather than pulled as an exact fetched quote, while the direct reply from freeqaz is fully verbatim and attributed.
