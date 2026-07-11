import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CascadePage() {
  return (
    <section className="w-full py-16">
      <h1 className="text-5xl mb-6">Cost Cascade</h1>
      <Card className="doodle-border doodle-shadow">
        <CardHeader>
          <CardTitle>Where your spend flows</CardTitle>
          <CardDescription>Trace cost across models and providers.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Cascade visualization coming soon.</p>
        </CardContent>
      </Card>
    </section>
  );
}
