const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: __dirname + '/lib',
    filename: 'index.js',
    library: true,
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.json'],
    modulesDirectories: ['node_modules'],
    root: [
      path.resolve('.'),
    ],
  },
  module: {
    preLoaders: [
      { test: /\.ts$/, loader: 'tslint-loader' },
    ],
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.ts$/, loader: 'ts-loader' },
    ],
  },
};
