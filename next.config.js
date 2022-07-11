/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['de'],
    defaultLocale: 'de',
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      'next.expedition-grundeinkommen.de',
      'next.volksentscheid-grundeinkommen.de',
    ],
  },
  sassOptions: {
    prependData: `@import "./styles/vars.scss";`,
  },
  webpack(config) {
    // config.module.noParse = /(gun|scrypt)\.js$/;
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
