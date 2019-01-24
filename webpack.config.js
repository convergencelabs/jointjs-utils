const path = require('path');

module.exports = {
  mode: "production",
  context: path.resolve(__dirname, './src/ts'),
  entry: {
    app: './index.ts'
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'convergence-jointjs-utils.js',
    libraryTarget: "umd",
    library: "ConvergenceJointUtils",
    umdNamedDefine: true
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ],
  },
  plugins: [],
  externals: {
    "@convergence/convergence": "Convergence",
    "@convergence/color-assigner": "ConvergenceColorAssigner",
    "jquery": "$",
    "jointjs": "joint"
  }
};
