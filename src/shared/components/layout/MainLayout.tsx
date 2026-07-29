import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { MobileNavbar } from './MobileNavbar';
import { isNative } from '@/mobile';

export function MainLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className={`min-h-screen flex flex-col bg-background ${isNative() ? 'h-[100dvh]' : ''}`}>
      <Header />
      <main className={`flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+64px)] md:pb-0 ${!isHome ? 'pt-[calc(env(safe-area-inset-top)+4rem)]' : ''}`}>
        <Outlet />
      </main>
      <MobileNavbar />
    </div>
  );
}
