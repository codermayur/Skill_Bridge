// Root package.json is "type": "commonjs" so this must use CJS syntax
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // new feature
        'fix',      // bug fix
        'docs',     // documentation
        'style',    // formatting, no logic change
        'refactor', // code refactor
        'test',     // adding tests
        'chore',    // build process, tooling
        'perf',     // performance improvement
        'ci',       // CI/CD changes
        'revert',   // revert a commit
      ],
    ],
    'subject-max-length': [2, 'always', 100],
  },
};
