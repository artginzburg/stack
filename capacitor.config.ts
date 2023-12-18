import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.artginzburg.stack',
  appName: 'stack',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
