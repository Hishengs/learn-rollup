// const path = require("path");
// // const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// module.exports = {
//   mode: "production",
//   entry: path.join(__dirname, "./src/tree-shaking/index.js"),
//   output: {
//     clean: true,
//     filename: 'bundle.js',
//     path: path.join(__dirname, "./dist/webpack"),
//     // library: {
//     //   // name: 'MyLibrary',
//     //   type: 'commonjs2',
//     //   export: 'default'
//     // },
//     // iife: false,
//     // library: 'MyBundle',
//     // crossOriginLoading: 'anonymous',
//     // chunkFilename: '[id].[chunkhash:8].js',
//   },
//   /* module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//         },
//       },
//     ],
//   }, */
//   /* plugins: [
//     new BundleAnalyzerPlugin({
//       reportFilename: path.join(outputDir, name.replace("js", "html")),
//       analyzerMode: "static",
//       openAnalyzer: falsse,
//     }),
//   ], */
//   optimization: {
//     // usedExports: true,
//     minimize: false,
//   },
// };

const path = require('path');

module.exports = {
  entry: './src/tree-shaking/index2.js',
  output: {
    clean: true,
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist/webpack'),
  },
  // devtool: 'inline-source-map',
  // mode: 'development',
  mode: 'production',
  optimization: {
    // usedExports: true,
  },
};