/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['de'],
    defaultLocale: 'de',
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ['xbge-directus.frac.tools'],
  },
  sassOptions: {
    prependData: `@import "./styles/vars.scss";`,
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      rule => rule.test && rule.test.test('.svg')
    );
    fileLoaderRule.exclude = /\.svg$/;
    config.module.rules.push({
      test: /\.svg$/,
      loader: require.resolve('@svgr/webpack'),
    });
    return config;
  },
};

module.exports = nextConfig;
