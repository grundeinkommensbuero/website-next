/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['de'],
    defaultLocale: 'de',
  },
  images: {
    domains: ['xbge-directus.frac.tools'],
  },
};

module.exports = nextConfig;
