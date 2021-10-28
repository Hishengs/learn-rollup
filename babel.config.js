module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["ie >= 11"]
        },
        // "modules": false,
        "useBuiltIns": "usage",
        // "useBuiltIns": "entry",
        "corejs": '3.19'
      }
    ]
  ],
  plugins: [
    "@babel/plugin-transform-runtime"
  ]
};