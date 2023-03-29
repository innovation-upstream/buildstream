/** @type {import('next').NextConfig} */
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  i18n,
  swcMinify: true,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config
    config.plugins.push(
      new FilterWarningsPlugin({
        exclude:
          /Critical dependency: the request of a dependency is an expression/
      })
    )
    return config
  },
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig
