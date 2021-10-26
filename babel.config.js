module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["defaults", "ie >= 9"]
        },
        useBuiltIns: "usage",
        corejs: 3
      }
    ]
  ]
};