import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
  // UMD build for browser <script> tags
  {
    input: 'src/index.js',
    output: {
      file: 'dist/scorm-wrapper.umd.js',
      format: 'umd',
      name: 'ScormWrapper',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      resolve(),
      production && terser()
    ]
  },
  
  // ESM build for modern bundlers
  {
    input: 'src/index.js',
    output: {
      file: 'dist/scorm-wrapper.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve(),
      production && terser()
    ]
  },
  
  // CommonJS build for Node.js
  {
    input: 'src/index.js',
    output: {
      file: 'dist/scorm-wrapper.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      resolve(),
      production && terser()
    ]
  }
];

