module.exports = {
	extends: 'standard',
	rules: {
		semi: ['error', 'always'],
		'space-before-function-paren': ['error', 'never']
	},
    parserOptions: {
        ecmaVersion: 6,
        ecmaFeatures: {
            jsx: true
        }
    },
};
