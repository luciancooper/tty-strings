const base = require('@lcooper/eslint-config-typescript'),
    jest = require('@lcooper/eslint-config-jest');

module.exports = [
    { ignores: ['lib/**', 'coverage/**'] },
    ...base,
    {
        languageOptions: {
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
        settings: {
            'import/resolver': {
                typescript: {
                    project: 'tsconfig.json',
                },
            },
        },
    },
    jest,
];