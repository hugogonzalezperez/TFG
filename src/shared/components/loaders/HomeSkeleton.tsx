export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Header Skeleton */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-primary/20 p-2 rounded-xl h-10 w-10"></div>
              <div className="ml-2 h-6 w-20 bg-muted rounded"></div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <div className="h-4 w-32 bg-muted rounded"></div>
              <div className="h-4 w-28 bg-muted rounded"></div>
              <div className="h-4 w-24 bg-muted rounded"></div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="h-8 w-32 bg-muted rounded-full"></div>
              <div className="h-10 w-24 bg-destructive/10 rounded-lg"></div>
            </div>

            <div className="md:hidden h-8 w-8 bg-muted rounded"></div>
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden bg-background">
        {/* Decorative Background Blobs (Static duplicates from HomePage for consistency) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[45%] bg-secondary/5 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-[url('https://parallel.report/assets/grid.svg')] bg-center opacity-5"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-16 space-y-6">
            <div className="h-16 w-3/4 mx-auto bg-muted rounded-2xl"></div>
            <div className="h-16 w-2/3 mx-auto bg-muted rounded-2xl"></div>
            <div className="h-8 w-1/2 mx-auto bg-muted/60 rounded-xl mt-4"></div>
          </div>

          {/* Search Card Skeleton */}
          <div className="max-w-5xl mx-auto p-2 lg:p-2 bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50">
            <div className="p-6 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 w-20 bg-muted rounded"></div>
                    <div className="h-12 w-full bg-muted/40 rounded-lg"></div>
                  </div>
                ))}
              </div>
              <div className="h-16 w-full bg-accent/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Locations Skeleton */}
      <div className="relative bg-muted/20 border-y border-border/50 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="h-10 w-80 mx-auto bg-muted rounded-xl mb-12"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-6 bg-card rounded-2xl border border-border/50 space-y-4 shadow-sm">
                <div className="h-8 w-8 bg-primary/10 rounded-lg"></div>
                <div className="h-5 w-24 bg-muted rounded"></div>
                <div className="h-4 w-16 bg-muted/60 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section Skeleton */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 mx-auto bg-muted rounded-xl mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-card rounded-2xl border border-border/50 space-y-5 text-center shadow-sm">
                <div className="h-16 w-16 mx-auto bg-primary/10 rounded-2xl"></div>
                <div className="h-6 w-40 mx-auto bg-muted rounded-lg"></div>
                <div className="h-4 w-full bg-muted/60 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section Skeleton */}
      <div className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="h-12 w-3/4 mx-auto bg-white/10 rounded-xl"></div>
          <div className="h-6 w-1/2 mx-auto bg-white/10 rounded-lg"></div>
          <div className="h-14 w-60 mx-auto bg-white/20 rounded-xl mt-8"></div>
        </div>
      </div>
    </div>
  );
}