import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <section className="w-full py-16">
      <h1 className="text-5xl mb-6">Dashboard</h1>
      <Card className="doodle-border doodle-shadow">
        <CardHeader>
          <CardTitle>Usage overview</CardTitle>
          <CardDescription>Requests, spend, and coverage at a glance.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Dashboard content coming soon.</p>
        </CardContent>
      </Card>
    </section>
  );
}
