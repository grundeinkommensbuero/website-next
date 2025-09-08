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
    de: {
      consentModal: {
        title: 'Cookies & Dienste',
        description: 'Wir nutzen Cookies, um unsere Website zu verbessern.',
      },
      consentNotice: {
        description:
          'Wir verwenden Cookies, um Inhalte zu personalisieren und die Zugriffe auf unsere Website zu analysieren.',
        learnMore: 'Mehr erfahren',
      },
      ok: 'Alles klar',
      decline: 'Ablehnen',
      save: 'Speichern',
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
