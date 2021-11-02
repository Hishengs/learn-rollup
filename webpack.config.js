const path = require("path");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "./src/chunk/index.js"),
  output: {
    clean: true,
    filename: 'bundle.js',
    path: path.join(__dirname, "./dist/webpack"),
    // library: {
    //   // name: 'MyLibrary',
    //   type: 'commonjs2',
    //   export: 'default'
    // },
    iife: false,
    // library: 'MyBundle',
    // crossOriginLoading: 'anonymous',
    chunkFilename: '[id].[chunkhash:8].js',
  },
  /* module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  }, */
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
