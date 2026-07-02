import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.directdayzapp.mobile',
  appName: 'DirectDayzapp',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
  server: {
    // Use bundled web assets (points to your Render API via VITE_API_URL at build time)
    androidScheme: 'https',
  },
};

export default config;
