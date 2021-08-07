import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default (env = 'production') => {
	return {
		input: path.join(__dirname, '../elec/index.ts'),
		output: {
			file: path.join(__dirname, '../dist/elec/build.cjs'),
			format: 'cjs',
			name: 'ElectronMainBundle',
			sourcemap: true
		},
		plugins: [
			nodeResolve({ jsnext: true, preferBuiltins: true, browser: true }),
			commonjs(),
			json(),
			esbuild({
				// All options are optional
				include: /\.[jt]sx?$/, // default, inferred from `loaders` option
				exclude: /node_modules/, // default
				// watch: process.argv.includes('--watch'), // rollup 中有配置
				sourceMap: false, // default
				minify: process.env.NODE_ENV === 'production',
				target: 'esnext', // default, or 'es20XX', 'esnext'
				jsxFactory: 'React.createElement',
				jsxFragment: 'React.Fragment',
				define: {
					__VERSION__: '"x.y.z"'
				},
				loaders: {
					// Add .json files support
					// require @rollup/plugin-commonjs
					'.json': 'json',
					// Enable JSX in .js files too
					'.js': 'jsx'
				}
			}),
			alias({
				entries: [{ find: '@main', replacement: path.join(__dirname, '../src/main') }]
			})
		],
		external: [
			'crypto',
			'assert',
			'fs',
			'util',
			'os',
			'events',
			'child_process',
			'http',
			'https',
			'path',
			'electron',
			'node-pty',
			'chokidar'
		]
	}
}
