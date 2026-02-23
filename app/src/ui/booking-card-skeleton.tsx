import { Skeleton } from './skeleton';
import { Card } from './card';

export function BookingCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50">
      <div className="divide-y divide-border">
        {/* Simulating 3 rows */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-5 py-4 items-center">
            {/* Image & Title */}
            <div className="col-span-4 flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="col-span-3 space-y-2 text-left md:text-center mt-2 md:mt-0">
              <Skeleton className="h-4 w-24 mx-auto" />
              <Skeleton className="h-3 w-32 mx-auto" />
            </div>

            {/* Amount */}
            <div className="col-span-1 hidden md:block text-center">
              <Skeleton className="h-5 w-12 mx-auto" />
            </div>

            {/* Status */}
            <div className="col-span-2 flex justify-center">
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>

            {/* Actions */}
            <div className="col-span-2 flex justify-end gap-2 mt-2 md:mt-0">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function PastBookingCardSkeleton() {
  return (
    <Card className="p-4 border border-border/50 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </Card>
  );
}
