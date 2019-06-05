import * as fastGlob from 'fast-glob';
import path from 'path';
import { partition } from './utilities';

const pluginName = 'rollup-plugin-multi-input';

/**
 * default multi-input Options
 * */
const defaultOptions = {
  relative: 'src/',
};

/**
 *  multiInput is a rollup plugin to use multiple entry point and preserve the directory
 *  structure in the dist folder
 *
 *  @param {?Object} options
 *  @param {?FastGlob.Options} options.glob the fast-glob configuration object
 *  @param {?string} options.relative the base path to remove in the dist folder
 *  @return {Plugin} the rollup plugin config for enable support of multi-entry glob inputs
 *
 * */
export default ({
  glob: globOptions,
  relative = defaultOptions.relative,
} = defaultOptions) => {
  const formatName = name => path
    .relative(relative, name)
    .replace(/\.[^/.]+$/, '');
  return {
    name: pluginName,
    options(conf) {
      const [globs, others] = [conf.input]
        // flat to enable input to be a string or an array
        .flat()
        // separate globs inputs string from others to enable input to be a mixed array too
        .reduce(partition(e => typeof e === 'string'), []);
      // get files from the globs strings and return as a Rollup entries Object
      const input = Object
        .assign(
          {},
          ...fastGlob
            .sync(globs, globOptions)
            .map(name => ({ [formatName(name)]: name })),
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
