// import commonjs from '@rollup/plugin-commonjs';
// import { nodeResolve } from '@rollup/plugin-node-resolve';
// import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/circular-reference/index.js',
  output: [
    {
      file: 'dist/rollup/bundle.js',
      format: 'esm',
    }
    // {
    //   dir: 'dist/rollup/chunk',
    //   // format: "system",
    //   // format: 'cjs',
    //   format: 'amd'
    // }
  ],
  plugins: [
    // nodeResolve({
    //   browser: true
    // }),
    // commonjs({
    //   ignoreTryCatch: false
    // }),
    // babel({ babelHelpers: 'bundled' }),
  ]
};