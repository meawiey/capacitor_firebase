import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'automatic.blood.collection.system',
  appName: 'test_capacitor',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["phone"],
    },
  },
};

export default config;
