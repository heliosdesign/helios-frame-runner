import pkg from './package.json';
import babel from 'rollup-plugin-babel';

export default [
  // UMD: Universal (combination of amd, cjs, iife)
  {
    input: 'src/main.js',
    output: {
      name: 'frameRunner',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      babel({ exclude: 'node_modules/**' }),
    ]
  },

]