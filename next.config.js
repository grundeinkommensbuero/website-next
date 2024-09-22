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
      'directus.expedition-grundeinkommen.de',
      'directus.volksentscheid-grundeinkommen.de',
    ],
  },
  sassOptions: {
    prependData: `@import "./styles/vars.scss";`,
  },
  async rewrites() {
    return [
      {
        source: '/api/logUrlParams', // Deine verkürzte API-Route
        destination: 'https://your-site-name.netlify.app/.netlify/functions/logUrlParams', // Tatsächliche URL der Netlify-Funktion
      },
    ];
  },
  webpack(config) {
    // config.module.noParse = /(gun|scrypt)\.js$/;
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            ext: 'tsx',
            replaceAttrValues: {
              // This way for all fill="black" attibutes the "black" will be
              // replaced with the "color" prop we set, for the imported SVG
              '#000': '{props.color}',
            },
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
