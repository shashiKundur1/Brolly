import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <section className="w-full py-16">
      <h1 className="text-5xl mb-6">Brolly ☂️</h1>
      <Card className="doodle-border doodle-shadow">
        <CardHeader>
          <CardTitle>Model Insurance for your LLM apps</CardTitle>
          <CardDescription>
            Usage dashboard, cost cascade, and failover demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Point your LLM traffic here and never get caught without a policy.</p>
        </CardContent>
      </Card>
    </section>
  );
}
