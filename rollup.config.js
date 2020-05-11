import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

export default [
	{
		input: 'src/index.ts',
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
		input: 'src/index.ts',
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
