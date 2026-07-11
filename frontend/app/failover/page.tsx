import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FailoverPage() {
  return (
    <section className="w-full py-16">
      <h1 className="text-5xl mb-6">Failover</h1>
      <Card className="doodle-border doodle-shadow">
        <CardHeader>
          <CardTitle>Stay covered</CardTitle>
          <CardDescription>Automatic failover when a model goes down.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Failover demo coming soon.</p>
        </CardContent>
      </Card>
    </section>
  );
}
