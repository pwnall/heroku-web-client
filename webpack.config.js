const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    library: 'heroku-web-client',
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
  resolve: {
    modules: [
      __dirname,
      "node_modules",
    ],
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'tslint-loader',
          options: {},
        },
        enforce: 'pre',
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.tar\.gz$/,
        use: 'arraybuffer-loader',
      },
    ],
  },
};
