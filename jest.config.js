module.exports = {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
};
