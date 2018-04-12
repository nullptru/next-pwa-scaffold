const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const withLess = require('@zeit/next-less');
const path = require('path');

module.exports = withLess({
  cssModules: true,
  distDir: 'build',
  generateEtags: false,
  generateBuildId: async () => {
    return 'geass-blog';
  },
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    config.plugins.push(
      new SWPrecacheWebpackPlugin({
        verbose: true,
        templateFilePath: 'config/service-worker.tmpl',
        navigateFallback: '/',
        filename: 'service-worker.js',
        staticFileGlobs: [
          "static/**/*.*",
        ],
        mergeStaticsConfig: true,
        staticFileGlobsIgnorePatterns: [/^build\/dist\/.*/],
        stripPrefixMulti: {
          [path.resolve(__dirname, 'build/static')]: '_next/static',
          [path.resolve(__dirname, 'build/bundles/pages')]: '_next/geass-blog/page',
          [path.resolve(__dirname, 'build')]: '_next/geass-blog',
        },
        runtimeCaching: [
          {
            handler: 'networkFirst',
            urlPattern: /^https?.*^[\.js,\.css,\.jpg,\.png]$/
          }, {
            handler: 'cacheFirst',
            urlPattern: /\/$/
          }
        ]
      })
    )

    return config
  }
});
