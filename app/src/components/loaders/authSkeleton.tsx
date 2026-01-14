export function AuthSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-pulse">
        {/* Logo Skeleton */}
        <div className="flex justify-center mb-8">
          <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-lg ml-3 mt-2"></div>
        </div>

        {/* Inputs Skeleton */}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg border border-gray-200"></div>
            </div>
          ))}

          {/* Button Skeleton */}
          <div className="h-12 w-full bg-primary/20 rounded-lg mt-8"></div>

          {/* Social Buttons Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px w-full bg-gray-100"></div>
            <div className="h-4 w-10 bg-gray-100 rounded"></div>
            <div className="h-px w-full bg-gray-100"></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-100 rounded-lg"></div>
            <div className="h-12 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}