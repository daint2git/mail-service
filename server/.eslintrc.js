module.exports = {
  root: true,
  extends: [
    '@daint2-configs/eslint-config/base',
    '@daint2-configs/eslint-config/typescript',
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-console': 'off',
  },
};
