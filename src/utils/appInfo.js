import { Platform } from 'react-native';

export const APP_INFO = {
  name: 'CineGRID',
  version: '1.0.0',
  buildNumber: '1',
  description: 'Your Personal Movie Companion',
  developer: 'Your Name',
  supportEmail: 'support@cinegrid.com',
  website: 'https://cinegrid.com',
  termsUrl: 'https://cinegrid.com/terms',
  privacyUrl: 'https://cinegrid.com/privacy',
};

export const getDeviceInfo = () => {
  return {
    platform: Platform.OS,
    version: Platform.Version,
  };
};
