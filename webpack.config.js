const path = require("path");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "./src/index.js"),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, "./dist/webpack"),
    iife: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  /* plugins: [
    new BundleAnalyzerPlugin({
      reportFilename: path.join(outputDir, name.replace("js", "html")),
      analyzerMode: "static",
      openAnalyzer: falsse,
    }),
  ], */
  optimization: {
    minimize: false,
  },
};
