module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'plugin:storybook/recommended'
  ],
  ignorePatterns: ['vite.config.ts'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json'
  },
  plugins: ['react'],
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'max-len': [
      'warn',
      {
        code: 120,
        ignoreStrings: true,
        ignorePattern: '^\\s*var\\s.+=\\s*require\\s*\\(',
        ignoreUrls: true
      }
    ],
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
