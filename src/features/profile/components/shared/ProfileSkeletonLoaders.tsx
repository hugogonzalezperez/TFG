import { Card } from "../../../../ui";

export function TabSkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Skeleton for Header/Title */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="h-6 w-48 bg-muted rounded-md" />
        <div className="h-5 w-12 bg-muted rounded-full" />
      </div>

      {/* Skeletons for Cards */}
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden border-border/50">
            <div className="p-4 flex flex-col md:flex-row gap-6">
              <div className="flex items-center gap-3 w-full md:w-1/4">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
              </div>

              <div className="space-y-2 w-full md:w-1/4">
                <div className="h-8 w-full bg-muted rounded" />
                <div className="h-6 w-2/3 bg-muted rounded" />
              </div>

              <div className="space-y-2 w-full md:w-1/4">
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>

              <div className="flex flex-col gap-2 w-full md:w-1/4">
                <div className="h-6 w-full bg-muted rounded" />
                <div className="h-8 w-full bg-muted rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function GarageSkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2].map((i) => (
        <Card key={i} className="overflow-hidden border-2 border-border/50">
          <div className="bg-muted/30 p-4 border-b border-border flex items-center justify-between">
            <div className="space-y-2 w-1/3">
              <div className="h-6 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-8 w-8 bg-muted rounded" />
              <div className="h-8 w-8 bg-muted rounded" />
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((j) => (
                <div key={j} className="flex gap-4 p-4 border border-border rounded-xl">
                  <div className="w-20 h-20 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between">
                      <div className="h-5 w-24 bg-muted rounded" />
                      <div className="h-5 w-16 bg-muted rounded" />
                    </div>
                    <div className="h-6 w-20 bg-muted rounded-full" />
                    <div className="flex justify-between items-center mt-2">
                      <div className="h-5 w-16 bg-muted rounded" />
                      <div className="flex gap-2">
                        <div className="h-8 w-16 bg-muted rounded" />
                        <div className="h-8 w-8 bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
