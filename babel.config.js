module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          ie: '9'
        },
        // "modules": false,
        "useBuiltIns": "usage",
        // "useBuiltIns": "entry",
        "corejs": {
          version: '3.19',
          proposals: true
        },
        // "forceAllTransforms": true
      }
    ]
  ],
  // plugins: [
  //   "@babel/plugin-transform-runtime"
  // ]
};