import { StorySplit } from "@/components/landing/story-split";

export function FailoverExplainer() {
  return (
    <StorySplit
      kicker="survive the outage"
      title="mid-session failover"
      band="bg-card"
      panelTone="cell-paper"
      art={{
        src: "/brand/color/failover-storm.svg",
        alt: "A grumpy storm cloud rains on a big coral umbrella while three happy robots stay dry underneath",
      }}
      artCover
      cta={{ href: "/failover", label: "See failover in action" }}
    >
      <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
        A provider goes down mid-conversation. Brolly notices before your
        user does, hot-swaps to a healthy model, and carries the whole
        context across — the session keeps flowing like nothing happened.
      </p>
      <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
        One provider having a bad day stops being your incident.
      </p>
    </StorySplit>
  );
}
