export default {
  coverageDirectory: './coverage/',
  collectCoverage: true,
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
};
