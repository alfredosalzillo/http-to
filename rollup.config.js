import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy-glob';
import importCss from '@atomico/rollup-plugin-import-css';


export default ({ watch }) => ({
  input: 'src/main.js',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    !watch && copy([
      { files: 'static/*.{html,css}', dest: 'dist' },
    ]),
    // eslint(),
    babel({
      externalHelpers: false,
      runtimeHelpers: true,
    }),
    commonjs(),
    resolve(),
    importCss(),
    watch && serve({
      contentBase: ['./dist', './static'],
    }),
    watch && livereload(),
  ],
});
