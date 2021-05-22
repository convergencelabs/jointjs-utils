// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import license from "rollup-plugin-license";
import {terser} from "rollup-plugin-terser";
import path from "path";

import pkg from './package.json';

//
// Commons Settings
//
const input = 'src/ts/index.ts';

const plugins = [
  resolve(),
  commonjs(),
  typescript(),
  license({
    banner: {
      commentStyle: 'ignored', // The default
      content: {
        file: path.join(__dirname, 'copyright-header.txt'),
      },
    }
  })
];

const moduleName = "ConvergenceJointUtils";
const format = "umd";

const external = [
  "@convergence/convergence",
  "@convergence/color-assigner",
  "jquery",
  "jointjs"
]

const globals = {
  "@convergence/convergence": "Convergence",
  "@convergence/color-assigner": "ConvergenceColorAssigner",
  "jquery": "$",
  "jointjs": "joint"
}

export default [{
  input,
  plugins,
  external,
  output: [
    {
      name: moduleName,
      file: pkg.browser,
      format,
      sourcemap: true,
      globals
    }
  ]
}, {
  input,
  plugins: [...plugins, terser()],
  external,
  output: [
    {
      name: moduleName,
      file: `${path.dirname(pkg.browser)}/${path.basename(pkg.browser, ".js")}.min.js`,
      format,
      sourcemap: true,
      globals
    }
  ]
}];