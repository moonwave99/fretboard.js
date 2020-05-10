import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

export default [
	{
		input: 'src/main.ts',
		output: {
			name: 'fretboard',
			file: pkg.browser,
			format: 'umd',
			sourcemap: true
		},
		plugins: [
			typescript()
		]
	},
	{
		input: 'src/main.ts',
		plugins: [
			typescript()
		],
		external: [
			...Object.keys(pkg.dependencies || {}),
	    ...Object.keys(pkg.peerDependencies || {})
		],
		output: [
			{ file: pkg.main, format: 'cjs', sourcemap: true },
			{ file: pkg.module, format: 'es', sourcemap: true }
		]
	}
];
