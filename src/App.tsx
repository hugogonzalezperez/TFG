import { Outlet } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from 'sonner';
import { useEffect, Suspense } from 'react';
import { FilterProvider } from './features/parking';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './features/auth';
import { AnimatedLoader } from './shared/components/loaders';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { isNative, hideSplash } from '@/mobile';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function AppContent() {
  const { initialized } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (initialized) {
      hideSplash();
    }
  }, [initialized]);

  if (!initialized) {
    return <AnimatedLoader message="Iniciando aplicación..." />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<AnimatedLoader message="Cargando..." />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" richColors closeButton />
      {!isNative() && <Analytics />}
      {!isNative() && <SpeedInsights />}
      <AuthProvider>
        <FilterProvider>
          <AppContent />
        </FilterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}