import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/chunk/index.js',
  output: [
    // {
    //   file: 'dist/rollup/iife.js',
    //   format: 'iife',
    // }
    {
      dir: 'dist/rollup/chunk',
      // format: "system",
      // format: 'cjs',
    }
  ],
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs({
      ignoreTryCatch: false
    }),
    babel({ babelHelpers: 'bundled' }),
  ]
};