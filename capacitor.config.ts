import type { CapacitorConfig } from '@capacitor/cli';

const LIVE_RELOAD = process.env.CAP_LIVE === '1';
const LIVE_PORT = process.env.VITE_PORT ?? '3000';

// In live reload mode, emulator reaches WSL's Vite dev server via 10.0.2.2
// Run: CAP_LIVE=1 npx cap sync android && npm run dev -- --host
const liveServer = LIVE_RELOAD
  ? { url: `http://10.0.2.2:${LIVE_PORT}`, cleartext: true }
  : undefined;

const config: CapacitorConfig = {
  appId: 'com.parky.app',
  appName: 'Parky',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#000000',
    },
    StatusBar: {
      style: 'LIGHT',
      overlaysWebView: true,   // hero extends behind status bar, env(safe-area-inset-top) live
    },
  },
  server: liveServer,
};

export default config;
