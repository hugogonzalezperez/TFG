export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Header Skeleton */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Skeleton */}
            <div className="flex items-center">
              <div className="bg-gray-200 p-2 rounded-xl h-10 w-10"></div>
              <div className="ml-2 h-8 w-24 bg-gray-200 rounded"></div>
            </div>

            {/* Desktop Navigation Skeleton */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-36 bg-gray-200 rounded"></div>
            </div>

            {/* User Menu Skeleton */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
            </div>

            {/* Mobile menu button skeleton */}
            <div className="md:hidden h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <div className="relative bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Title Skeleton */}
          <div className="text-center mb-12 space-y-4">
            <div className="h-12 w-3/4 mx-auto bg-gray-200 rounded"></div>
            <div className="h-12 w-2/3 mx-auto bg-gray-200 rounded"></div>
            <div className="h-6 w-1/2 mx-auto bg-gray-200 rounded mt-4"></div>
          </div>

          {/* Search Card Skeleton */}
          <div className="max-w-4xl mx-auto p-6 lg:p-8 bg-card rounded-2xl shadow-2xl border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-12 w-full bg-gray-100 rounded-lg border border-gray-200"></div>
                </div>
              ))}
            </div>
            <div className="h-14 w-full bg-gray-200 rounded-lg mt-4"></div>
          </div>
        </div>
      </div>

      {/* Popular Locations Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-9 w-64 mx-auto bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 bg-card rounded-xl border border-border space-y-3">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section Skeleton */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-9 w-80 mx-auto bg-gray-200 rounded mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-card rounded-xl border border-border space-y-4">
                <div className="h-16 w-16 mx-auto bg-gray-200 rounded-2xl"></div>
                <div className="h-6 w-40 mx-auto bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-100 rounded"></div>
                <div className="h-4 w-3/4 mx-auto bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section Skeleton */}
      <div className="bg-primary/90 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="h-10 w-2/3 mx-auto bg-white/20 rounded"></div>
          <div className="h-6 w-1/2 mx-auto bg-white/20 rounded"></div>
          <div className="h-14 w-64 mx-auto bg-white/30 rounded-lg mt-8"></div>
        </div>
      </div>
    </div>
  );
}