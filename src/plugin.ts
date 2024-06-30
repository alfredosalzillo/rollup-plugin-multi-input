import fastGlob from 'fast-glob';
import path from 'path';
import type { Plugin } from 'rollup';
import type FastGlob from 'fast-glob';

const pluginName = '@ayan4m1/rollup-plugin-multi-input';

const isString = (value: any): value is string => typeof value === 'string';

/**
 * default multi-input Options
 * */
const defaultOptions = {
  // `path.sep` is used for windows support
  relative: `src${path.sep}`,
};

// extract the output file name from a file name

const outputFileName = (filePath: string) =>
  filePath.replace(/\.[^/.]+$/, '').replace(/\\/g, '/');

export type MultiInputOptions = {
  glob?: FastGlob.Options;
  relative?: string;
  transformOutputPath?: (path: string, fileName: string) => string;
};

/**
 *  multiInput is a rollup plugin to use multiple entry point and preserve the directory
 *  structure in the dist folder
 * */
const multiInput = (options: MultiInputOptions = defaultOptions): Plugin => {
  const {
    glob: globOptions,
    relative = defaultOptions.relative,
    transformOutputPath,
  } = options;
  return {
    name: pluginName,
    options(conf) {
      // flat to enable input to be a string or an array
      const inputs = [conf.input].flat();
      // separate globs inputs string from others to enable input to be a mixed array too
      const globs = inputs.filter(isString);
      const others = inputs.filter((value) => !isString(value));
      const normalizedGlobs = globs.map((glob) => glob.replace(/\\/g, '/'));
      // get files from the globs strings and return as a Rollup entries Object
      const entries = fastGlob
        .sync(normalizedGlobs, globOptions)
        .map((name) => {
          const filePath = path.relative(relative, name);
          const isRelative = !filePath.startsWith(`..${path.sep}`);
          const relativeFilePath = isRelative
            ? filePath
            : path.relative(`.${path.sep}`, name);
          if (transformOutputPath) {
            return [
              outputFileName(transformOutputPath(relativeFilePath, name)),
              name,
            ];
          }
          return [outputFileName(relativeFilePath), name];
        });
      const input = Object.assign(
        {},
        Object.fromEntries(entries),
        // add no globs input to the result
        ...others,
      );
      // return the new configuration with the glob input and the non string inputs
      return {
        ...conf,
        input,
      };
    },
  };
};
export default multiInput;
