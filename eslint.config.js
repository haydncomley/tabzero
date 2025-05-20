import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
	{
		ignores: ['node_modules', 'dist', 'dist-electron', 'vite.config.ts'],
	},
	// Base configuration for all files
	{
		files: ['src/**/*.{js,jsx,ts,tsx}', 'electron/**/*.{ts}'],
		plugins: {
			import: importPlugin,
			'jsx-a11y': jsxA11yPlugin,
			prettier: prettierPlugin,
			react: reactPlugin,
			'react-hooks': reactHooksPlugin,
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			'prettier/prettier': 'error',
			// Indentation and Formatting
			'no-mixed-spaces-and-tabs': 'error',
			'object-curly-spacing': ['error', 'always'],
			'array-bracket-spacing': ['error', 'never'],
			'import/newline-after-import': ['error', { count: 1 }],

			// Imports
			'import/order': [
				'error',
				{
					groups: [
						['builtin', 'external'],
						'internal',
						['parent', 'sibling', 'index'],
					],
					pathGroups: [
						{
							pattern: '~/**',
							group: 'internal',
						},
					],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],

			// Functions
			'func-style': ['error', 'expression'],
			'arrow-body-style': ['error', 'as-needed'],

			// React Hooks
			'react-hooks/exhaustive-deps': 'off',

			// Strings
			quotes: ['error', 'single', { avoidEscape: true }],
			'jsx-quotes': ['error', 'prefer-double'],

			// Accessibility
			'jsx-a11y/no-static-element-interactions': 'off',
			'jsx-a11y/no-noninteractive-tabindex': 'off',
			'jsx-a11y/no-noninteractive-element-interactions': 'off',
			'jsx-a11y/click-events-have-key-events': 'off',
		},
	},
	// TypeScript-specific configuration
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
		},
		settings: {
			'import/resolver': {
				typescript: {
					project: './tsconfig.json',
				},
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx'],
				},
			},
		},
		rules: {
			// TypeScript
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
				},
			],
		},
	},
];
