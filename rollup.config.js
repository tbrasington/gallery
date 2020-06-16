import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import visualizer from 'rollup-plugin-visualizer';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

export default {
	input: 'src/index.tsx',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			exports: 'named',
			sourcemap: true
		},
		{
			file: pkg.module,
			format: 'es',
			exports: 'named',
			sourcemap: true
		}
	],
	plugins: [
	
		visualizer(),
		terser(),
		peerDepsExternal(),
		resolve({
			// pass custom options to the resolve plugin
			customResolveOptions: {
				moduleDirectory: 'node_modules'
			}
		}),
		typescript({
			rollupCommonJSResolveHack: true,
			exclude: '**/__tests__/**',
			clean: true
		}),
		commonjs({
			include: [ 'node_modules/**' ],
			namedExports: {
				'node_modules/react/react.js': [ 'Children', 'Component', 'PropTypes', 'createElement' ],
				'node_modules/react-dom/index.js': [ 'render' ],

				'node_modules/debounce/index.js': [ 'debounce' ]
			}
		}),
		postcss({
			modules: true,
			extract: true
		})
	]
};
