// import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';

export default {
	input: 'src/index.js',

	output: {
		file: 'dist/index.js',
		format: 'esm'
	},

	plugins: [
		resolve(),
		// del({ targets: 'dist/*' }),
		copy({
			targets: [
				{ src: 'src/index.html', dest: 'dist' },
				{ src: 'src/main.css', dest: 'dist' },
				{ src: 'src/assets', dest: 'dist' }
			]
		})
	]
};
