const klaroConfig = {
  version: 1,
  elementID: 'klaro',
  styling: {
    theme: ['light', 'bottom'],
  },
  translations: {
    en: {
      consentModal: {
        title: 'Privacy Settings',
        description:
          'Here you can decide which services you want to allow. You can change these settings at any time.',
      },
      ok: 'Accept all',
      save: 'Save settings',
    },
  },
  apps: [
    {
      name: 'google-analytics',
      title: 'Google Analytics',
      purposes: ['analytics'],
      cookies: ['_ga', '_gid'],
      required: false,
    },
  ],
};

export default klaroConfig;
