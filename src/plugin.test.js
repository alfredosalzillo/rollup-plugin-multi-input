import os from 'os';
import multiInput from './plugin';

const testSrcInput = os.platform() === 'win32' ? {
  '..\\test-src\\input1': 'test-src/input1.js',
  '..\\test-src\\input2': 'test-src/input2.js',
} : {
  '../test-src/input1': 'test-src/input1.js',
  '../test-src/input2': 'test-src/input2.js',
};


describe('rollup-plugin-multi-input', () => {
  it('should resolve glob', () => {
    const plugin = multiInput();
    const { input } = plugin.options({
      input: ['test-src/**/*.js'],
    });
    expect(input).toEqual(testSrcInput);
  });
  it('should remove unresolved glob', () => {
    const plugin = multiInput();
    const { input } = plugin.options({
      input: ['test-src/**/*.js', '/not-found/file.js'],
    });
    expect(input).toEqual(testSrcInput);
  });
  it('should preserve no string entries', () => {
    const plugin = multiInput();
    const { input } = plugin.options({
      input: ['test-src/**/*.js', '/not-found/file.js', {
        test: 'path/to/test.js',
      }],
    });
    expect(input).toEqual({
      ...testSrcInput,
      test: 'path/to/test.js',
    });
  });
});
