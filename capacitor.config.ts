import type { CapacitorConfig } from '@capacitor/cli';

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
      style: 'dark',
    },
  },
};

export default config;
