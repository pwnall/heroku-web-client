// Karma configuration
const webpackConfig = require('./webpack.config');

module.exports = (config) => {
  config.set({
    basePath: '',
    client: {
      mocha: {
        timeout: 60 * 1000,  // 60 seconds, because of network API calls
      },
    },
    frameworks: ['mocha', 'chai'],
    files: [
      'test/**/*_test.ts'
    ],
    exclude: [
    ],
    mime: {
      'text/x-typescript': ['ts'],
    },
    preprocessors: {
      'test/**/*.ts': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: 'cheap-module-source-map',
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
    },
    webpackMiddleware: {
      noInfo: true,
      stats: {
        colors: true,
      },
    },

    reporters: ['progress'],
    port: 9876,
    autoWatch: true,
    browsers: ['Chrome'],
    browserDisconnectTimeout: 30 * 1000,
    browserDisconnectTolerance: 10,
    browserNoActivityTimeout: 120 * 1000,  // Our tests can take a long time.
    captureTimeout: 120 * 1000,
    singleRun: false,
    concurrency: Infinity,
    transports: ['websocket', 'polling'],
  });
};
