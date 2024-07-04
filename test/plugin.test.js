import { rollup as rollup4 } from 'rollup';
import { rollup as rollup3 } from 'rollup3';
import { rollup as rollup2 } from 'rollup2';
import importJson from '@rollup/plugin-json';
import path from 'path';
import multiInput from '../src/plugin';

const expectedOutput = ['fixtures/input1.js', 'fixtures/input2.js'].sort();

const externalDependencies = ['fast-glob', 'path'];

describe.each([
  ['rollup 2', rollup2],
  ['rollup 3', rollup3],
  ['rollup 4', rollup4],
])('rollup-plugin-multi-input using %s', (_, rollup) => {
  const generateBundle = (options) =>
    rollup(options).then((bundle) =>
      bundle.generate({
        format: 'cjs',
      }),
    );

  const generateOutputFileNames = (options) =>
    generateBundle(options).then(({ output }) =>
      output.map((module) => module.fileName).sort(),
    );

  it('should have name @ayan4m1/rollup-plugin-multi-input', async () => {
    const plugin = multiInput({ relative: './test' });
    expect('name' in plugin).toBeTruthy();
    expect(plugin.name).toBe('@ayan4m1/rollup-plugin-multi-input');
  });
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
      input: [
        'test/fixtures/**/*.js',
        {
          test: 'path/to/test.js',
        },
      ],
      plugins: [multiInput({ relative: './test' })],
    });
    await expect(bundle).rejects.toThrow(/^Could not resolve entry module/);
  });
  it('should resolve relative to "src" as default', async () => {
    const outputFilesWithNoOptions = await generateOutputFileNames({
      input: ['test/fixtures/**/*.js'],
      plugins: [multiInput(), importJson()],
      external: externalDependencies,
    });
    const outputFilesWithNoRelativeOption = await generateOutputFileNames({
      input: ['./test/fixtures/**/*.js'],
      plugins: [multiInput({}), importJson()],
      external: externalDependencies,
    });
    expect(outputFilesWithNoOptions).toEqual([
      'test/fixtures/input1.js',
      'test/fixtures/input2.js',
    ]);
    expect(outputFilesWithNoRelativeOption).toEqual([
      'test/fixtures/input1.js',
      'test/fixtures/input2.js',
    ]);
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
      plugins: [
        multiInput({
          transformOutputPath: (output) => `dest/${path.basename(output)}`,
        }),
      ],
      external: ['fast-glob', 'path'],
    });
    expect(outputFiles).toEqual(['dest/input1.js', 'dest/input2.js']);
  });
});
