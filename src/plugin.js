import * as fastGlob from 'fast-glob';
import path from 'path';
import fromPairs from 'lodash-es/fromPairs';
import isString from 'lodash-es/isString';
import partition from 'lodash-es/partition';

const pluginName = 'rollup-plugin-multi-input';

/**
 * default multi-input Options
 * */
const defaultOptions = {
  relative: 'src/',
};

// extract the output file name from a file name
const outputFileName = filePath => filePath
  .replace(/\.[^/.]+$/, '');

/**
 *  multiInput is a rollup plugin to use multiple entry point and preserve the directory
 *  structure in the dist folder
 *
 *  @param {?Object} options
 *  @param {?FastGlob.Options} options.glob the fast-glob configuration object
 *  @param {?string} options.relative the base path to remove in the dist folder
 *  @return {Plugin} the rollup plugin config for enable support of multi-entry glob inputs
 * */
export default ({
  glob: globOptions,
  relative = defaultOptions.relative,
} = defaultOptions) => ({
  name: pluginName,
  options(conf) {
    // flat to enable input to be a string or an array
    // separate globs inputs string from others to enable input to be a mixed array too
    const [globs, others] = partition([conf.input].flat(), isString);
    // get files from the globs strings and return as a Rollup entries Object
    const input = Object
      .assign(
        {},
        fromPairs(fastGlob
          .sync(globs, globOptions)
          .map(name => [outputFileName(path.relative(relative, name)), name])),
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
