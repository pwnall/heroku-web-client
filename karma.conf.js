// Karma configuration
var webpackConfig = require('./webpack.config');

module.exports = function(config) {
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
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    browserNoActivityTimeout: 120 * 1000,  // Our tests can take a long time.
    captureTimeout: 120 * 1000,
    singleRun: false,
    concurrency: Infinity,
    transports: ['websocket', 'polling'],
  });
};
