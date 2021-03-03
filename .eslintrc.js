/*
 * @Description: file content
 * @Author: zhou min
 * @Date: 2021-02-15 13:45:29
 * @LastEditors: mintZ
 * @LastEditTime: 2021-03-03 10:55:50
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'linebreak-style': 'off',
    'array-callback-return': 'off',
    'no-param-reassign': 'off',
    'prefer-destructuring': ['error', {
      object: true,
      array: false,
    }],
    'no-plusplus': 'off',
    radix: ['error', 'as-needed'],
    'no-useless-escape': 'off',
    'no-underscore-dangle': 'off',
    'max-len': 'off',
    'prefer-const': 'off',
    'no-restricted-syntax': 'off',
    'no-unused-expressions': 'off',
    'global-require': 'off',
    'no-unused-vars': 'off',
    'consistent-return': 'off',
    'no-useless-return': 'off',
    'vue/no-unused-vars': 'off',
  },
};
