import { Skeleton } from './skeleton';
import { Card } from './card';

export function GarageCardSkeleton() {
  return (
    <Card className="w-full p-4 border-2 border-transparent">
      <div className="flex gap-4">
        {/* Image Shimmer */}
        <Skeleton className="w-24 h-24 sm:w-36 sm:h-36 rounded-xl shrink-0" />

        <div className="flex-1 space-y-3 py-1">
          {/* Title */}
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-16 hidden sm:block" />
          </div>

          {/* Address */}
          <Skeleton className="h-4 w-1/2" />

          {/* Rating & Stats */}
          <div className="flex gap-3">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Price & Button */}
          <div className="flex justify-between items-end pt-2">
            <div className="space-y-1">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-9 w-24 sm:h-10 rounded-lg" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function GarageCardCompactSkeleton() {
  return (
    <div className="p-4 border-l-4 border-transparent space-y-3">
      <div className="flex gap-3">
        <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}
