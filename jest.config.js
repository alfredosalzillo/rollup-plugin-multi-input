export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  collectCoverage: true,
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
};
