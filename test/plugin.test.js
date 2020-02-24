import { rollup } from 'rollup';
import importJson from '@rollup/plugin-json';
import multiInput from '../src/plugin';
import path from 'path';

const expectedOutput = [
  'fixtures/input1.js',
  'fixtures/input2.js',
].sort();

const generateBundle = (options) => rollup(options)
  .then((bundle) => bundle.generate({
    format: 'cjs',
  }));

const generateOutputFileNames = (options) => generateBundle(options)
  .then(({ output }) => output.map((module) => module.fileName).sort());

describe('rollup-plugin-multi-input', () => {
  it('should resolve glob', async () => {
    const outputFiles = await generateOutputFileNames({
      input: ['test/fixtures/**/*.js'],
      plugins: [multiInput({ relative: './test' })],
    });
    expect(outputFiles).toEqual(expectedOutput);
  });
  it('should accept a simple string as input', async () => {
    const outputFiles = await generateOutputFileNames({
      input: 'test/fixtures/**/*.js',
      plugins: [multiInput({ relative: './test' })],
    });
    expect(outputFiles).toEqual(expectedOutput);
  });
  it('should accept an array of strings as input', async () => {
    const outputFiles = await generateOutputFileNames({
      input: ['test/fixtures/**/*.js'],
      plugins: [multiInput({ relative: './test' })],
    });
    expect(outputFiles).toEqual(expectedOutput);
  });
  it('should remove unresolved glob', async () => {
    const outputFiles = await generateOutputFileNames({
      input: ['test/fixtures/**/*.js', '/not-found/file.js'],
      plugins: [multiInput({ relative: './test' })],
    });
    expect(outputFiles).toEqual(expectedOutput);
  });
  it('should preserve no string entries', async () => {
    const bundle = generateBundle({
      input: ['test/fixtures/**/*.js', {
        test: 'path/to/test.js',
      }],
      plugins: [multiInput({ relative: './test' })],
    });
    await expect(bundle).rejects.toThrow('Could not resolve entry module (path/to/test.js).');
  });
  it('should resolve relative to "src" as default', async () => {
    const outputFilesWithNoOptions = await generateOutputFileNames({
      input: ['src/**/*.js'],
      plugins: [multiInput(), importJson()],
      external: ['fast-glob', 'path'],
    });
    const outputFilesWithNoRelativeOption = await generateOutputFileNames({
      input: ['src/**/*.js'],
      plugins: [multiInput({}), importJson()],
      external: ['fast-glob', 'path'],
    });
    expect(outputFilesWithNoOptions).toEqual(['plugin.js']);
    expect(outputFilesWithNoRelativeOption).toEqual(['plugin.js']);
  });
  it('should resolve non relative to "relative" options path to root', async () => {
    const outputFiles = await generateOutputFileNames({
      input: ['test/fixtures/**/*.js'],
      plugins: [multiInput(), importJson()],
      external: ['fast-glob', 'path'],
    });
    expect(outputFiles).toEqual([
      'test/fixtures/input1.js',
      'test/fixtures/input2.js',
    ]);
  });
  it('should resolve output to "dist" directory', async () => {
    const outputFiles = await generateOutputFileNames({
      input: ['test/fixtures/**/*.js'],
      plugins: [multiInput({
        transformOutputPath: (output, input) => `dest/${path.basename(output)}`
      })],
      external: ['fast-glob', 'path'],
    });
    expect(outputFiles).toEqual([
      'dest/input1.js',
      'dest/input2.js',
    ]);
  });
});
