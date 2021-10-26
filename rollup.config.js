import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/es.js',
      format: 'es'
    },
    {
      file: 'dist/umd.js',
      format: 'umd',
      name: 'MyBundle'
    },
    {
      file: 'dist/iife.js',
      format: 'iife',
      name: 'MyBundle'
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