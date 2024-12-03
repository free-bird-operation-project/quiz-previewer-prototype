import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginJest from 'eslint-plugin-jest';

export default [
	{
		files: ['**/*.test.js'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.jest
			}
		},
		plugins: {
			jest: pluginJest
		},
		rules: {
			...pluginJs.configs.recommended.rules,
			...pluginJest.configs.recommended.rules
		}
	}
];
