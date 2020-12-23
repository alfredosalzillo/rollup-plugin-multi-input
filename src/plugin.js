import * as fastGlob from 'fast-glob';
import path from 'path';
import isString from 'lodash/isString';
import partition from 'lodash/partition';
import { name as pluginName } from '../package.json';

/**
 * default multi-input Options
 * */
const defaultOptions = {
  relative: 'src/',
};

// extract the output file name from a file name
const outputFileName = (filePath) => filePath
  .replace(/\.[^/.]+$/, '');

/**
 * Callback for transforming output file path
 *
 * @callback TransformOutputPathFn
 * @param {string} output target file name
 * @param {string} input source file name
 */

/**
 *  multiInput is a rollup plugin to use multiple entry point and preserve the directory
 *  structure in the dist folder
 *
 *  @param {?Object} options
 *  @param {?FastGlob.Options} options.glob - the fast-glob configuration object
 *  @param {?string} options.relative - the base path to remove in the dist folder
 *  @param {?TransformOutputPathFn} options.transformOutputPath - callback function to
 *      transform the destination file name before generation
 *  @return {Plugin} - the rollup plugin config for enable support of multi-entry glob inputs
 * */
export default ({
  glob: globOptions,
  relative = defaultOptions.relative,
  transformOutputPath,
} = defaultOptions) => ({
  pluginName,
  options(conf) {
    // flat to enable input to be a string or an array
    // separate globs inputs string from others to enable input to be a mixed array too
    const [globs, others] = partition([conf.input].flat(), isString);
    // get files from the globs strings and return as a Rollup entries Object
    const input = Object
      .assign(
        {},
        Object.fromEntries(fastGlob
          .sync(globs, globOptions)
          .map((name) => {
            const filePath = path.relative(relative, name);
            const isRelative = !filePath.startsWith('../');
            const relativeFilePath = (isRelative
              ? filePath
              : path.relative('./', name));
            if (transformOutputPath) {
              return [outputFileName(transformOutputPath(relativeFilePath, name)), name];
            }
            return [outputFileName(relativeFilePath), name];
          })),
        // add no globs input to the result
        ...others,
      );
      // return the new configuration with the glob input and the non string inputs
    return {
      ...conf,
      input,
    };
  },
});
