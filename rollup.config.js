import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'esm',
  },
  plugins: [
    eslint(),
    commonjs(),
    resolve(),
    // babel({
    //   externalHelpers: false,
    //   runtimeHelpers: true,
    // }),
    serve({
      contentBase: ['./dist', './static'],
    }),
    livereload(),
  ],
};
