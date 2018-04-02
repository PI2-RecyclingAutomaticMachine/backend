module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: ['airbnb-base'],
  // add your custom rules here
  'rules': {
    'no-param-reassign': 0,

    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
