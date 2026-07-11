import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function WeatherStationSkeleton() {
  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-6">
      <Skeleton className="h-14 w-full rounded-2xl" />
      <div className="grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-h-0 lg:col-span-2">
          <Skeleton
            className="h-full w-full rounded-2xl lg:min-h-0"
            style={{ minHeight: "55svh" }}
          />
        </div>
        <div className="flex min-h-0 flex-col gap-6">
          <Card className="flex-1" plain>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </CardContent>
          </Card>
          <Card className="flex-1" plain>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
