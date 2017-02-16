const path = require('path');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
  context: path.resolve(__dirname, './src/ts'),
  entry: {
    app: './index.ts'
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'convergence-jointjs-utils.js',
    libraryTarget: "umd",
    library: "ConvergenceJointUtils"
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: [
    new CheckerPlugin()
  ],
  externals: {
    "@convergence/convergence": "Convergence",
    "@convergence/color-assigner": "ColorAssigner",
    "jquery": "$",
  }
};
